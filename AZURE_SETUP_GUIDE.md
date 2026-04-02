# 🚀 Azure Static Web Apps Setup - Step-by-Step Guide

Complete Azure Portal walkthrough to deploy your chatbot widget.

---

## 📋 **Before You Start - Prerequisites**

✅ Have these ready:
- GitHub account with your code pushed to `main` branch
- Azure account (free tier works!)
- Your GitHub repo name: `chatbot-widget`
- Your GitHub personal access token (optional, simpler with GitHub login)

✅ Your code must be pushed to GitHub:
```bash
git push origin main
```

---

## 🔧 **Step 1: Go to Azure Portal**

1. Open: https://portal.azure.com
2. Sign in with your Azure account
3. See Azure homepage with "Create a resource" button

---

## 🎯 **Step 2: Create Static Web App**

### **Method A: Search (Easiest)**

1. In search bar at top, type: **"Static Web App"**
2. Click **"Static Web App"** from results
3. Click **"Create"** button

### **Method B: Browse**

1. Click **"Create a resource"** (top-left)
2. In sidebar, click **"Web"**
3. Find **"Static Web App"**
4. Click **"Create"**

---

## 📝 **Step 3: Basic Configuration**

You'll see a form. Fill in:

### **Section: Basics**

| Field | Value | Notes |
|-------|-------|-------|
| **Subscription** | (Your subscription) | Default is fine |
| **Resource Group** | `chatbot-rg` | NEW group for organization |
| **Name** | `chatbot-widget` | Your app name (must be unique) |
| **Plan Type** | `Free` | ✅ Perfect for this, auto-scales |
| **Region** | `South India` | Closest to your backend |
| **Deployment details** | "Sign in with GitHub" | Next button |

### **Click "Sign in with GitHub"**

```
A popup appears:
├─ GitHub login window
├─ Authorize Azure Static Web Apps
└─ Grants permission to your repos
```

✅ Click "Authorize" if prompted

---

## 🔗 **Step 4: GitHub Connection**

After GitHub login, you'll see:

| Field | Value | What to Select |
|-------|-------|---|
| **Organization** | Your GitHub username | From dropdown |
| **Repository** | `chatbot-widget` | Your repo name |
| **Branch** | `main` | Select from dropdown |

✅ Verify you see your repo listed!

---

## ⚙️ **Step 5: Build Details**

This is **CRITICAL** - tells Azure how to build your React app.

### **Preset Settings**

You'll see:
```
Build Presets: [Choose your app type]
├─ Angular
├─ React
├─ Vue
├─ Svelte
├─ Next.js
└─ Custom
```

### **SELECT: "React"**

Azure automatically fills:

| Field | Value |
|-------|-------|
| **App location** | `/` |
| **API location** | (leave blank) |
| **Output location** | `build` |

✅ **These are CORRECT!** Don't change them.

### **Why These Values?**

```
App location: /
  └─ Your source code is in root

Output location: build
  └─ React creates build/ folder after npm run build

API location: (blank)
  └─ No backend API on Azure (Socket.io backend is separate)
```

---

## 📍 **Step 6: Review + Create**

Scroll down to **"Review + Create"** tab (or button).

You'll see summary:

```
✅ Subscription: Your subscription
✅ Resource Group: chatbot-rg
✅ Name: chatbot-widget
✅ Region: South India
✅ Plan: Free
✅ Repository: your-username/chatbot-widget
✅ Branch: main
✅ App location: /
✅ Output location: build
```

### **Everything correct?**

Click **"Create"** button (bottom-right)

⏳ **Wait 1-2 minutes** for resource creation...

---

## ✅ **Step 7: Deployment Starts**

After "Create", you'll see:

```
Deployment in progress...
├─ Creating Static Web App resource
├─ Configuring GitHub connection
├─ Creating GitHub Actions workflow
└─ Starting first build
```

**You can see:**
- Azure creates a GitHub Actions workflow automatically
- Your GitHub repo gets `.github/workflows/` folder
- First build starts automatically!

---

## 🔄 **Step 8: GitHub Actions Workflow (Automatic)**

Azure will create a workflow file like:

```
.github/workflows/azure-static-web-apps-[hash].yml
```

**This workflow:**
- ✅ Runs every time you push to `main`
- ✅ Installs Node.js
- ✅ Runs `npm install`
- ✅ Runs `npm run build`
- ✅ Uploads `build/` to Azure
- ✅ Deploys globally

**Why it works:**
- Azure already has your `package.json`
- Azure knows build output is in `build/`
- GitHub Actions handles everything!

---

## 🚀 **Step 9: First Deployment Completes**

The page will show:

```
✅ Deployment succeeded

Your app is available at:
https://chatbot-widget-[random].azurewebsites.net

Preview URL:
https://chatbot-widget-[random]-[hash].azurewebsites.net
```

Click the URL to test! ✅

---

## 🧪 **Step 10: Verify Your App Works**

1. Click the URL you got in Step 9
2. Browser opens with your app
3. Should see:
   - ✅ Chatbot widget appears
   - ✅ Can type messages
   - ✅ Bot responds from backend
   - ✅ No console errors

