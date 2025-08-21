# Sophie Uwase Portfolio - Vercel Deployment Guide

## Overview
This guide covers deploying Sophie's terminal-style portfolio website to Vercel with email functionality and AI integration.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **SendGrid Account**: For email functionality at [sendgrid.com](https://sendgrid.com)
3. **OpenAI Account**: For AI chat functionality at [openai.com](https://openai.com)

## Environment Variables Required

You'll need to set these environment variables in Vercel:

### Required for Email Functionality
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### Required for AI Integration
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Ensure all files are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# Set up and deploy? [Y/n] Y
# Which scope? [Your account]
# Link to existing project? [n] n
# What's your project's name? sophie-portfolio
# In which directory is your code located? ./
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the build settings:
   - **Build Command**: `vite build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

### 3. Configure Environment Variables

In your Vercel project settings:
1. Go to Settings → Environment Variables
2. Add each environment variable:

```
SENDGRID_API_KEY: [Your SendGrid API Key]
SENDGRID_FROM_EMAIL: [Verified sender email]
OPENAI_API_KEY: [Your OpenAI API Key]
```

### 4. Configure SendGrid

1. **Create API Key**:
   - Go to SendGrid Dashboard → Settings → API Keys
   - Create a new API Key with "Mail Send" permissions
   - Copy the key to `SENDGRID_API_KEY`

2. **Verify Sender Email**:
   - Go to Settings → Sender Authentication
   - Verify the email you'll use in `SENDGRID_FROM_EMAIL`

### 5. Configure OpenAI

1. **Create API Key**:
   - Go to OpenAI Dashboard → API Keys
   - Create a new secret key
   - Copy the key to `OPENAI_API_KEY`

## File Structure for Deployment

```
project-root/
├── api/
│   └── server.ts          # Vercel serverless function
├── client/
│   ├── dist/              # Built frontend (generated)
│   └── src/               # React source code
├── server/                # Original server (for local dev)
├── vercel.json           # Vercel configuration
└── package.json
```

## Features Included

### 1. Terminal Interface
- Interactive command-line style UI
- Commands: `/help`, `/cv`, `/intro`, `/profiles`, `/contact`, `/journal`, `/ask`, `/clear`
- Auto-suggestions with zsh-style completion
- Mobile responsive design

### 2. Email Integration
- Contact form with CAPTCHA protection
- Email notifications sent via SendGrid
- Form validation and error handling

### 3. AI Integration
- OpenAI GPT-4 powered Q&A system
- Contextual responses about Sophie's background
- Fallback responses when AI is unavailable

### 4. Data Management
- In-memory storage for demo purposes
- CV data, journal entries, and social profiles
- Easy to migrate to database in future

## Testing Your Deployment

### 1. Manual Testing Checklist

- [ ] **Homepage loads correctly**
- [ ] **Welcome typewriter animation works**
- [ ] **All terminal commands function**:
  - [ ] `/help` - Shows available commands
  - [ ] `/cv` - Displays CV information
  - [ ] `/intro` - Opens interactive introduction
  - [ ] `/profiles` - Shows social media links
  - [ ] `/contact` - Opens contact form
  - [ ] `/journal` - Displays blog entries
  - [ ] `/ask [question]` - AI responds to questions
  - [ ] `/clear` - Clears terminal screen
- [ ] **Contact form sends emails**
- [ ] **CAPTCHA validation works**
- [ ] **AI chat responds appropriately**
- [ ] **Mobile responsiveness**
- [ ] **Auto-suggestions appear when typing**

### 2. API Endpoint Testing

Test these endpoints directly:

```bash
# Get CV data
curl https://your-domain.vercel.app/api/cv

# Get journal entries
curl https://your-domain.vercel.app/api/journal

# Get social profiles
curl https://your-domain.vercel.app/api/profiles

# Test AI chat
curl -X POST https://your-domain.vercel.app/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is your experience?"}'

# Test contact form
curl -X POST https://your-domain.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "message": "Test message"}'
```

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript files compile without errors

2. **Email Not Sending**:
   - Verify `SENDGRID_API_KEY` is correct
   - Check that sender email is verified in SendGrid
   - Look at Vercel function logs for errors

3. **AI Not Responding**:
   - Verify `OPENAI_API_KEY` is set correctly
   - Check OpenAI account has available credits
   - Fallback responses should still work

4. **404 Errors on API Routes**:
   - Check `vercel.json` configuration
   - Ensure API routes are in the `api/` directory

### Viewing Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Click on a function to view logs
3. Use `console.log()` statements for debugging

## Performance Optimization

### Current Optimizations
- Static asset caching through Vercel CDN
- Serverless functions with automatic scaling
- Optimized React build with Vite
- Responsive images and mobile-first design

### Future Improvements
- Add database for persistent storage
- Implement Redis caching for API responses
- Add service worker for offline functionality
- Implement rate limiting for AI endpoints

## Security Considerations

### Current Security Features
- CORS headers configured
- Input validation on all endpoints
- CAPTCHA protection on contact form
- Environment variables for sensitive data

### Additional Recommendations
- Implement rate limiting
- Add request size limits
- Use HTTPS only (automatic with Vercel)
- Regular security audits

## Domain Configuration

### Using Custom Domain
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Monitoring and Analytics

### Built-in Vercel Analytics
- Automatic performance monitoring
- Function execution logs
- Error tracking

### Optional: Add Google Analytics
Add Google Analytics tracking code to `client/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## Cost Estimation

### Vercel Costs
- **Hobby Plan**: Free (sufficient for personal portfolios)
- **Pro Plan**: $20/month (for commercial use)

### SendGrid Costs
- **Free Plan**: 100 emails/day
- **Essentials**: $14.95/month for 40K emails

### OpenAI Costs
- **Pay-per-use**: ~$0.002 per 1K tokens
- **Estimated**: $1-5/month for typical portfolio usage

## Support and Maintenance

### Regular Tasks
- Monitor function logs for errors
- Check email delivery reports
- Review AI usage and costs
- Update dependencies monthly

### Getting Help
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- SendGrid Support: [sendgrid.com/support](https://sendgrid.com/support)
- OpenAI Documentation: [platform.openai.com/docs](https://platform.openai.com/docs)

---

## Quick Deploy Commands

```bash
# Clone and deploy in one go
git clone [your-repo-url]
cd [repo-name]
npm install
npx vercel --prod

# Set environment variables
npx vercel env add SENDGRID_API_KEY
npx vercel env add SENDGRID_FROM_EMAIL
npx vercel env add OPENAI_API_KEY

# Deploy updates
npx vercel --prod
```

Your portfolio will be live at `https://your-project-name.vercel.app`!