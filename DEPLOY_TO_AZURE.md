# Deploy to Azure Static Web Apps

Complete step-by-step guide to convert your chatbot to widget.js and deploy to Azure Static Web Apps.

## 📋 Prerequisites

- Azure Account ([Create free account](https://azure.microsoft.com/en-us/free/))
- GitHub Account
- Git installed
- Node.js 14+ and npm

## 🚀 Step 1: Build the React App

### 1.1 Build for Production

```bash
cd d:\chatbot-widget\nobrokerstyle
npm run build
```

This creates an optimized `build/` folder with:
- `index.html` - React app
- `widget.js` - Widget loader script
- `chatbot.html` - Embedded chatbot
- Static assets (JS, CSS)

### 1.2 Test Locally (Optional)

```bash
# Install serve globally
npm install -g serve

# Serve the build locally
serve -s build -l 3000
```

Then open http://localhost:3000 in your browser.

## 🔧 Step 2: Prepare for Azure

### 2.1 Create staticwebapp.config.json

This file configures routing and headers for Azure Static Web Apps. ✅ **Already created** in root directory.

### 2.2 Create GitHub Actions Workflow

The workflow file `.github/workflows/azure-static-web-apps-deploy.yml` ✅ **Already created** - it will:
- Trigger on push to main/master
- Install dependencies
- Build the React app
- Deploy to Azure

## 📱 Step 3: Create Azure Static Web App

### 3.1 via Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource**
3. Search for **Static Web App**
4. Click **Create**

**Configuration:**
- **Resource Group**: Create new (e.g., `chatbot-rg`)
- **Name**: `nobroker-chatbot` (must be unique)
- **Plan Type**: Free
- **Region**: Pick closest to you (e.g., East US)
- **Source**: GitHub
- **GitHub Account**: Sign in
- **Organization**: Select your GitHub org
- **Repository**: `chatbot-widget`
- **Branch**: main (or master)
- **Build Presets**: React
- **App location**: `/`
- **API location**: Leave blank
- **Output location**: `build`

5. Click **Review + Create** → **Create**

### 3.2 Configure GitHub Token

After creation, Azure shows you the **API Token**:

1. Go to your GitHub Repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: Paste the token from Azure
6. Click **Add secret**

## 📤 Step 4: Deploy

### 4.1 Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: chatbot widget"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/chatbot-widget.git
git branch -M main
git push -u origin main
```

### 4.2 Watch GitHub Actions

1. Go to your repo on GitHub
2. Click **Actions** tab
3. You'll see the workflow running
4. Wait for ✅ **All checks passed**

Once complete, you'll get a deployment URL like:
```
https://nobroker-chatbot-abc123.azurewebsites.net
```

## 🌐 Step 5: Use the Widget

### Option 1: As a Complete App

Visit your Azure URL directly:
```
https://nobroker-chatbot-abc123.azurewebsites.net
```

### Option 2: Embed Widget.js on Another Website

In any HTML file, add:

```html
<!-- Load the widget script -->
<script src="https://nobroker-chatbot-abc123.azurewebsites.net/widget.js"></script>

<!-- Initialize widget -->
<script>
  ChatbotWidget.init({
    position: 'bottom-right',
    width: 380,
    height: 500,
    theme: 'light',
    autoOpen: false
  });
</script>
```

**Widget Configuration Options:**

```javascript
ChatbotWidget.init({
  // Position: 'bottom-right' | 'bottom-left'
  position: 'bottom-right',
  
  // Widget dimensions
  width: 380,
  height: 500,
  
  // Theme: 'light' | 'dark'
  theme: 'light',
  
  // Z-index for layering
  zIndex: 9999,
  
  // Backend API URL
  backendUrl: 'https://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net',
  
  // Auto-open on page load
  autoOpen: false,
  
  // Enable animations
  animated: true
});
```

### Option 3: WordPress/Other Platforms

```html
<!-- Add to your website footer or custom HTML -->
<script src="https://nobroker-chatbot-abc123.azurewebsites.net/widget.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    ChatbotWidget.init({
      position: 'bottom-right'
    });
  });
</script>
```

## 📊 Project Structure After Build

```
build/
├── index.html              # React app
├── chatbot.html            # Widget iframe
├── widget.js               # Widget loader
├── widget.json             # Widget metadata
├── static/
│   ├── js/
│   │   └── main.[hash].js
│   └── css/
│       └── main.[hash].css
└── favicon.ico
```

## 🔄 Update Deployments

Every time you push to main/master:

1. GitHub Actions automatically triggers
2. Builds your app
3. Deploys to Azure
4. Available at your Azure URL

```bash
# Make changes
git add .
git commit -m "Update chatbot UI"
git push origin main

# Git Actions runs automatically ✅
```

## 🐛 Troubleshooting

### Widget not showing after embedding

1. Check browser console for errors
2. Verify CORS is enabled on Azure
3. Ensure backend URL is correct
4. Check Z-index conflicts on page

### Azure deployment failed

1. Check GitHub Actions log for errors
2. Verify API token is correct
3. Ensure `build/` directory exists
4. Check file permissions

### Blank page on Azure URL

1. Clear browser cache
2. Check `staticwebapp.config.json`
3. Verify build output in GitHub Actions
4. Check Azure Portal for deployment status

## 📝 Best Practices

1. **Update Backend URL**: If using different backend, update in:
   - `src/services/socketService.js`
   - Deploy with `REACT_APP_BACKEND_URL` env var

2. **Custom Domain**: Add in Azure Portal
   - Static Web App → Custom domains
   - Add your domain
   - Configure DNS records

3. **Monitor**: Add Application Insights
   - Azure Portal → Add monitoring
   - Track widget usage

4. **Security**: 
   - Keep API token secret
   - Use environment variables
   - Enable HTTPS (automatic on Azure)

## 📚 Useful Links

- [Azure Static Web Apps Docs](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions Workflows](https://docs.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow)
- [Socket.io Client Library](https://socket.io/docs/v4/client-api/)
- [React Build Optimization](https://create-react-app.dev/docs/deployment/)

## ✅ Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] GitHub repo created and pushed
- [ ] Azure Static Web App created
- [ ] API token added to GitHub secrets
- [ ] GitHub Actions workflow showing ✅
- [ ] Azure deployment URL accessible
- [ ] Widget loading and connecting to backend
- [ ] Test message sending/receiving
- [ ] Custom domain added (optional)

## 🎉 You're Done!

Your chatbot widget is now live on Azure Static Web Apps and can be embedded anywhere!

### Quick Share:

```
Standalone App: https://nobroker-chatbot-abc123.azurewebsites.net
Widget Script: https://nobroker-chatbot-abc123.azurewebsites.net/widget.js
```

For support, check the troubleshooting section or review Azure documentation.
