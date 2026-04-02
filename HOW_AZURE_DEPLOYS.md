# 🚀 How Azure Builds & Deploys From GitHub

Complete explanation of the CI/CD pipeline.

## 📊 Entire Process Visualized

```
┌─────────────────────────────────────────────────────────────┐
│ 1. YOU PUSH CODE                                            │
│    git push origin main                                     │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GITHUB RECEIVES PUSH                                     │
│    - Detects new commit on main branch                      │
│    - Triggers GitHub Actions workflow                       │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. GITHUB ACTIONS WORKFLOW STARTS                           │
│    File: .github/workflows/azure-static-web-apps-deploy.yml│
│                                                              │
│    Steps:                                                    │
│    ✅ Checkout code from GitHub                            │
│    ✅ Setup Node.js environment                            │
│    ✅ Install dependencies (npm ci)                        │
│    ✅ Build React app (npm run build)                      │
│    ✅ Creates build/ folder                                │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. BUILD SUCCEEDS                                           │
│    ✅ build/                                               │
│       ├── index.html     (React app)                       │
│       ├── widget.js      (Widget loader)                   │
│       ├── chatbot.html   (Iframe)                          │
│       ├── static/
│       │   ├── js/        (Minified JS)                     │
│       │   └── css/       (Minified CSS)                    │
│       └── favicon.ico                                      │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. GITHUB ACTIONS UPLOADS TO AZURE                          │
│    - Sends build/ folder to Azure                           │
│    - Uses API token for authentication                      │
│    - Uses GitHub secret: AZURE_STATIC_WEB_APPS_API_TOKEN  │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. AZURE STATIC WEB APPS RECEIVES BUILD                     │
│    - Uploads files to Azure CDN                             │
│    - Applies staticwebapp.config.json rules                 │
│    - Configures routing & caching headers                   │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. DEPLOYMENT COMPLETE                                      │
│    ✅ Live on https://your-app.azurewebsites.net          │
│    ✅ Widget.js available at /widget.js                   │
│    ✅ Served via global CDN                                │
│    ✅ HTTPS automatic                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Step-by-Step Detailed Breakdown

### **Step 1: You Push Code**
```bash
git push origin main
```
Your latest code goes to GitHub `main` branch.

### **Step 2: GitHub Actions Triggers**

**What triggers it:**
- File: `.github/workflows/azure-static-web-apps-deploy.yml`
- Event: `on: [push to main branch]`

**GitHub sees:**
```yaml
on:
  push:
    branches:
      - main
      - master
```

✅ **Trigger activated!** GitHub Actions starts running.

### **Step 3: GitHub Actions Runs Build**

**In order, GitHub Actions does:**

```yaml
1. actions/checkout@v4
   └─ Downloads your code from GitHub to build server

2. actions/setup-node@v4
   └─ Installs Node.js 18 on build server

3. npm ci
   └─ Installs dependencies from package.json
   └─ Creates node_modules/
   └─ Takes: 30-45 seconds

4. npm run build
   └─ Builds React app
   └─ Creates optimized build/ folder
   └─ Minifies all JS/CSS
   └─ Takes: 60-90 seconds

5. Azure/static-web-apps-deploy@v1
   └─ Uploads build/ to Azure
   └─ Uses token: AZURE_STATIC_WEB_APPS_API_TOKEN
   └─ Takes: 10-30 seconds
```

**Total time: 2-3 minutes** ⏱️

### **Step 4: Build Folder Contents**

After `npm run build`, your `build/` folder contains:

```
build/
├── 404.html                    # For SPA routing
├── index.html                  # Main React app
├── chatbot.html                # Widget iframe
├── widget.js                   # Widget loader
├── widget.json                 # Widget metadata
├── favicon.ico
├── robots.txt
└── static/
    ├── css/
    │   ├── main.[hash].css    # Minified styles
    │   └── main.[hash].css.map
    └── js/
        ├── main.[hash].js     # Minified React code
        ├── main.[hash].js.map
        └── [other chunks]
```

**Why minified?**
- Main.js: 500KB → 150KB (smaller)
- Loads faster ⚡
- Better for users on slow network

### **Step 5: GitHub Actions Contacts Azure**

The workflow uses:
```yaml
Azure/static-web-apps-deploy@v1
with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  app_location: "build"
  api_location: "api"
  output_location: "build"
