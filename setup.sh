#!/bin/bash

# Brand Resonance App Setup Script

echo "Setting up Brand Resonance App..."

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip3 install -r requirements.txt

# Install spaCy model
echo "Installing spaCy model..."
python3 -m spacy download en_core_web_sm

# Create data directory
echo "Creating data directory..."
mkdir -p data

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Prompt for OpenAI API key
echo ""
echo "To use the AI features, you need an OpenAI API key."
read -p "Enter your OpenAI API key (leave blank to skip): " openai_key

if [ ! -z "$openai_key" ]; then
    # Update .env file with the API key
    sed -i '' "s/OPENAI_API_KEY=/OPENAI_API_KEY=$openai_key/" .env
    echo "API key saved to .env file."
else
    echo "No API key provided. You can add it later in the .env file."
fi

echo ""
echo "Setup complete! You can now run the application with:"
echo "python3 run.py"
echo ""
echo "Or run the backend and frontend separately with:"
echo "python3 run.py --api-only"
echo "python3 run.py --frontend-only"
