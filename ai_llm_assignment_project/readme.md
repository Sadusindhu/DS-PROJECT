# AI Assignment - Without AI

This project contains five Flask-based mini projects.

## Projects

1. Recipe Creator
2. Packing List Generator
3. Gift Idea Generator
4. WhatsApp Message Improver
5. News Headline Analyzer

## Technologies

- Python
- Flask
- HTML
- CSS
- JavaScript

## Installation

Create a virtual environment:

python -m venv venv

Activate the virtual environment on Windows:

venv\Scripts\activate

Install Flask:

pip install -r requirements.txt

Run the project:

python app.py

Open the project in your browser:

http://127.0.0.1:5000

## Features

The project works without AI, OpenAI, external APIs, or database connections.

JavaScript-based rules are used to generate recipes, packing lists, gift ideas, improved messages, and headline analysis.

## Project Structure

ai_assignment_no_ai/
│
├── app.py
├── requirements.txt
├── .env.example
├── README.md
│
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── recipe.html
│   ├── packing.html
│   ├── gift.html
│   ├── message.html
│   ├── headline.html
│   └── 404.html
│
└── static/
    ├── style.css
    └── app.js