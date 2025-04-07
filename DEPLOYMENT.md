# Deploying the Brand Resonance App

This guide explains how to deploy the Brand Resonance App using a split deployment approach:
- Frontend: Deployed to Vercel
- Backend: Deployed to Render.com

## Why Split Deployment?

The Python backend with all its dependencies exceeds Vercel's 250MB limit for serverless functions. By deploying the frontend and backend separately, we can take advantage of each platform's strengths.

## Step 1: Deploy the Backend to Render.com

1. **Sign up for Render.com**:
   - Go to [render.com](https://render.com) and create an account

2. **Create a new Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

3. **Configure the Service**:
   - Name: `brand-resonance-api` (or your preferred name)
   - Runtime: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**:
   - OPENAI_API_KEY: Your OpenAI API key
   - PORT: 10000 (or let Render assign one)
   - PYTHON_VERSION: 3.9.0

5. **Create Web Service**:
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Note the URL of your deployed API (e.g., `https://brand-resonance-api.onrender.com`)

## Step 2: Update CORS Configuration

Before deploying the frontend, make sure your backend allows requests from your frontend domain:

1. Update the CORS configuration in `api/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-frontend-domain.vercel.app", "http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. Commit and push these changes to GitHub
3. Render will automatically redeploy your backend with the updated CORS settings

## Step 3: Deploy the Frontend to Vercel

1. **Sign up for Vercel**:
   - Go to [vercel.com](https://vercel.com) and create an account

2. **Import your GitHub repository**:
   - Click "Add New..." → "Project"
   - Select your repository
   - Vercel will automatically detect the frontend configuration

3. **Configure Environment Variables**:
   - Add `REACT_APP_API_URL` with the value of your Render backend URL (e.g., `https://brand-resonance-api.onrender.com`)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete
   - You'll get a URL like `brand-resonance.vercel.app`

## Step 4: Test the Deployed Application

1. Visit your frontend URL
2. Try analyzing a brand
3. Verify that the frontend can communicate with the backend

## Troubleshooting

If you encounter CORS issues:
1. Check that your backend CORS configuration includes your frontend domain
2. Make sure your frontend is using the correct backend URL
3. Check the browser console for specific error messages

## Local Development

For local development, you can still use the original setup:
```bash
python3 dev.py
```

This will start both the frontend and backend locally.
