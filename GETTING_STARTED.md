# Getting Started with Nobroker Chatbot Widget

## Quick Start

### Option 1: Use the Standalone HTML Widget (Easiest)

1. Navigate to the project folder
2. Open `widget.html` in your web browser
3. Click the 💬 button to open the chat widget
4. Start chatting!

**No installation or build process required!**

### Option 2: Run the React Application

#### Prerequisites
- Node.js 14+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

#### Installation Steps

**On Windows:**
```bash
# Double-click setup.bat
# OR run this in PowerShell/CMD
setup.bat
```

**On macOS/Linux:**
```bash
# Run setup script
chmod +x setup.sh
./setup.sh
```

**Manual Setup:**
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open http://localhost:3000 in your browser
```

## Project Files Overview

```
├── widget.html                    ← Standalone widget (no build needed)
├── public/
│   └── index.html                 ← React HTML template
├── src/
│   ├── components/
│   │   ├── ChatbotWidget.js       ← Basic widget component
│   │   ├── ChatbotWidget.css
│   │   ├── ChatbotWidgetAdvanced.js  ← Advanced widget component
│   │   └── ChatbotWidgetAdvanced.css
│   ├── services/
│   │   └── socketService.js       ← Socket.io configuration
│   ├── App.js                     ← Main React app
│   ├── index.js                   ← Entry point
│   └── index.css                  ← Global styles
├── package.json                   ← Dependencies
├── README.md                       ← Full documentation
├── .env.example                   ← Configuration template
└── GETTING_STARTED.md             ← This file
```

## Configuration

### Backend URL

The widget connects to:
```
https://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net
```

To change it:

**React Version:**
Edit `src/services/socketService.js`:
```javascript
const BACKEND_URL = 'YOUR_NEW_URL';
```

**HTML Version:**
Edit `widget.html`:
```javascript
const BACKEND_URL = 'YOUR_NEW_URL';
```

## Development

### Available Commands

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Remove build configuration
npm eject
```

### Hot Reload
Changes to `.js` and `.css` files are automatically reflected in the browser during development.

## Using Different Widget Components

### Option A: Basic Widget
```javascript
// App.js
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return <ChatbotWidget />;
}
```

### Option B: Advanced Widget (Recommended)
```javascript
// App.js
import ChatbotWidgetAdvanced from './components/ChatbotWidgetAdvanced';

function App() {
  return <ChatbotWidgetAdvanced />;
}
```

## Embedding the Widget

### In Another React App
```javascript
import ChatbotWidgetAdvanced from './components/ChatbotWidgetAdvanced';

export default function MyApp() {
  return (
    <div>
      <h1>My App</h1>
      <ChatbotWidgetAdvanced />
    </div>
  );
}
```

### In HTML with iframe
```html
<iframe 
  src="path/to/widget.html"
  style="position: fixed; 
         bottom: 20px; 
         right: 20px; 
         width: 380px; 
         height: 500px; 
         border: none;
         border-radius: 12px;
         z-index: 9999;">
</iframe>
```

### Include in HTML directly
```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>Welcome</h1>
  
  <!-- Include the widget HTML directly -->
  <script src="path/to/widget.js"></script>
  
  <!-- Widget will appear in bottom-right corner -->
</body>
</html>
```

## Socket.io Events

### Sending Messages

```javascript
// Message object structure
{
  message: "Hello world",
  timestamp: 2024-04-02T10:30:00.000Z,
  userId: "socket-id-123"
}
```

### Receiving Messages

Backend should send:
```javascript
{
  message: "Response from bot",
  timestamp: 2024-04-02T10:30:05.000Z
}
```

### Typing Indicator

```javascript
// Emit when user is typing
socket.emit('typing', { isTyping: true });

// Listen for bot typing
socket.on('typing', (data) => {
  console.log(data.isTyping);
});
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process using port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

### WebSocket Connection Failed
1. Verify backend URL is correct
2. Check backend is running
3. Check browser console for CORS errors
4. Verify WebSocket is enabled on server

### Widget Not Showing
1. Check browser console for JavaScript errors
2. Verify Socket.io CDN is loaded (for HTML version)
3. Check backend connection status (look for green/red indicator)

### Messages Not Sending
1. Verify socket is connected (green indicator)
2. Check message format matches backend expectations
3. Verify backend is receiving events

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Mobile Chrome | Latest | ✅ Full Support |
| Mobile Safari | 14+ | ✅ Full Support |

## Performance Tips

1. **Use Widget HTML Version** for simple use cases (no build overhead)
2. **Lazy Load React Component** if embedding in large app
3. **Compress Images** if adding custom media
4. **Enable GZIP** on backend for message compression
5. **Use CDN** for widget.html distribution

## Security Considerations

⚠️ **Important:**
- The widget connects to a public backend
- Don't store sensitive user data in messages
- Validate all input on the server
- Use HTTPS for all connections
- Consider implementing authentication

## Next Steps

1. ✅ Install the widget
2. ✅ Test the connection
3. ✅ Customize styling if needed
4. ✅ Deploy to production
5. ✅ Monitor performance

## Support

For issues:
1. Check the [README.md](./README.md)
2. Review browser console for errors
3. Check backend connectivity
4. Verify Socket.io configuration

## License

MIT - Feel free to use and modify
