"""
Run script for the Brand Resonance App.
"""
import os
import argparse
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_api():
    """Run the FastAPI backend server."""
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    
    print(f"Starting Brand Resonance API on http://{host}:{port}")
    uvicorn.run("api.main:app", host=host, port=port, reload=True)

def run_frontend():
    """Run the React frontend development server."""
    os.chdir("frontend")
    os.system("npm start")
    # Change back to the original directory after npm start
    os.chdir("..")

def main():
    """Main entry point for the application."""
    parser = argparse.ArgumentParser(description="Run the Brand Resonance App")
    parser.add_argument("--api-only", action="store_true", help="Run only the API server")
    parser.add_argument("--frontend-only", action="store_true", help="Run only the frontend server")
    
    args = parser.parse_args()
    
    if args.api_only:
        run_api()
    elif args.frontend_only:
        run_frontend()
    else:
        # Run both in separate processes
        import multiprocessing
        
        api_process = multiprocessing.Process(target=run_api)
        frontend_process = multiprocessing.Process(target=run_frontend)
        
        api_process.start()
        frontend_process.start()
        
        try:
            api_process.join()
            frontend_process.join()
        except KeyboardInterrupt:
            print("Shutting down...")
            api_process.terminate()
            frontend_process.terminate()

if __name__ == "__main__":
    main()
