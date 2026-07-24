# 🧠 OmniMemory

> Your Second Brain powered by AI.

OmniMemory is an AI-powered knowledge management system that allows users to upload documents, generate intelligent summaries, store semantic memories, and chat with their personal knowledge base using Retrieval-Augmented Generation (RAG).

Built with a modern full-stack architecture using FastAPI, Next.js, ChromaDB, Groq LLMs, and HuggingFace Embeddings.

---

## ✨ Features

- 🔐 JWT Authentication
- 📂 Upload PDFs, DOCX and TXT
- 🧠 Automatic AI-generated summaries
- 🏷 Keyword & Topic Extraction
- 😊 Sentiment Analysis
- 🌍 Language Detection
- 🔍 Semantic Search
- 💬 AI Chat with Documents
- 📚 Vector Database using ChromaDB
- ⚡ FastAPI Backend
- 🎨 Beautiful Next.js Frontend
- 🚀 REST APIs
- 🔒 Secure User Isolation

---

## 🏗 Architecture

Frontend (Next.js)

↓

FastAPI Backend

↓

Document Processing Pipeline

↓

Chunking

↓

Embeddings (BAAI bge-small-en-v1.5)

↓

ChromaDB Vector Store

↓

Groq Llama 3.3

↓

AI Chat Response

---

## 🛠 Tech Stack

### Frontend

- Next.js
- TypeScript
- TailwindCSS
- Framer Motion

### Backend

- FastAPI
- Python
- JWT Authentication
- SQLite
- ChromaDB

### AI

- Groq Llama 3.3
- HuggingFace Embeddings
- LangChain
- Recursive Text Splitter

---

## 📂 Folder Structure

```
backend/
frontend/
README.md
SYSTEM_DESIGN.md
```

---

## 🚀 Installation

### Clone

```bash
git clone https://github.com/<username>/OmniMemory.git
```

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 📷 Screenshots

Login

Dashboard

Upload

AI Chat

Analytics

(Add screenshots here)

---

## 📌 Roadmap

- [x] Authentication
- [x] AI Chat
- [x] Document Upload
- [x] ChromaDB
- [x] Semantic Search
- [x] Metadata Extraction
- [ ] OCR Support
- [ ] Voice Assistant
- [ ] Mobile App
- [ ] Multi-user Collaboration

---

## 📈 Future Improvements

- Multi-modal RAG
- Image Understanding
- Graph Memory
- Long-term AI Memory
- MCP Integration
- Local LLM Support

---

## 🤝 Contributing

Pull requests are welcome.

For major changes please open an issue first.

---

## 📜 License

MIT License

---

Made with ❤️ by Archit Dogra
