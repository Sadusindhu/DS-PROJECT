/**
 * DocuMind RAG • Frontend Controller
 * Handles PDF uploads, FAISS vector indexing, Q&A Assistant, Document Summarizer,
 * RAG Vector Explorer, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        activeDocument: null,
        totalPages: 0,
        totalChunks: 0,
        hasOpenAIKey: false,
        model: 'gpt-4o-mini',
        activeTab: 'tabQA'
    };

    // DOM Elements - Navigation & Actions
    const tabBtns = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const btnOpenConfig = document.getElementById('btnOpenConfig');
    const btnClearDoc = document.getElementById('btnClearDoc');
    const apiKeyStatusText = document.getElementById('apiKeyStatusText');
    const modelBadge = document.getElementById('modelBadge');

    // DOM Elements - Upload & Sidebar
    const dropzone = document.getElementById('dropzone');
    const pdfFileInput = document.getElementById('pdfFileInput');
    const uploadLoader = document.getElementById('uploadLoader');
    const uploadProgressText = document.getElementById('uploadProgressText');
    const btnLoadPythonSample = document.getElementById('btnLoadPythonSample');
    const btnLoadAwsSample = document.getElementById('btnLoadAwsSample');
    const docInfoCard = document.getElementById('docInfoCard');
    const activeDocFilename = document.getElementById('activeDocFilename');
    const docTotalPages = document.getElementById('docTotalPages');
    const docTotalChunks = document.getElementById('docTotalChunks');
    const docVectorDim = document.getElementById('docVectorDim');
    const btnPreviewPdf = document.getElementById('btnPreviewPdf');

    // DOM Elements - Tab 1: Q&A Assistant
    const qaForm = document.getElementById('qaForm');
    const qaInput = document.getElementById('qaInput');
    const btnSendQA = document.getElementById('btnSendQA');
    const btnClearChat = document.getElementById('btnClearChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatWelcomeBanner = document.getElementById('chatWelcomeBanner');
    const qaSuggestions = document.getElementById('qaSuggestions');

    // DOM Elements - Tab 2: Summarizer
    const btnGenerateSummary = document.getElementById('btnGenerateSummary');
    const summaryResultsContainer = document.getElementById('summaryResultsContainer');
    const summaryTextOutput = document.getElementById('summaryTextOutput');
    const keyPointsList = document.getElementById('keyPointsList');
    const btnCopySummary = document.getElementById('btnCopySummary');
    const btnSwitchToQA = document.getElementById('btnSwitchToQA');
    const summaryTypePills = document.querySelectorAll('.type-radio-pill');

    // DOM Elements - Tab 3: RAG Explorer
    const chunksGrid = document.getElementById('chunksGrid');
    const explorerChunkCount = document.getElementById('explorerChunkCount');
    const explorerSearchInput = document.getElementById('explorerSearchInput');
    const btnTestSearch = document.getElementById('btnTestSearch');

    // DOM Elements - Modals
    const configModal = document.getElementById('configModal');
    const btnCloseConfigModal = document.getElementById('btnCloseConfigModal');
    const btnCancelConfig = document.getElementById('btnCancelConfig');
    const btnSaveConfig = document.getElementById('btnSaveConfig');
    const inputApiKey = document.getElementById('inputApiKey');
    const selectModel = document.getElementById('selectModel');
    const btnToggleKeyVis = document.getElementById('btnToggleKeyVis');

    const pdfModal = document.getElementById('pdfModal');
    const btnClosePdfModal = document.getElementById('btnClosePdfModal');
    const pdfViewerIframe = document.getElementById('pdfViewerIframe');
    const pdfModalTitle = document.getElementById('pdfModalTitle');

    const toastContainer = document.getElementById('toastContainer');

    // -------------------------------------------------------------------------
    // Toast Notification Utility
    // -------------------------------------------------------------------------
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(30px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // -------------------------------------------------------------------------
    // System Status Initialization
    // -------------------------------------------------------------------------
    async function fetchSystemStatus() {
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            state.activeDocument = data.active_document;
            state.totalPages = data.total_pages;
            state.totalChunks = data.total_chunks;
            state.hasOpenAIKey = data.has_openai_key;
            state.model = data.model;

            updateStatusUI();
            if (state.activeDocument) {
                loadIndexedChunks();
            }
        } catch (err) {
            console.error('Failed to fetch status:', err);
        }
    }

    function updateStatusUI() {
        modelBadge.textContent = state.model;
        if (state.hasOpenAIKey) {
            apiKeyStatusText.textContent = 'API Key Configured';
            apiKeyStatusText.style.color = '#34d399';
        } else {
            apiKeyStatusText.textContent = 'Demo Mode (Add Key)';
            apiKeyStatusText.style.color = '#94a3b8';
        }

        if (state.activeDocument) {
            docInfoCard.style.display = 'block';
            activeDocFilename.textContent = state.activeDocument;
            docTotalPages.textContent = state.totalPages;
            docTotalChunks.textContent = state.totalChunks;
            docVectorDim.textContent = state.hasOpenAIKey ? '1536' : 'Term-V';
        } else {
            docInfoCard.style.display = 'none';
        }
    }

    // -------------------------------------------------------------------------
    // Tabs Navigation
    // -------------------------------------------------------------------------
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) targetPane.classList.add('active');
            state.activeTab = targetTab;

            if (targetTab === 'tabExplorer') {
                loadIndexedChunks();
            }
        });
    });

    // -------------------------------------------------------------------------
    // Upload & Drag-and-Drop Handling
    // -------------------------------------------------------------------------
    dropzone.addEventListener('click', () => pdfFileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            handleFileUpload(files[0]);
        } else {
            showToast('Please upload a valid PDF document.', 'error');
        }
    });

    pdfFileInput.addEventListener('change', () => {
        if (pdfFileInput.files.length > 0) {
            handleFileUpload(pdfFileInput.files[0]);
        }
    });

    async function handleFileUpload(file) {
        uploadLoader.style.display = 'flex';
        uploadProgressText.textContent = `Extracting & Indexing ${file.name}...`;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            showToast(`Document "${file.name}" indexed successfully!`, 'success');
            await fetchSystemStatus();
            clearChatWindow();
            summaryResultsContainer.style.display = 'none';
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            uploadLoader.style.display = 'none';
            pdfFileInput.value = '';
        }
    }

    // -------------------------------------------------------------------------
    // Quick Load Sample Documents (Assignment Demos)
    // -------------------------------------------------------------------------
    btnLoadPythonSample.addEventListener('click', () => loadSampleDoc('Python_Programming_Notes.pdf'));
    btnLoadAwsSample.addEventListener('click', () => loadSampleDoc('AWS_Cloud_Notes.pdf'));

    async function loadSampleDoc(filename) {
        uploadLoader.style.display = 'flex';
        uploadProgressText.textContent = `Loading ${filename}...`;

        try {
            const res = await fetch('/api/load-sample', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to load sample');
            }

            showToast(`Loaded sample: ${filename}`, 'success');
            await fetchSystemStatus();
            clearChatWindow();
            summaryResultsContainer.style.display = 'none';

            // Auto-trigger appropriate demo prompt hint
            if (filename.includes('Python')) {
                document.getElementById('tabBtnQA').click();
            } else if (filename.includes('AWS')) {
                document.getElementById('tabBtnSummary').click();
            }
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            uploadLoader.style.display = 'none';
        }
    }

    // -------------------------------------------------------------------------
    // Clear Document Action
    // -------------------------------------------------------------------------
    btnClearDoc.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to clear the active document, vectors, and chat history?')) return;
        try {
            const res = await fetch('/api/clear', { method: 'POST' });
            if (res.ok) {
                showToast('Document and history cleared.', 'info');
                clearChatWindow();
                summaryResultsContainer.style.display = 'none';
                chunksGrid.innerHTML = '<div class="empty-state">No document currently loaded.</div>';
                explorerChunkCount.textContent = '0 Chunks';
                await fetchSystemStatus();
            }
        } catch (err) {
            showToast('Failed to clear document.', 'error');
        }
    });

    // -------------------------------------------------------------------------
    // Tab 1: Q&A Assistant Logic
    // -------------------------------------------------------------------------
    qaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = qaInput.value.trim();
        if (query) {
            sendQuestion(query);
            qaInput.value = '';
            qaInput.style.height = 'auto';
        }
    });

    qaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            qaForm.dispatchEvent(new Event('submit'));
        }
    });

    // Query chips
    qaSuggestions.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip-query');
        if (btn) {
            const query = btn.getAttribute('data-query');
            sendQuestion(query);
        }
    });

    btnClearChat.addEventListener('click', () => {
        clearChatWindow();
        showToast('Chat history cleared.', 'info');
    });

    function clearChatWindow() {
        chatMessages.innerHTML = '';
        if (chatWelcomeBanner) {
            chatMessages.appendChild(chatWelcomeBanner);
        }
    }

    async function sendQuestion(question) {
        if (!state.activeDocument) {
            showToast('Please upload a PDF or select a sample first.', 'error');
            return;
        }

        // Hide welcome banner if visible
        const welcome = document.getElementById('chatWelcomeBanner');
        if (welcome) welcome.style.display = 'none';

        // Append User Message
        appendUserMessage(question);

        // Append Skeleton / Thinking Bubble
        const loadingId = appendLoadingBubble();

        try {
            const res = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });
            const data = await res.json();

            removeLoadingBubble(loadingId);

            if (!res.ok) {
                appendAssistantMessage({
                    answer: `Error: ${data.error || 'Failed to generate response'}`,
                    found_in_document: false,
                    sources: []
                });
                return;
            }

            appendAssistantMessage(data);
        } catch (err) {
            removeLoadingBubble(loadingId);
            appendAssistantMessage({
                answer: `Network Error: ${err.message}`,
                found_in_document: false,
                sources: []
            });
        }
    }

    function appendUserMessage(text) {
        const row = document.createElement('div');
        row.className = 'message-row user';
        row.innerHTML = `
            <div class="message-bubble">
                <p>${escapeHtml(text)}</p>
            </div>
        `;
        chatMessages.appendChild(row);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendLoadingBubble() {
        const id = 'loader-' + Date.now();
        const row = document.createElement('div');
        row.id = id;
        row.className = 'message-row assistant';
        row.innerHTML = `
            <div class="message-avatar assistant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                </svg>
            </div>
            <div class="message-bubble">
                <div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>
            </div>
        `;
        chatMessages.appendChild(row);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeLoadingBubble(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function appendAssistantMessage(data) {
        const row = document.createElement('div');
        row.className = 'message-row assistant';

        const isFound = data.found_in_document !== false;
        const answerText = data.answer || '';
        const isOutOfDoc = !isFound || answerText.toLowerCase().includes('not available in the uploaded document');

        let contentHtml = '';

        if (isOutOfDoc) {
            contentHtml = `
                <div class="out-of-doc-callout">
                    <span style="font-size: 18px;">🚫</span>
                    <span>${escapeHtml(answerText)}</span>
                </div>
            `;
        } else {
            // Clean answer text for display
            let displayAnswer = answerText;
            // Check if source was already appended in answerText or separate
            let sourcePageText = '';
            if (data.primary_pages && data.primary_pages.length > 0) {
                sourcePageText = data.primary_pages.map(p => `Page ${p}`).join(', ');
            } else if (data.sources && data.sources.length > 0) {
                const pages = [...new Set(data.sources.map(s => s.page))];
                sourcePageText = pages.map(p => `Page ${p}`).join(', ');
            }

            contentHtml = `
                <div class="answer-text">${formatMarkdown(displayAnswer)}</div>
            `;

            if (sourcePageText && !displayAnswer.toLowerCase().includes('source:')) {
                contentHtml += `
                    <div class="citation-box">
                        <span class="citation-title">Source:</span>
                        <span class="source-page-badge">📄 ${sourcePageText}</span>
                    </div>
                `;
            }

            // Expandable retrieved chunks inspector
            if (data.sources && data.sources.length > 0) {
                const drawerId = 'chunks-drawer-' + Date.now();
                contentHtml += `
                    <div style="margin-top: 10px;">
                        <button class="btn-view-chunks" onclick="document.getElementById('${drawerId}').style.display = document.getElementById('${drawerId}').style.display === 'none' ? 'block' : 'none'">
                            View Retrieved Chunks (${data.sources.length}) &darr;
                        </button>
                        <div id="${drawerId}" class="retrieved-chunks-drawer" style="display: none;">
                            ${data.sources.map((s, idx) => `
                                <div style="margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
                                    <strong>Chunk #${idx + 1} (Page ${s.page})</strong> - <em>Score: ${s.score}</em><br/>
                                    ${escapeHtml(s.text.slice(0, 200))}...
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }

        row.innerHTML = `
            <div class="message-avatar assistant">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                    <path d="M12 12l6.8-6.8"></path>
                </svg>
            </div>
            <div class="message-bubble">
                ${contentHtml}
            </div>
        `;

        chatMessages.appendChild(row);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // -------------------------------------------------------------------------
    // Tab 2: Document Summarizer Logic (Project 2)
    // -------------------------------------------------------------------------
    summaryTypePills.forEach(pill => {
        pill.addEventListener('click', () => {
            summaryTypePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const radio = pill.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    btnGenerateSummary.addEventListener('click', async () => {
        if (!state.activeDocument) {
            showToast('Please upload a PDF document or load a sample first.', 'error');
            return;
        }

        const selectedRadio = document.querySelector('input[name="summaryType"]:checked');
        const summaryType = selectedRadio ? selectedRadio.value : 'short';

        const originalBtnHtml = btnGenerateSummary.innerHTML;
        btnGenerateSummary.disabled = true;
        btnGenerateSummary.innerHTML = `
            <div class="spinner" style="width: 18px; height: 18px; border-width: 2px;"></div>
            <span>Synthesizing Summary &amp; Key Points...</span>
        `;

        try {
            const res = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ summary_type: summaryType })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate summary');
            }

            renderSummaryResults(data);
            showToast('Summary and Key Points generated successfully!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            btnGenerateSummary.disabled = false;
            btnGenerateSummary.innerHTML = originalBtnHtml;
        }
    });

    function renderSummaryResults(data) {
        summaryResultsContainer.style.display = 'flex';
        summaryTextOutput.textContent = data.summary || 'Summary generated.';

        // Populate Key Points
        keyPointsList.innerHTML = '';
        const points = data.key_points || [];
        if (points.length > 0) {
            points.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                keyPointsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Key concepts extracted';
            keyPointsList.appendChild(li);
        }

        // Scroll to results
        summaryResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    btnCopySummary.addEventListener('click', () => {
        const text = summaryTextOutput.textContent;
        const points = Array.from(keyPointsList.querySelectorAll('li')).map(l => '• ' + l.textContent).join('\n');
        const fullCopy = `Document Summary:\n${text}\n\nKey Points:\n${points}`;
        navigator.clipboard.writeText(fullCopy).then(() => {
            showToast('Summary copied to clipboard!', 'success');
        });
    });

    btnSwitchToQA.addEventListener('click', () => {
        document.getElementById('tabBtnQA').click();
        qaInput.value = 'Can you explain more details about this document?';
        qaInput.focus();
    });

    // -------------------------------------------------------------------------
    // Tab 3: RAG Explorer & Chunks Inspector
    // -------------------------------------------------------------------------
    async function loadIndexedChunks() {
        if (!state.activeDocument) {
            chunksGrid.innerHTML = '<div class="empty-state">No document currently loaded.</div>';
            explorerChunkCount.textContent = '0 Chunks';
            return;
        }

        try {
            const res = await fetch('/api/chunks');
            const data = await res.json();
            explorerChunkCount.textContent = `${data.total_chunks} Chunks Indexed`;

            renderChunks(data.chunks || []);
        } catch (err) {
            console.error('Failed to load chunks:', err);
        }
    }

    function renderChunks(chunks) {
        if (!chunks || chunks.length === 0) {
            chunksGrid.innerHTML = '<div class="empty-state">No chunks available.</div>';
            return;
        }

        chunksGrid.innerHTML = '';
        chunks.forEach(c => {
            const card = document.createElement('div');
            card.className = 'chunk-card';
            card.innerHTML = `
                <div class="chunk-header">
                    <span class="chunk-id-tag">Chunk #${c.id}</span>
                    <span class="source-page-badge" style="font-size: 11px;">Page ${c.page}</span>
                </div>
                <div class="chunk-text-preview">${escapeHtml(c.text)}</div>
            `;
            chunksGrid.appendChild(card);
        });
    }

    btnTestSearch.addEventListener('click', async () => {
        const q = explorerSearchInput.value.trim();
        if (!q) {
            showToast('Enter a query to test similarity search.', 'info');
            return;
        }
        if (!state.activeDocument) {
            showToast('Upload a document first.', 'error');
            return;
        }

        try {
            const res = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: q, top_k: 6 })
            });
            const data = await res.json();

            if (data.sources && data.sources.length > 0) {
                chunksGrid.innerHTML = '';
                data.sources.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'chunk-card';
                    card.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                    card.innerHTML = `
                        <div class="chunk-header">
                            <span class="source-page-badge">Page ${s.page}</span>
                            <span class="chunk-score-pill">Cosine Score: ${s.score}</span>
                        </div>
                        <div class="chunk-text-preview">${escapeHtml(s.text)}</div>
                    `;
                    chunksGrid.appendChild(card);
                });
                showToast(`Retrieved ${data.sources.length} matching chunks!`, 'success');
            } else {
                showToast('No matching chunks retrieved.', 'info');
            }
        } catch (err) {
            showToast('Search test error.', 'error');
        }
    });

    // -------------------------------------------------------------------------
    // Modals: Configuration & PDF Preview
    // -------------------------------------------------------------------------
    btnOpenConfig.addEventListener('click', () => {
        configModal.style.display = 'flex';
    });

    btnCloseConfigModal.addEventListener('click', () => configModal.style.display = 'none');
    btnCancelConfig.addEventListener('click', () => configModal.style.display = 'none');

    btnToggleKeyVis.addEventListener('click', () => {
        inputApiKey.type = inputApiKey.type === 'password' ? 'text' : 'password';
    });

    btnSaveConfig.addEventListener('click', async () => {
        const key = inputApiKey.value.trim();
        const model = selectModel.value;

        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_key: key, model: model })
            });
            const data = await res.json();

            if (res.ok) {
                state.hasOpenAIKey = data.has_openai_key;
                state.model = data.model;
                updateStatusUI();
                configModal.style.display = 'none';
                showToast('OpenAI Configuration saved!', 'success');
            }
        } catch (err) {
            showToast('Failed to save config.', 'error');
        }
    });

    btnPreviewPdf.addEventListener('click', () => {
        if (!state.activeDocument) return;
        pdfModalTitle.textContent = `PDF Document Preview: ${state.activeDocument}`;
        pdfViewerIframe.src = `/api/pdf/${encodeURIComponent(state.activeDocument)}`;
        pdfModal.style.display = 'flex';
    });

    btnClosePdfModal.addEventListener('click', () => {
        pdfModal.style.display = 'none';
        pdfViewerIframe.src = '';
    });

    // Close modals on outside backdrop click
    [configModal, pdfModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (modal === pdfModal) pdfViewerIframe.src = '';
            }
        });
    });

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatMarkdown(str) {
        if (!str) return '';
        let escaped = escapeHtml(str);
        // Format bold
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Format newlines
        escaped = escaped.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>');
        return escaped;
    }

    // Auto resize input textarea
    qaInput.addEventListener('input', () => {
        qaInput.style.height = 'auto';
        qaInput.style.height = Math.min(qaInput.scrollHeight, 120) + 'px';
    });

    // Initial load
    fetchSystemStatus();
});