```

**What this does:**
- Reads secret from GitHub (safe - not shown in logs)
- Authenticates to Azure
- Uploads `build/` folder to Azure
- Azure deploys it globally

### **Step 6: Azure Processes Files**

Azure reads `staticwebapp.config.json`:

```json
{
  "routes": [
    { "route": "/widget.js", "serve": "/widget.js" },
    { "route": "/chatbot.html", "serve": "/chatbot.html" },
    { "route": "/*", "serve": "/index.html", "statusCode": 200 }
  ],
  "responseHeaders": [
    {
      "glob": "**/*.js",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ]
}
```

**What it does:**
- ✅ Routes `/widget.js` → serves `widget.js`
- ✅ Routes `/chatbot.html` → serves `chatbot.html`
- ✅ Routes `/anything/*` → serves `index.html` (React SPA)
- ✅ Sets cache headers (browser caches 1 year)
- ✅ Sets CORS headers
- ✅ Configures HTTPS

### **Step 7: Files Go Live**

**Azure distributes files to:**
- Edge locations worldwide (CDN)
- Multiple servers for redundancy
- HTTPS certificate automatic

**You get:**
- 🌍 Global distribution
- ⚡ Fast load times (content served from nearest edge)
- 🔒 HTTPS encrypted
- 📊 All automatic!

---

## 🔍 **How to Monitor the Process**

### **1. Watch GitHub Actions**

1. Go to your GitHub repo
2. Click **Actions** tab
3. See workflow running in real-time:

```
azure-static-web-apps-deploy.yml

✅ Checkout code       (5 sec)
✅ Setup Node.js       (10 sec)
✅ Install deps        (45 sec)
⏳ Build React app     (60 sec)  ← Shows progress
⏳ Deploy to Azure     (30 sec)
```

**Click into it to see logs:**
```
Installing dependencies...
npm notice up to date, audited 1304 packages in 32s
Adding packages...
Creating build folder...
Compiling React...
Output folder size: 2.5 MB
Uploading to Azure...
✅ Deployment succeeded!
```

### **2. Watch Azure Portal**

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for your Static Web App
3. See deployment status:

```
Latest Deployment:
Status: ✅ Active
Branch: main
Commit: abc1234
Deployed: 2 minutes ago
```

---

## 🔄 **The Entire Flow Summary**

| Step | What Happens | Time |
|------|-------------|------|
| 1 | You `git push origin main` | 5 sec |
| 2 | GitHub receives push | 1 sec |
| 3 | GitHub Actions triggers workflow | 1 sec |
| 4 | Checkout code | 5 sec |
| 5 | Setup Node.js 18 | 10 sec |
| 6 | npm ci (install deps) | 45 sec |
| 7 | npm run build (create build/) | 60 sec |
| 8 | Upload to Azure | 30 sec |
| 9 | Azure configures routing | 10 sec |
| 10 | Files replicate to CDN | 30 sec |
| **TOTAL** | **Live!** | **~3 min** |

---

## 🎯 **What Azure Doesn't Do**

❌ **Azure does NOT:**
- Pull your source code after first setup
- Run npm or build locally on Azure
- Store node_modules
- Execute backend code
- Manage API servers
- Run databases

✅ **Azure ONLY:**
- Receives `build/` folder from GitHub
- Hosts static HTML/JS/CSS files
- Serves files globally via CDN
- Manages HTTPS certificates
- That's it!

---

## 🔐 **Security: API Token**

The workflow uses your API token securely:

```yaml
azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
```

**How it works:**
1. Token stored in GitHub Secrets (encrypted)
2. Never shown in logs
3. Only used during deployment
4. Azure validates token
5. Uploads files if valid

✅ **Secure - Token never exposed!**

---

## 🚀 **After First Deployment**

Every time you push:

```bash
git add .
git commit -m "Update chatbot UI"
git push origin main
# ↓ GitHub Actions runs automatically
# ↓ Build succeeds in ~2-3 min
# ↓ Live in ~3 minutes total! ✅
```

**No manual steps needed!** 🎉

---

## 📊 **Full Deployment Architecture**

```
Your Computer
    ↓ git push
GitHub Repository
    ↓ Webhook
GitHub Actions
    ├─ Checkout
    ├─ npm install
    ├─ npm build
    └─ Upload to Azure
         ↓ API Token
    Azure Static Web App
         ↓ staticwebapp.config.json
    Azure CDN (Global)
         ↓
User Browser
    ├─ Downloads index.html
    ├─ Downloads main.js
    ├─ Downloads styles.css
    └─ Loads React app
         ↓
    Connects to Socket.io backend
         ↓
    Chat works! ✅
```

---

## 💡 **Key Points**

1. **You push source code** to GitHub
2. **GitHub Actions automatically:**
   - ✅ Installs dependencies
   - ✅ Builds React app
   - ✅ Creates optimized `build/` folder
3. **GitHub uploads `build/` folder to Azure**
4. **Azure deploys globally via CDN**
5. **staticwebapp.config.json configures routing**
6. **Your app is live!** 🚀

---

## 🔗 **Related Files**

- **Workflow**: `.github/workflows/azure-static-web-apps-deploy.yml`
- **Config**: `staticwebapp.config.json`
- **Build**: `package.json` (npm scripts)
- **Frontend**: `public/index.html`

---

## ✅ **Verification Checklist**

After pushing to GitHub:

- [ ] GitHub Actions tab shows workflow running
- [ ] Workflow completes with ✅ (green check)
- [ ] Logs show successful build
- [ ] Azure Portal shows "Active" deployment
- [ ] Your URL shows app live
- [ ] Chat functionality works
- [ ] Widget.js loads from `/widget.js`

---

**You're all set!** Azure automatically builds and deploys everything. 🎉
