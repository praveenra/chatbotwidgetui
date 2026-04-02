# 🚀 Azure Deployment Checklist

Complete checklist for deploying your Nobroker Chatbot Widget to Azure Static Web Apps.

## ✅ Pre-Deployment (Local)

- [ ] Run `npm install` - dependencies installed
- [ ] Run `npm run build` - build completes without errors
- [ ] Verify `build/` folder created with:
  - [ ] `index.html`
  - [ ] `widget.js`
  - [ ] `chatbot.html`
  - [ ] `static/js/` folder
  - [ ] `static/css/` folder
- [ ] Test locally: `npx serve -s build -l 3000`
- [ ] Open http://localhost:3000 - loads correctly
- [ ] Test chatbot: Send message and receive response
- [ ] Check browser console - no errors
- [ ] Commit changes to git

## 📱 GitHub Setup

- [ ] GitHub repository created
- [ ] Code pushed to `main` or `master` branch
- [ ] Repository is public (for free tier) or private with Actions enabled
- [ ] All commits pushed successfully
- [ ] Verify files on GitHub:
  ```
  ✓ src/
  ✓ public/
  ✓ .github/workflows/azure-static-web-apps-deploy.yml
  ✓ staticwebapp.config.json
  ✓ package.json
  ✓ DEPLOY_TO_AZURE.md
  ```

## ☁️ Azure Setup

### Azure Portal Configuration

- [ ] Azure account created ([free tier](https://azure.microsoft.com/en-us/free/))
- [ ] Logged into [Azure Portal](https://portal.azure.com)
- [ ] Created Static Web App with settings:
  - [ ] **Name**: `nobroker-chatbot` (or your choice)
  - [ ] **Region**: Closest to users
  - [ ] **Plan**: Free
  - [ ] **Source**: GitHub
  - [ ] **Connected to**: Your GitHub account
  - [ ] **Repository**: Select your repo
  - [ ] **Branch**: `main` or `master`
  - [ ] **Build Presets**: React
  - [ ] **App location**: `/`
  - [ ] **Output location**: `build`
  - [ ] **API location**: (leave blank)

### GitHub Secret Configuration

- [ ] Azure generated deployment token/API key
- [ ] Went to GitHub Repo → Settings → Secrets and variables → Actions
- [ ] Created new secret with:
  - [ ] **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
  - [ ] **Value**: (pasted Azure token)
  - [ ] Clicked "Add secret"

## 🔄 Initial Deployment

- [ ] Waited for GitHub Actions workflow to complete
- [ ] Check Actions tab shows ✅ all checks passed
- [ ] Workflow completed without errors
- [ ] Azure Portal shows deployment status: Success
- [ ] Got deployment URL: `https://nobroker-chatbot-abc123.azurewebsites.net`

## 🧪 Testing After Deployment

### Test Standalone App

- [ ] Opened Azure URL in browser
- [ ] App loads successfully (no 404 errors)
- [ ] Chat interface visible
- [ ] Can type messages
- [ ] Backend connection established
- [ ] Bot responds to messages
- [ ] Connection indicator shows "Online"
- [ ] Browser console shows no errors

### Test Widget Script

- [ ] Created test HTML file:
  ```html
  <!DOCTYPE html>
  <html>
  <body>
    <h1>Test Page</h1>
    <script src="https://YOUR_AZURE_URL/widget.js"></script>
    <script>ChatbotWidget.init({ position: 'bottom-right' });</script>
  </body>
  </html>
  ```
- [ ] Opened test HTML locally
- [ ] Widget appears in bottom-right
- [ ] Can open/close widget
- [ ] Can send messages
- [ ] Receives bot responses

## 📊 Post-Deployment Configuration

### Optional: Custom Domain

- [ ] Purchased custom domain (e.g., chatbot.yourcompany.com)
- [ ] Went to Azure Portal → Static Web App → Custom domains
- [ ] Added custom domain
- [ ] Updated DNS records with Azure values
- [ ] Verified domain is working
- [ ] Updated widget.js URL in documentation

### Optional: Environment Variables

- [ ] Updated backend URL if needed (in deployment workflow)
- [ ] Modified `REACT_APP_BACKEND_URL` if using different backend
- [ ] Redeployed and tested

### Optional: Monitoring

- [ ] Added Application Insights (optional)
- [ ] Configured alerts for errors
- [ ] Set up performance monitoring

## 📚 Documentation

- [ ] Updated README with Azure URL
- [ ] Created/updated integration guide
- [ ] Documented custom domain (if applicable)
- [ ] Shared widget script URL with team
- [ ] Created internal wiki with deployment info

## 🔐 Security Check

- [ ] API token is secure (not in code/logs)
- [ ] HTTPS enabled (automatic on Azure)
- [ ] CORS configured properly
- [ ] Backend validation enabled
- [ ] No sensitive data in client code

## 📈 Continuous Deployment

- [ ] GitHub Actions workflow triggers on push
- [ ] Workflow variables are correct:
  - [ ] `app_location: "/"`
  - [ ] `output_location: "build"`
  - [ ] `skip_api_build: true`
- [ ] Test: Make small code change
- [ ] Push to main/master
- [ ] Verify GitHub Actions runs automatically
- [ ] Verify Azure deployment updates
- [ ] Verify changes live on Azure URL

## 🚨 Troubleshooting Verification

- [ ] Tested widget on different browsers
- [ ] Tested on mobile devices
- [ ] Tested with slow network (DevTools throttling)
- [ ] Verified error handling works
- [ ] Checked for any 404s in Network tab
- [ ] Tested backend connection loss handling

## 📝 Final Documentation

- [ ] All team members have access to:
  - [ ] Azure Portal
  - [ ] GitHub repository
  - [ ] Deployment documentation
- [ ] Created runbook for common issues
- [ ] Documented rollback procedure
- [ ] Set up on-call support

## ✨ Deployment Complete!

- [ ] Live URL: `https://your-azure-url.azurewebsites.net`
- [ ] Widget script: `https://your-azure-url.azurewebsites.net/widget.js`
- [ ] Can be embedded on other websites
- [ ] Receiving real user traffic
- [ ] Monitoring in place
- [ ] Team trained on updates

---

## 📌 Quick Reference

### Deployment Commands
```bash
npm install          # Install deps
npm run build        # Build for production
git push origin main # Trigger Azure deployment
```

### Test URLs
```
Standalone: https://your-azure-url.azurewebsites.net
Widget Script: https://your-azure-url.azurewebsites.net/widget.js
```

### Key Files
```
├── staticwebapp.config.json          (Routing config)
├── .github/workflows/
│   └── azure-static-web-apps-deploy.yml  (CI/CD)
├── package.json                       (Dependencies)
└── DEPLOY_TO_AZURE.md                (Full guide)
```

### Support Links
- [Azure Static Web Apps Docs](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Troubleshooting Guide](./DEPLOY_TO_AZURE.md#-troubleshooting)

---

**🎉 Your chatbot is live on Azure!**
