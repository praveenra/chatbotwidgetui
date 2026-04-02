# Nobroker Chatbot Widget

A modern, responsive chatbot UI widget with Socket.io real-time communication, similar to the Nobrokers chat widget.

## Features

✅ Real-time messaging with Socket.io  
✅ Responsive design (mobile & desktop)  
✅ Typing indicators  
✅ Online/offline status indicator  
✅ Message timestamps  
✅ Beautiful gradient UI  
✅ Two implementations:
   - React component (React-based)
   - Standalone HTML widget (Can be embedded anywhere)

## Backend

**API URL:** `https://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net`

The backend expects Socket.io connection with support for:
- `message` events
- `typing` events
- Connection status events

## Project Structure

```
nobrokerstyle/
├── public/
│   └── index.html                 # React app HTML template
├── src/
│   ├── components/
│   │   ├── ChatbotWidget.js       # Main chatbot component
│   │   └── ChatbotWidget.css      # Component styles
│   ├── services/
│   │   └── socketService.js       # Socket.io service
│   ├── App.js                     # Main React app
│   ├── index.js                   # React entry point
│   └── index.css                  # Global styles
├── widget.html                    # Standalone HTML widget (no build needed)
└── package.json                   # Dependencies
```

## Installation

### Option 1: React Version

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm build
   ```

The app will open at `http://localhost:3000`

### Option 2: Standalone HTML Widget

Simply open `widget.html` in a browser. No installation or build process required!

To embed in another website, add this to your HTML:

```html
<iframe src="path/to/widget.html" 
        style="position: fixed; bottom: 20px; right: 20px; 
               width: 380px; height: 500px; border: none; 
               border-radius: 12px; z-index: 9999;">
</iframe>
```

Or include the entire `widget.html` content in a `<div>` and load it dynamically.

## Usage

### React Component

```javascript
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return <ChatbotWidget />;
}

export default App;
```

### Standalone HTML

The widget is a drop-in, self-contained HTML file. Simply open `widget.html` in your browser or embed it in your website.

The widget includes:
- Toggle button (💬 emoji)
- Chat interface
- Message sending functionality
- Auto connection to backend

## Socket.io Events

### Client → Server

```javascript
// Send a message
socket.emit('message', {
  message: 'Hello',
  timestamp: new Date(),
  userId: socket.id
});

// Send typing indicator
socket.emit('typing', {
  isTyping: true
});
```

### Server → Client

```javascript
// Receive a message
socket.on('message', (data) => {
  console.log(data.message);
});

// Receive typing indicator
socket.on('typing', (data) => {
  console.log(data.isTyping);
});

// Connection status
socket.on('connect', () => console.log('Connected'));
socket.on('disconnect', () => console.log('Disconnected'));
```

## Configuration

### Backend URL

To change the backend URL, edit:

**React version:** `src/services/socketService.js`
```javascript
const BACKEND_URL = 'YOUR_NEW_URL';
```

**HTML version:** `widget.html`
```javascript
const BACKEND_URL = 'YOUR_NEW_URL';
```

### Styling

The widget uses CSS gradients and can be customized:
- Primary color: `#667eea` to `#764ba2` (purple gradient)
- Modify the gradient in `.chatbot-widget-container` background

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

### React Version
- react (18.2.0)
- react-dom (18.2.0)
- socket.io-client (4.5.4)
- react-chatbotify (2.0.0)
- axios (1.4.0)

### HTML Version
- No dependencies! Uses only vanilla JavaScript and Socket.io CDN

## Troubleshooting

### Connection Issues
1. Verify backend URL is correct
2. Check CORS settings on backend
3. Ensure WebSocket is enabled
4. Check browser console for errors

### Messages Not Sending
- Verify socket connection status (green/red indicator)
- Check backend is running and accepting connections
- Verify message format matches backend expectations

### Styling Issues
- Clear browser cache
- Check CSS file is loaded properly
- Verify browser supports CSS gradients

## Future Enhancements

- [ ] File upload support
- [ ] Emoji picker
- [ ] Message persistence
- [ ] User authentication
- [ ] Chat history
- [ ] Bot AI integration
- [ ] Voice message support
- [ ] Screen sharing capability

## License

MIT

## Support

For issues or questions, check the backend API documentation or contact support.
