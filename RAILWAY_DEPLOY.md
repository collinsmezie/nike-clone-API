# Railway Deployment Guide

## Prerequisites
1. A Railway account (sign up at [railway.app](https://railway.app))
2. GitHub repository with your code pushed
3. Railway CLI (optional, for easier management)

## Step-by-Step Deployment

### 1. Prepare Your Repository
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create a New Railway Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `nike-clone-API`
5. Railway will automatically detect it as a Node.js project

### 3. Add PostgreSQL Database
1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. Click on the PostgreSQL service to view connection details

### 4. Configure Environment Variables
1. In your Railway project, click on your **API service** (not the database)
2. Go to the **"Variables"** tab
3. Add the following environment variables:

**Required Variables:**
- `DATABASE_URL` - Click **"Add Reference"** and select the PostgreSQL service's `DATABASE_URL` variable (Railway will auto-populate this)
- `PORT` - Railway automatically sets this, but you can add it manually: `PORT=3000`
- `JWT_SECRET` - Generate a secure secret (e.g., run `openssl rand -base64 32` locally)
- `FRONTEND_URL` - Your frontend URL (e.g., `https://your-frontend.vercel.app` or `*` for development)

**Optional but Recommended:**
- `NODE_ENV=production`

### 5. Configure Build & Deploy Settings
1. In your API service, go to **"Settings"**
2. Under **"Build Command"**, ensure it's set to: `npm run build`
3. Under **"Start Command"**, ensure it's set to: `npm run start:prod`
4. Railway should auto-detect these from `railway.json`

### 6. Set Up Prisma Migrations
Railway needs to run Prisma migrations during deployment. This is already configured in your `railway.json` file, which will:

1. **Build Command**: `npm install && npm run build`
   - Installs dependencies and generates Prisma client

2. **Start Command**: `npm run deploy && npm run start:prod`
   - Runs `prisma migrate deploy` to apply migrations
   - Then starts your API server

This is automatically handled by Railway using the `railway.json` configuration. No additional setup needed!

**Note**: The `deploy` script in `package.json` runs `prisma migrate deploy`, which applies pending migrations to your database.

### 7. Seed the Database (First Time Only)
After first deployment, you may want to seed the database:

1. Open Railway CLI or use the web terminal:
```bash
railway run npx prisma db seed
```

Or add this as a one-time script after first deployment.

### 8. Deploy
1. Railway will automatically deploy when you push to your connected branch
2. Or manually trigger a deployment by clicking **"Deploy"** in the dashboard
3. Wait for the build to complete (check the **"Deployments"** tab)

### 9. Get Your API URL
1. Once deployed, go to your API service
2. Click on **"Settings"** → **"Networking"**
3. Click **"Generate Domain"** to get a public URL (e.g., `your-api.railway.app`)
4. Your API will be accessible at: `https://your-api.railway.app`

### 10. Verify Deployment
Test your API endpoints:
```bash
# Health check
curl https://your-api.railway.app

# Products
curl https://your-api.railway.app/products

# Auth (Login)
curl -X POST https://your-api.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nike.com","password":"password123"}'
```

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Ensure `prisma generate` runs during build
- Verify all dependencies are in `dependencies` (not `devDependencies`)

### Database Connection Issues
- Verify `DATABASE_URL` is correctly referenced from PostgreSQL service
- Check PostgreSQL service is running
- Ensure migrations have run: `npx prisma migrate deploy`

### API Not Starting
- Check start command is `npm run start:prod`
- Verify PORT environment variable (Railway auto-sets this)
- Check application logs in Railway dashboard

### CORS Issues
- Update `FRONTEND_URL` environment variable with your frontend domain
- For development, you can set it to `*` (not recommended for production)

## Useful Railway CLI Commands (Optional)

Install Railway CLI:
```bash
npm i -g @railway/cli
railway login
```

Common commands:
```bash
# Link to your project
railway link

# View logs
railway logs

# Open shell
railway shell

# Run commands
railway run npm run prisma:seed
railway run npx prisma migrate deploy

# View environment variables
railway variables
```

## Production Checklist
- [ ] Database is seeded with initial data
- [ ] Environment variables are set (JWT_SECRET, FRONTEND_URL, etc.)
- [ ] CORS is configured for your frontend domain
- [ ] Database migrations are running automatically
- [ ] API domain is generated and accessible
- [ ] SSL/HTTPS is enabled (automatic on Railway)
- [ ] Monitoring/logs are set up

## Next Steps
1. Set up custom domain (optional) in Railway service settings
2. Configure automatic deployments from GitHub
3. Set up monitoring and alerts
4. Update your frontend to use the new API URL

