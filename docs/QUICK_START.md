# Quick Start - Replicon Deployment

## 🚀 Fast Track to Production

### Initial Setup (One Time)
```bash
npm install
cp .env.example .env
# Edit .env with your credentials
```

### Development Workflow
```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### Pre-Deployment Checks
```bash
# Run all checks and build
npm run pre-deploy

# Preview production build locally
npm run deploy:preview
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

---

## 📋 Command Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Auto-fix linting errors |
| `npm run type-check` | Check TypeScript types |
| `npm run pre-deploy` | Run all checks + build |
| `npm run deploy:preview` | Check + build + preview |

---

## ⚡ Quick Deploy Commands

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod
```

### Railway
```bash
railway up
```

---

## 🔧 Environment Variables

Create `.env` with these required variables:

```bash
# Required
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Optional
VITE_RAZORPAY_KEY_ID=rzp_xxx
VITE_IIFL_API_URL=https://api.iiflblaze.com/v1
VITE_OPENAI_API_KEY=sk-xxx
```

---

## ✅ Pre-Deployment Checklist

- [ ] `npm run lint` - No errors
- [ ] `npm run type-check` - Types are valid
- [ ] `npm run build` - Build succeeds
- [ ] `npm run preview` - App works locally
- [ ] `.env` variables set in deployment platform
- [ ] Supabase migrations applied
- [ ] Test on production URL after deployment

---

## 🆘 Troubleshooting

### Build fails
```bash
# Check TypeScript errors
npm run type-check

# Check linting
npm run lint
```

### White screen after deployment
- Check browser console for errors
- Verify environment variables are set
- Check that all `VITE_` prefixed vars are in platform

### API calls fail
- Verify Supabase URL and keys
- Check CORS settings in Supabase dashboard
- Ensure environment variables are loaded

---

## 📚 Full Documentation

- **Testing Setup**: `docs/TESTING_SETUP.md`
- **Full Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md`
- **Supabase Setup**: `supabase/README.md`

---

## 🎯 Recommended Deployment Platform

**Vercel** - Best for React/Vite apps
- Zero config needed
- Automatic HTTPS
- Global CDN
- Free tier available
- Easy rollbacks

**Quick Deploy:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

Done! 🎉
