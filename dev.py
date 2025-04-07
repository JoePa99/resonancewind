#!/usr/bin/env python3
"""
Development script for the Brand Resonance App.
This script provides a more robust way to start and stop the application.
"""
import os
import signal
import subprocess
import sys
import time
import atexit

# Process handles
backend_process = None
frontend_process = None

def cleanup():
    """Clean up processes on exit."""
    if backend_process:
        print("Stopping backend server...")
        os.killpg(os.getpgid(backend_process.pid), signal.SIGTERM)
    
    if frontend_process:
        print("Stopping frontend server...")
        os.killpg(os.getpgid(frontend_process.pid), signal.SIGTERM)

def start_backend():
    """Start the backend server."""
    global backend_process
    print("Starting backend server...")
    
    # Activate virtual environment and start backend
    backend_process = subprocess.Popen(
        "source venv/bin/activate && python3 run.py --api-only",
        shell=True,
        preexec_fn=os.setsid,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True
    )
    
    # Wait for backend to start
    time.sleep(2)
    print("Backend server started.")
    return backend_process

def start_frontend():
    """Start the frontend server."""
    global frontend_process
    print("Starting frontend server...")
    
    # Start frontend
    frontend_process = subprocess.Popen(
        "cd frontend && npm start",
        shell=True,
        preexec_fn=os.setsid,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True
    )
    
    # Wait for frontend to start
    time.sleep(2)
    print("Frontend server started.")
    return frontend_process

def main():
    """Main entry point."""
    # Register cleanup handler
    atexit.register(cleanup)
    
    try:
        # Start backend
        backend_proc = start_backend()
        
        # Start frontend
        frontend_proc = start_frontend()
        
        # Monitor processes
        print("\nBrand Resonance App is running!")
        print("Backend: http://localhost:8000")
        print("Frontend: http://localhost:3000")
        print("\nPress Ctrl+C to stop the servers.\n")
        
        # Keep the script running
        while True:
            # Check if processes are still running
            if backend_proc.poll() is not None:
                print("Backend server stopped unexpectedly. Restarting...")
                backend_proc = start_backend()
            
            if frontend_proc.poll() is not None:
                print("Frontend server stopped unexpectedly. Restarting...")
                frontend_proc = start_frontend()
            
            time.sleep(1)
    
    except KeyboardInterrupt:
        print("\nStopping servers...")
        cleanup()
        print("Servers stopped.")

if __name__ == "__main__":
    main()