### **Test the Widget**

Try saying: **"Hi"**

Expected:
```
You: Hi
Bot: [Response from backend server]
```

✅ **If you see bot responses: Deployment successful!** 🎉

---

## 🔗 **Step 11: Check GitHub Actions**

Go to your GitHub repo:

```
repo.github.com/your-username/chatbot-widget
  └─ Click "Actions" tab
      └─ See workflow running/completed
          └─ Shows build logs
```

You should see:
```
✅ azure-static-web-apps-[name].yml

Workflow run:
├─ Checkout code ✅
├─ Setup Node ✅
├─ Install deps ✅
├─ Build React ✅
└─ Deploy to Azure ✅
```

---

## 🎯 **Step 12: Access Your App**

Now you have 3 URLs:

### **1. Main Production URL**
```
https://chatbot-widget-abc123.azurewebsites.net
```
- Share this publicly
- Change name in Azure settings if you want

### **2. Widget.js URL**
```
https://chatbot-widget-abc123.azurewebsites.net/widget.js
```
- Embed this on other websites!
- All websites can use it

### **3. GitHub Actions Logs**
```
github.com/your-username/chatbot-widget/actions
```
- Monitor deployments
- See build details

---

## 🔧 **Advanced: Rename Your App URL**

If `chatbot-widget-abc123` is ugly and you want a custom name:

1. Go to Azure Portal
2. Find your Static Web App resource
3. Go to **Settings** → **Custom domains**
4. Add custom domain like `chatbot.example.com`
5. Follow DNS setup instructions

**For free trial:** Keep the auto-generated name (it's fine!)

---

## 📊 **What Happens Next**

### **From Now On (Automatic!)**

Every time you push code:

```bash
git add .
git commit -m "Update chatbot"
git push origin main
```

**Automatically:**
1. ✅ GitHub Actions detects push
2. ✅ Runs workflow (npm install, npm build)
3. ✅ Uploads to Azure
4. ✅ App updates globally (2-3 min) 🚀

**No manual steps needed!**

---

## 🌐 **Step 13: Embed Widget Anywhere**

Your app is live! Now embed it:

### **On Any Website**

```html
<!-- Add this to any HTML file -->
<script src="https://chatbot-widget-abc123.azurewebsites.net/widget.js"></script>
<script>
  ChatbotWidget.init({
    position: 'bottom-right',
    width: 380,
    height: 500,
    theme: 'light'
  });
</script>
```

**Test it:**
1. Create a test HTML file
2. Add script tag above
3. Open in browser
4. Widget appears! ✅

---

## 🐛 **Troubleshooting**

### **Issue: "Deployment Failed"**

Check GitHub Actions logs:

```
Actions → Click latest workflow → See error
```

Common issues:
- ❌ `npm install` failed → Check package.json syntax
- ❌ `npm run build` failed → Check React code errors
- ❌ Wrong output location → Check build/ folder exists

**Solution:**
1. Fix error locally
2. Test: `npm install && npm run build`
3. Push again: `git push origin main`
4. GitHub Actions auto-retries!

---

### **Issue: "App Works Locally But Not on Azure"**

Check if:
- ✅ Socket.io connects correctly
- ✅ Backend URL is correct
- ✅ CORS headers OK

Test Socket.io:
```bash
npm start
# Open browser console
# Type: console.log("Test")
# Should see "✅ Socket connected" message
```

---

### **Issue: "Widget.js Not Found"**

Check:
1. ✅ File exists: `public/widget.js`
2. ✅ Build output has it: `build/widget.js`
3. ✅ Azure has it: Visit `https://your-url/widget.js` in browser

---

## ✅ **Deployment Checklist**

- [ ] Azure account created
- [ ] Code pushed to GitHub `main` branch
- [ ] Created Static Web App in Azure Portal
- [ ] Selected GitHub + repository
- [ ] Selected React preset
- [ ] Confirmed: app location `/`, output location `build`
- [ ] Clicked "Create"
- [ ] First deployment succeeded
- [ ] App URL working
- [ ] Tested chat functionality
- [ ] GitHub Actions workflow running
- [ ] Widget.js accessible at `/widget.js`
- [ ] Ready to embed on other sites!

---

## 🎉 **You're Done!**

Your chatbot widget is now:
- 🌍 Live on the internet
- 🚀 Auto-deploys on every push
- 🔒 HTTPS secured
- ⚡ Globally distributed via CDN
- 📱 Mobile responsive
- 🔗 Embeddable anywhere

**Next:**
1. Embed widget.js on partner websites
2. Monitor analytics in Azure Portal
3. Update code → push → auto-deploy!

---

## 📞 **Need Help?**

If something goes wrong:
1. Check **Azure Portal** → Your resource → Error details
2. Check **GitHub Actions** → Latest workflow → Logs
3. Check **Browser Console** → F12 → Console tab → Errors
4. Check `HOW_AZURE_DEPLOYS.md` for detailed explanation

**Common fixes:** Delete node_modules → `npm install` → `npm run build` → `git push`

---

**You're all set! 🚀 Your app is production-ready!**
