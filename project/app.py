"""
Flask Web Application for AI PDF Question Answering Assistant & Document Summarizer using RAG.
Supports:
- PDF upload & text extraction
- FAISS vector indexing & similarity search
- Grounded Q&A with page number citations
- Out-of-document query handling
- Document summarization with key points
- Sample document quick loading
- Live PDF preview
"""

import os
import shutil
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from rag_engine import RAGEngine

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
SAMPLE_FOLDER = os.path.join(BASE_DIR, 'sample_docs')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SAMPLE_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # 32MB max

# Initialize RAG Engine
initial_api_key = os.getenv("OPENAI_API_KEY", "")
rag = RAGEngine(api_key=initial_api_key)

# In-memory chat history
chat_history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/status', methods=['GET'])
def get_status():
    """Returns current active document and system status."""
    return jsonify({
        "active_document": rag.current_filename,
        "total_pages": rag.total_pages,
        "total_chunks": len(rag.chunks),
        "vector_dimension": rag.embedding_dim if rag.faiss_index else 0,
        "has_openai_key": rag.has_valid_api_key(),
        "model": rag.model,
        "embedding_mode": "OpenAI Embeddings" if (rag.has_valid_api_key() and not rag.use_fallback_embeddings) else "FAISS Vector Store (Term Vectors/Offline)",
        "chat_messages_count": len(chat_history)
    })

@app.route('/api/config', methods=['POST'])
def set_config():
    """Sets or updates OpenAI API key and model."""
    data = request.get_json() or {}
    api_key = data.get('api_key', '').strip()
    model = data.get('model', 'gpt-4o-mini')

    if api_key:
        rag.set_api_key(api_key)
    rag.model = model

    # Re-embed if document is already loaded
    if rag.chunks and rag.has_valid_api_key():
        try:
            chunk_texts = [c["text"] for c in rag.chunks]
            rag.embeddings = rag.generate_embeddings(chunk_texts)
            import faiss
            dim = rag.embeddings.shape[1]
            rag.faiss_index = faiss.IndexFlatIP(dim)
            rag.faiss_index.add(rag.embeddings)
        except Exception as e:
            print(f"Re-embedding error: {e}")

    return jsonify({
        "success": True,
        "has_openai_key": rag.has_valid_api_key(),
        "model": rag.model
    })

@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    """Handles PDF file upload and triggers RAG ingestion."""
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files are supported"}), 400

    filename = file.filename
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    try:
        # Ingest into RAG engine
        stats = rag.ingest_pdf(save_path, filename)
        # Reset chat history for new document
        chat_history.clear()
        return jsonify({
            "success": True,
            "stats": stats
        })
    except Exception as e:
        return jsonify({"error": f"Failed to process PDF: {str(e)}"}), 500

@app.route('/api/load-sample', methods=['POST'])
def load_sample():
    """Loads a pre-generated sample PDF document."""
    data = request.get_json() or {}
    filename = data.get('filename')

    if not filename:
        return jsonify({"error": "Filename is required"}), 400

    src_path = os.path.join(SAMPLE_FOLDER, filename)
    if not os.path.exists(src_path):
        return jsonify({"error": f"Sample file {filename} not found"}), 404

    dest_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    shutil.copyfile(src_path, dest_path)

    try:
        stats = rag.ingest_pdf(dest_path, filename)
        chat_history.clear()
        return jsonify({
            "success": True,
            "stats": stats
        })
    except Exception as e:
        return jsonify({"error": f"Failed to ingest sample: {str(e)}"}), 500

@app.route('/api/query', methods=['POST'])
def query_assistant():
    """Handles question answering on the ingested PDF."""
    data = request.get_json() or {}
    question = data.get('question', '').strip()

    if not question:
        return jsonify({"error": "Question cannot be empty"}), 400

    if not rag.current_filename:
        return jsonify({"error": "Please upload a PDF document before asking questions."}), 400

    result = rag.query_qa(question)

    # Append to chat history
    chat_history.append({
        "role": "user",
        "text": question
    })
    chat_history.append({
        "role": "assistant",
        "text": result.get("answer"),
        "sources": result.get("sources", []),
        "found_in_document": result.get("found_in_document", False)
    })

    return jsonify(result)

@app.route('/api/summarize', methods=['POST'])
def summarize_doc():
    """Handles Project 2 document summarization."""
    data = request.get_json() or {}
    summary_type = data.get('summary_type', 'short')

    if not rag.current_filename:
        return jsonify({"error": "Please upload a PDF document before generating a summary."}), 400

    result = rag.summarize_document(summary_type)
    return jsonify(result)

@app.route('/api/clear', methods=['POST'])
def clear_all():
    """Clears active document, FAISS index, and chat history."""
    rag.clear()
    chat_history.clear()
    return jsonify({"success": True, "message": "Document and chat history cleared successfully."})

@app.route('/api/history', methods=['GET'])
def get_history():
    """Returns the current chat history."""
    return jsonify({"history": chat_history})

@app.route('/api/chunks', methods=['GET'])
def get_chunks():
    """Returns indexed chunks for RAG Explorer visualization."""
    return jsonify({
        "filename": rag.current_filename,
        "total_chunks": len(rag.chunks),
        "chunks": rag.chunks
    })

@app.route('/api/pdf/<filename>')
def serve_pdf(filename):
    """Serves the PDF file for browser viewing."""
    # Check upload folder first, then sample folder
    if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    elif os.path.exists(os.path.join(SAMPLE_FOLDER, filename)):
        return send_from_directory(SAMPLE_FOLDER, filename)
    return "File not found", 404

if __name__ == '__main__':
    print("Starting AI PDF RAG Assistant & Summarizer on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
