# Getting Started with Brand Resonance App

This guide will help you set up and run the Brand Resonance App on your local machine.

## Prerequisites

- Python 3.9+ installed
- Node.js 14+ installed
- OpenAI API key (for AI Mode)

## Setup

### 1. Clone the Repository

If you haven't already, clone the repository to your local machine:

```bash
git clone <repository-url>
cd resonance3
```

### 2. Automated Setup

The easiest way to set up the application is to use the provided setup script:

```bash
./setup.sh
```

This script will:
- Create a Python virtual environment
- Install backend dependencies
- Install the required spaCy model
- Create the data directory
- Install frontend dependencies
- Prompt you for your OpenAI API key

### 3. Manual Setup

If you prefer to set up manually, follow these steps:

#### Backend Setup

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```

3. Install spaCy model:
   ```bash
   python3 -m spacy download en_core_web_sm
   ```

4. Set up your environment variables by copying the example file and adding your OpenAI API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Running Both Backend and Frontend

To run both the backend and frontend together:

```bash
python3 run.py
```

This will start:
- The FastAPI backend on http://localhost:8000
- The React frontend on http://localhost:3000

### Running Backend Only

To run only the backend:

```bash
python3 run.py --api-only
```

### Running Frontend Only

To run only the frontend:

```bash
python3 run.py --frontend-only
```

## Testing the Application

To verify that the application is working correctly:

1. Start the backend:
   ```bash
   python3 run.py --api-only
   ```

2. In a separate terminal, run the test script:
   ```bash
   python3 test_app.py
   ```

This will test:
- API connectivity
- Brand creation
- Brand analysis (if OpenAI API key is set)

## Using the Application

1. Open your browser and navigate to http://localhost:3000
2. Start by analyzing a brand:
   - Click "Analyze Brand" on the dashboard
   - Enter the brand name, industry, and optional additional context
   - Click "Next" and then "Analyze Brand"
3. View the analysis results and explore the detailed metrics
4. Compare multiple brands by using the "Compare Brands" feature

## Troubleshooting

### OpenAI API Key Issues

If you see errors related to the OpenAI API:
1. Make sure your API key is correctly set in the `.env` file
2. Verify that your OpenAI account has sufficient credits
3. Check that you have access to the model specified in the code (default: gpt-4)

### Backend Connection Issues

If the frontend cannot connect to the backend:
1. Ensure the backend is running on http://localhost:8000
2. Check that the `REACT_APP_API_URL` in `.env` is set correctly
3. Look for CORS-related errors in the browser console

### Frontend Build Issues

If you encounter issues with the frontend:
1. Make sure Node.js is installed and is version 14 or higher
2. Try deleting the `node_modules` folder and running `npm install` again
3. Check for any error messages in the terminal where you started the frontend

## Next Steps

After getting the application running, you might want to:

1. Explore the code structure to understand how it works
2. Read the documentation on extending to Hybrid Mode in `docs/hybrid_mode_extension.md`
3. Customize the application for your specific needs
4. Add real data sources by implementing the Hybrid Mode
