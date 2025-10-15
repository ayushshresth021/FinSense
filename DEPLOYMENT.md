# FinSense Deployment Guide

This guide covers deploying both the frontend and backend to Vercel.

## 🚀 Quick Deploy (Both Frontend & Backend on Vercel)

### 1. Deploy Backend

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy the backend**:
   ```bash
   cd server
   vercel
   ```

3. **Follow the prompts**:
   - Set up and deploy: Yes
   - Which scope: Choose your account
   - Link to existing project: No
   - Project name: `finsense-backend` (or your choice)
   - Directory: `./` (it's already in server directory)
   - Override settings: No

4. **Add Environment Variables** in Vercel Dashboard:
   - Go to your project settings on vercel.com
   - Navigate to "Settings" → "Environment Variables"
   - Add the following variables:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     OPENAI_API_KEY=your_openai_api_key
     ASSEMBLYAI_API_KEY=your_assemblyai_api_key
     FRONTEND_URL=https://your-frontend-domain.vercel.app
     NODE_ENV=production
     ```

5. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

6. **Note your backend URL**: e.g., `https://finsense-backend.vercel.app`

### 2. Deploy Frontend

1. **Navigate to web directory**:
   ```bash
   cd ../web
   ```

2. **Deploy the frontend**:
   ```bash
   vercel
   ```

3. **Follow the prompts** (similar to backend)

4. **Add Environment Variables** in Vercel Dashboard:
   - Go to your project settings on vercel.com
   - Navigate to "Settings" → "Environment Variables"
   - Add the following variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app/api
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

### 3. Update CORS Settings

After deploying the frontend, go back to your **backend project** in Vercel:
- Update the `FRONTEND_URL` environment variable with your actual frontend URL
- Redeploy the backend:
  ```bash
  cd ../server
  vercel --prod
  ```

## 🌐 Using Vercel Dashboard (Alternative Method)

### Deploy Backend via Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: Leave empty or `npm run vercel-build`
   - **Output Directory**: Leave empty
5. Add environment variables (listed above)
6. Click "Deploy"

### Deploy Frontend via Dashboard

1. Click "Add New" → "Project" again
2. Import the same Git repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave default
4. Add environment variables (listed above)
5. Click "Deploy"

## 📋 Environment Variables Checklist

### Backend (.env or Vercel settings):
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `ASSEMBLYAI_API_KEY`
- [ ] `FRONTEND_URL`
- [ ] `NODE_ENV=production`

### Frontend (.env.local or Vercel settings):
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔍 Verifying Deployment

### Backend Health Check:
Visit: `https://your-backend.vercel.app/`

You should see:
```json
{
  "message": "FinSense API",
  "version": "1.0.0",
  "status": "healthy"
}
```

### Frontend:
Visit: `https://your-frontend.vercel.app/`

You should see the FinSense landing page.

## 🐛 Troubleshooting

### Backend Issues:

1. **500 Error on API calls**:
   - Check environment variables are set correctly in Vercel dashboard
   - Check Vercel function logs: Dashboard → Deployments → Click deployment → "Functions" tab

2. **CORS Errors**:
   - Ensure `FRONTEND_URL` in backend matches your actual frontend URL
   - Redeploy backend after updating

3. **Timeout Errors**:
   - Vercel free tier has 10-second timeout
   - Check if OpenAI/AssemblyAI API calls are taking too long
   - Consider upgrading to Hobby plan (60-second timeout)

### Frontend Issues:

1. **API Connection Failed**:
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Test backend URL directly in browser

2. **Build Errors**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`

## 📱 Continuous Deployment

Once connected to Git:
- **Push to main branch** → Auto-deploys to production
- **Push to other branches** → Creates preview deployments
- Configure auto-deployment settings in Vercel dashboard

## 💡 Tips

1. **Use Vercel CLI for faster deployment**: `vercel --prod`
2. **Check logs**: Vercel Dashboard → Your Project → Deployments → Click deployment → View logs
3. **Environment Variables**: Changes require redeployment to take effect
4. **Custom Domain**: Add in Vercel Dashboard → Settings → Domains
5. **Preview Deployments**: Every git push creates a preview URL for testing

## 🎯 Production Checklist

Before going live:
- [ ] All environment variables set in production
- [ ] Backend health check returns 200 OK
- [ ] Frontend can connect to backend API
- [ ] CORS configured correctly
- [ ] Supabase authentication working
- [ ] Voice transcription working (AssemblyAI)
- [ ] OpenAI insights generation working
- [ ] Test all major features end-to-end

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Check browser console for errors
3. Verify all environment variables
4. Test API endpoints individually using Postman/curl

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

