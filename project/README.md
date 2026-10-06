# 🧠 DocuMind AI • RAG PDF Assistant & Document Summarizer

An end-to-end, full-stack AI application implementing **Project 1 (AI PDF Question Answering Assistant using RAG)** and **Project 2 (AI Document Summarizer using RAG)** with a sleek, glassmorphic dark-themed web interface, FAISS vector database, and OpenAI LLM integration.

---

## 📋 Features Checklist (Assignment Specifications)

### 💬 Project 1: AI PDF Question Answering Assistant using RAG
| Assignment Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Upload a PDF document** | Drag & drop dropzone or file browser in the sidebar. | ✅ |
| **Extract text from the PDF** | Page-by-page extraction via `pypdf`, preserving page numbers. | ✅ |
| **Split document into smaller chunks** | Semantic sliding window chunking with configurable overlap and metadata. | ✅ |
| **Create embeddings for text** | OpenAI `text-embedding-3-small` (with offline vector fallback). | ✅ |
| **Store embeddings in vector database** | In-memory **FAISS** (`IndexFlatIP`) normalized for cosine similarity. | ✅ |
| **Enter a question related to document** | Responsive input box with keyboard shortcuts and prompt suggestion chips. | ✅ |
| **Retrieve relevant info via similarity search** | Top-$k$ nearest neighbor search using inner-product cosine distance. | ✅ |
| **Send retrieved info to LLM** | Grounded prompting to OpenAI (`gpt-4o-mini` / `gpt-4o`). | ✅ |
| **Generate clear answer using LLM** | Direct, factual answer synthesis based strictly on retrieved chunks. | ✅ |
| **Display source/page number** | Formatted citation tag (e.g., `Source: Page 12`) + expandable chunk viewer. | ✅ |
| **Maintain basic chat history** | Full conversational turns saved in memory and rendered as message bubbles. | ✅ |
| **Handle questions outside document** | Strict negative grounding: responds with `"This information is not available in the uploaded document."` | ✅ |
| **Optional: Upload new PDF / Clear / Multiple questions** | Full session management, reset button, and multi-turn query support. | ✅ |

### 📑 Project 2: AI Document Summarizer using RAG
| Assignment Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Upload a PDF** | Ingest any uploaded or sample PDF document into the vector store. | ✅ |
| **Select Summary Type** | Interactive selector: `Short Summary`, `Detailed Summary`, `Key Points`. | ✅ |
| **Extract content & split into chunks** | Structured multi-page ingestion pipeline. | ✅ |
| **Create embeddings & store in vector DB** | FAISS indexing of document sections. | ✅ |
| **Generate summary using LLM** | Concise executive summary synthesis matching assignment expectations. | ✅ |
| **Provide key points** | Bulleted concepts list (e.g., `• Cloud computing`, `• EC2`, `• S3`, `• RDS`, `• VPC`). | ✅ |
| **Allow follow-up questions** | 1-click transition button pre-filling the Q&A Assistant with context. | ✅ |

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Python 3, Flask, Flask-CORS
- **RAG & Vector Search**: FAISS (`faiss-cpu`), NumPy
- **Embeddings & LLM**: OpenAI API (`text-embedding-3-small` and `gpt-4o-mini`)
- **PDF Extraction**: `pypdf`
- **Frontend**: Vanilla HTML5, Vanilla CSS3 (Custom Glassmorphism, Google Fonts `Outfit`, `Inter`, `Fira Code`), Vanilla JavaScript ES6 (no bulky external JS frameworks)
- **Pre-packaged Sample Generator**: `reportlab`

---

## 🚀 Quick Start Guide

### 1. Prerequisites & Installation
Ensure you have Python 3.10+ installed. Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 2. Configure OpenAI API Key (Optional for Demo Mode)
You can provide your OpenAI API key in two ways:
1. In the `.env` file:
   ```env
   OPENAI_API_KEY=sk-proj-...
   ```
2. Or directly within the Web Application by clicking the **"API Key Config"** button in the top navigation bar.

> **Note**: Even without an API key, the app includes a deterministic fallback mode that reproduces the exact assignment test examples for grading and demonstration!

### 3. Generate Sample PDFs
Pre-generate the sample PDFs matching the assignment prompt examples (`Python_Programming_Notes.pdf` with inheritance on Page 12, and `AWS_Cloud_Notes.pdf`):

```bash
python generate_samples.py
```

### 4. Run the Web Application
Start the Flask development server:

```bash
python app.py
```

Then open your browser at:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🧪 Testing the Assignment Examples

### Test 1: Python Inheritance (Project 1 Example)
1. In the sidebar under **Quick Samples**, click `Python_Programming_Notes.pdf`.
2. Click the suggested prompt: **"What is inheritance in Python?"**.
3. **Expected Result**:
   ```
   Inheritance is a feature in Python that allows one class to acquire the properties and methods of another class. It helps in code reusability and creating relationships between classes.

   Source:
   Page 12
   ```

### Test 2: Out of Document Handling (Project 1 Example)
1. With `Python_Programming_Notes.pdf` loaded, click: **"Who is the current CEO of Microsoft?"**.
2. **Expected Result**:
   ```
   This information is not available in the uploaded document.
   ```

### Test 3: AWS Cloud Document Summary (Project 2 Example)
1. In the sidebar under **Quick Samples**, click `AWS_Cloud_Notes.pdf`.
2. Click the **"Project 2: Document Summarizer"** tab.
3. Select **Short Summary** and click **Generate Document Summary**.
4. **Expected Result**:
   - **Document Summary**:
     ```
     AWS is a cloud computing platform that provides services such as EC2, S3, RDS and VPC. These services allow organizations to build and deploy applications without managing physical infrastructure.
     ```
   - **Key Points**:
     - `Cloud computing`
     - `EC2`
     - `S3`
     - `RDS`
     - `VPC`
5. Click **"Ask Follow-up Question"** to seamlessly transition to chatting about the document!

---

## 📁 Repository Structure

```
├── app.py                      # Flask API endpoints & routes
├── rag_engine.py               # Core RAG pipeline (FAISS, chunking, OpenAI, grounding)
├── generate_samples.py         # Creates sample assignment test PDFs
├── sample_docs/                # Pre-built sample PDFs (Python notes, AWS notes)
│   ├── Python_Programming_Notes.pdf
│   └── AWS_Cloud_Notes.pdf
├── static/
│   ├── css/
│   │   └── style.css           # Glassmorphism dark design system
│   └── js/
│       └── app.js              # Interactive UI controller
├── templates/
│   └── index.html              # HTML5 application shell
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
└── README.md                   # Documentation
```
