# Deployment Guide for Replicon

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All environment variables are configured
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` shows no errors
- [ ] TypeScript compilation succeeds (`npx tsc --noEmit`)
- [ ] Production preview tested locally (`npm run preview`)
- [ ] Supabase database migrations are applied
- [ ] All sensitive keys are stored securely (not in .env committed to git)
- [ ] Tests are passing (if implemented)
- [ ] Performance tested (Lighthouse score > 90)

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Zero configuration for Vite apps
- Automatic deployments from Git
- Built-in CI/CD
- Free SSL certificates
- Global CDN

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment (will ask questions)
   vercel

   # Production deployment
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Make sure to add them for Production, Preview, and Development

5. **Automatic Deployments**
   - Connect your GitHub repository in Vercel Dashboard
   - Every push to main branch will auto-deploy

**vercel.json Configuration (Optional):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize**
   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

**netlify.toml Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

---

### Option 3: Railway

**Steps:**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize & Deploy**
   ```bash
   railway init
   railway up
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set VITE_SUPABASE_URL=your_url
   railway variables set VITE_SUPABASE_ANON_KEY=your_key
   # ... add all other variables
   ```

---

### Option 4: AWS S3 + CloudFront

**Steps:**

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Install AWS CLI**
   ```bash
   # macOS
   brew install awscli

   # Or download from https://aws.amazon.com/cli/
   ```

3. **Configure AWS**
   ```bash
   aws configure
   ```

4. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://replicon-app
   ```

5. **Upload Build**
   ```bash
   aws s3 sync dist/ s3://replicon-app --delete
   ```

6. **Configure S3 for Static Hosting**
   - Enable Static Website Hosting in S3 Console
   - Set index.html as Index Document
   - Set index.html as Error Document (for SPA routing)

7. **Set up CloudFront (Optional but Recommended)**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom error pages to redirect to index.html

---

### Option 5: Self-Hosted (Docker)

**Create Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Create nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Build & Run:**
```bash
# Build Docker image
docker build -t replicon-app .

# Run container
docker run -p 8080:80 replicon-app
```

---

## Post-Deployment Steps

### 1. Verify Deployment
- [ ] Open your production URL
- [ ] Test login/signup
- [ ] Test all major features
- [ ] Check browser console for errors
- [ ] Test on mobile devices

### 2. Configure Custom Domain (Optional)
- Add custom domain in your hosting platform
- Update DNS records (A record or CNAME)
- Wait for SSL certificate provisioning

### 3. Set Up Monitoring
- Enable error tracking (Sentry, LogRocket)
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure analytics (Google Analytics, Plausible)

### 4. Performance Optimization
- Enable gzip/brotli compression
- Configure CDN caching
- Add security headers

### 5. Supabase Production Configuration
- [ ] Enable RLS (Row Level Security) on all tables
- [ ] Configure production-grade database
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Review API keys and permissions

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test
        if: always()

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          # Add all other env variables

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Environment Variables Management

### Never Commit Secrets!
Ensure `.env` is in `.gitignore`:
```
# Environment variables
.env
.env.local
.env.production
```

### Production Environment Variables
Required variables for production:
```bash
# Core (Required)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_URL=https://yourdomain.com

# Payment Gateway (if enabled)
VITE_RAZORPAY_KEY_ID=

# Trading API (if enabled)
VITE_IIFL_API_URL=

# AI Features (if enabled)
VITE_OPENAI_API_KEY=

# Feature Flags
VITE_ENABLE_TRADING=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_AI_FEATURES=true
```

---

## Rollback Plan

If deployment fails:

1. **Vercel/Netlify**: Instant rollback from dashboard
2. **AWS S3**: Keep previous builds and re-upload
3. **Docker**: Keep previous image tags and redeploy

```bash
# Example: Vercel rollback
vercel rollback [deployment-url]
```

---

## Security Checklist

- [ ] All API keys stored in environment variables (not hardcoded)
- [ ] Supabase RLS enabled on all tables
- [ ] HTTPS enabled (SSL certificate)
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] Rate limiting enabled on APIs
- [ ] Input validation on all forms
- [ ] No sensitive data in localStorage without encryption
- [ ] CORS properly configured

---

## Performance Targets

- Lighthouse Performance Score: > 90
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Bundle size: < 500KB (gzipped)

Run performance audit:
```bash
npx lighthouse https://yourdomain.com --view
```

---

## Support & Troubleshooting

Common issues:

1. **White screen after deployment**
   - Check browser console for errors
   - Verify environment variables are set
   - Check routing configuration (redirects to index.html)

2. **API calls failing**
   - Verify CORS settings
   - Check Supabase URL and keys
   - Ensure environment variables have `VITE_` prefix

3. **Build failures**
   - Check TypeScript errors: `npx tsc --noEmit`
   - Verify all dependencies are installed
   - Check Node.js version compatibility
