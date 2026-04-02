# Widget Integration Guide

How to embed the Nobroker Chatbot Widget on any website.

## 🚀 Quick Start (30 seconds)

After deploying to Azure, add this to your website:

```html
<!-- Add to your HTML <head> or <body> -->
<script src="https://your-azure-url.azurewebsites.net/widget.js"></script>

<script>
  ChatbotWidget.init({
    position: 'bottom-right'
  });
</script>
```

That's it! Widget appears in bottom-right corner.

## 📍 Positioning

```javascript
// Bottom Right (default)
ChatbotWidget.init({
  position: 'bottom-right'
});

// Bottom Left
ChatbotWidget.init({
  position: 'bottom-left'
});
```

## 🎨 Customization

### Full Configuration Example

```javascript
ChatbotWidget.init({
  // Position on screen
  position: 'bottom-right',      // or 'bottom-left'
  
  // Size
  width: 380,                     // in pixels
  height: 500,                    // in pixels
  
  // Appearance
  theme: 'light',                 // or 'dark'
  zIndex: 9999,                   // layer above other elements
  
  // Behavior
  autoOpen: false,                // open immediately on load
  animated: true,                 // smooth animations
  
  // Backend
  backendUrl: 'https://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net'
});
```

## 🎮 JavaScript API

### Initialize
```javascript
ChatbotWidget.init(config);
```

### Get Status
```javascript
const status = ChatbotWidget.getStatus();
console.log(status);
// {
//   loaded: true,
//   version: "1.0.0",
//   config: {...}
// }
```

### Show/Hide
```javascript
ChatbotWidget.setVisible(true);   // Show
ChatbotWidget.setVisible(false);  // Hide
```

### Remove Widget
```javascript
ChatbotWidget.destroy();
```

### Send Message to Widget
```javascript
ChatbotWidget.postMessage('USER_MESSAGE', {
  text: 'Hello'
});
```

## 📱 Responsive Design

Widget automatically adapts to mobile/desktop:

```javascript
// Same code works everywhere
ChatbotWidget.init({
  position: 'bottom-right'
});

// On mobile: Full width, height adjusts
// On desktop: 380x500px in corner
```

## 🔗 Integration Examples

### WordPress

1. Go to **Appearance** → **Theme File Editor**
2. Edit **footer.php**
3. Add before `</body>`:

```html
<!-- Nobroker Chatbot Widget -->
<script src="https://your-azure-url.azurewebsites.net/widget.js"></script>
<script>
  ChatbotWidget.init({ position: 'bottom-right' });
</script>
```

### Shopify

1. Go to **Online Store** → **Themes**
2. Click **Edit code**
3. Find **theme.liquid**
4. Add before `</body>`:

```liquid
<!-- Nobroker Chatbot Widget -->
<script src="https://your-azure-url.azurewebsites.net/widget.js"></script>
<script>
  ChatbotWidget.init({ position: 'bottom-right' });
</script>
```

### HTML Static Site

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>Your content here...</p>

    <!-- Widget at bottom -->
    <script src="https://your-azure-url.azurewebsites.net/widget.js"></script>
    <script>
      ChatbotWidget.init({
        position: 'bottom-right',
        width: 380,
        height: 500
      });
    </script>
</body>
</html>
```

### React Application

```jsx
// App.js
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Load widget script dynamically
    const script = document.createElement('script');
    script.src = 'https://your-azure-url.azurewebsites.net/widget.js';
    script.onload = () => {
      window.ChatbotWidget.init({
        position: 'bottom-right'
      });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      window.ChatbotWidget?.destroy();
    };
  }, []);

  return <div>Your React App</div>;
}
```

### Next.js Application

```jsx
// pages/_app.js
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://your-azure-url.azurewebsites.net/widget.js';
    script.onload = () => {
      window.ChatbotWidget.init();
    };
    document.body.appendChild(script);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

### Vue.js Application

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <h1>My Vue App</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://your-azure-url.azurewebsites.net/widget.js';
    script.onload = () => {
      window.ChatbotWidget.init({
        position: 'bottom-right'
      });
    };
    document.body.appendChild(script);
  },
  
  beforeUnmount() {
    window.ChatbotWidget?.destroy();
  }
}
</script>
```

## 🔒 Security & Privacy

- Widget loads from your secure Azure domain
- All communication uses HTTPS
- Backend URL is configurable
- No cookies or local storage by default
- CORS headers properly configured

## ⚡ Performance

- Widget script: ~5KB gzipped
- Lazy loads iframe on demand
- Non-blocking script loading
- Optimized animations
- Minimal DOM impact

## 🐛 Debugging

Enable console logging:

```javascript
ChatbotWidget.init({
  position: 'bottom-right',
  debug: true  // Shows console logs
});
```

Check browser console:
- Look for `[Chatbot Widget]` messages
- Verify socket connection
- Check for CORS errors
- Inspect Network tab

## ❓ Troubleshooting

### Widget not appearing

1. Check script loaded: Open DevTools → Network tab
2. Verify Azure URL is accessible
3. Check for JavaScript errors in Console
4. Ensure Z-index isn't hidden by other elements

### Messages not sending

1. Check browser console: Look for `[Chatbot Widget]` messages
2. Verify backend URL is correct
3. Check Network tab for failed requests
4. Verify socket connection (should see `✅ Socket connected`)

### CORS errors

Add to your HTML:
```html
<!-- Enable cross-origin requests -->
<meta name="referrer" content="strict-origin-when-cross-origin">
```

### Widget blocked by content security policy

Add to your website's CSP header:
```
script-src: https://your-azure-url.azurewebsites.net
frame-src: https://your-azure-url.azurewebsites.net
```

## 📊 Analytics (Optional)

Track widget usage with your analytics:

```javascript
ChatbotWidget.init({
  position: 'bottom-right',
  onLoad: () => {
    // Track widget opened
    gtag('event', 'chatbot_loaded');
  },
  onMessage: (message) => {
    // Track messages
    gtag('event', 'chatbot_message', {
      message: message.text
    });
  }
});
```

## 🚀 Advanced Usage

### Auto-open immediately
```javascript
ChatbotWidget.init({
  position: 'bottom-right',
  autoOpen: true
});
```

### Delay initialization
```javascript
setTimeout(() => {
  ChatbotWidget.init({
    position: 'bottom-right'
  });
}, 5000); // After 5 seconds
```

### Conditionally load
```javascript
// Only show widget to certain users
if (userType === 'customer') {
  ChatbotWidget.init();
}
```

### Conditional styling
```javascript
const isMobile = window.innerWidth < 768;

ChatbotWidget.init({
  position: isMobile ? 'bottom-right' : 'bottom-right',
  width: isMobile ? window.innerWidth - 20 : 380,
  height: isMobile ? window.innerHeight - 100 : 500
});
```

## 📞 Support

For issues:
1. Check [DEPLOY_TO_AZURE.md](./DEPLOY_TO_AZURE.md) for deployment issues
2. View [README.md](./README.md) for general info
3. Check browser DevTools console
4. Review Azure Static Web Apps docs

---

**You're all set!** Your chatbot is embedded and ready to chat. 🎉
