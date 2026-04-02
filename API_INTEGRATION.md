# Socket.io API Integration Guide

## Backend Connection

### Server URL
```
https://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net
```

### Connection Configuration

The widget automatically connects with these settings:

```javascript
{
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  secure: true,
  rejectUnauthorized: false
}
```

## Socket Events

### Client → Server Events

#### 1. Send Message
```javascript
socket.emit('message', {
  message: string,           // Required: The message text
  timestamp: Date,          // Required: Message timestamp
  userId: string            // Required: User ID (socket.id)
});
```

**Example:**
```javascript
socket.emit('message', {
  message: 'Hello, I need help with my property',
  timestamp: new Date(),
  userId: socket.id
});
```

#### 2. Typing Indicator
```javascript
socket.emit('typing', {
  isTyping: boolean,        // Required: User is typing or not
  userId?: string          // Optional: User ID
});
```

**Example:**
```javascript
// User started typing
socket.emit('typing', { isTyping: true });

// User stopped typing
socket.emit('typing', { isTyping: false });
```

### Server → Client Events

#### 1. Receive Message
```javascript
socket.on('message', (data) => {
  console.log(data.message);        // Message text
  console.log(data.timestamp);      // When message was sent
  console.log(data.senderId);       // Who sent it
});
```

#### 2. Typing Indicator
```javascript
socket.on('typing', (data) => {
  console.log(data.isTyping);       // Is bot typing?
  console.log(data.userId);        // Which user?
});

// Alternative event name
socket.on('user:typing', (data) => {
  console.log(data.isTyping);
});
```

#### 3. Connection Status
```javascript
// User connected
socket.on('connect', () => {
  console.log('Connected with ID:', socket.id);
});

// User disconnected
socket.on('disconnect', () => {
  console.log('Disconnected');
});

// Connection error
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
```

## Request/Response Examples

### Example 1: Simple Message Exchange

**Client:**
```javascript
socket.emit('message', {
  message: 'What are the office hours?',
  timestamp: new Date(),
  userId: socket.id
});
```

**Server Response Expected:**
```javascript
socket.on('message', (data) => {
  // {
  //   message: 'Our office is open 9 AM to 6 PM, Monday to Friday.',
  //   timestamp: 2024-04-02T10:30:05.000Z,
  //   senderId: 'bot-001'
  // }
});
```

### Example 2: Typing Indicator Sequence

```javascript
// 1. User starts typing
socket.emit('typing', { isTyping: true });

// ... delay of 2 seconds ...

// 2. User stops typing
socket.emit('typing', { isTyping: false });

// 3. Send message
socket.emit('message', {
  message: 'I have a question about pricing',
  timestamp: new Date(),
  userId: socket.id
});

// 4. Server shows bot is typing
socket.on('typing', (data) => {
  if (data.isTyping) {
    console.log('Bot is typing...');
  }
});

// 5. Server sends response
socket.on('message', (data) => {
  console.log('Bot:', data.message);
});
```

## Data Types

### Message Object

```typescript
interface Message {
  message: string;           // Message content (required)
  timestamp: Date;          // ISO 8601 format (required)
  userId: string;           // User/socket ID (required)
  senderId?: string;        // Sender ID (optional)
  metadata?: {
    // Optional: Additional data
    language?: string;
    platform?: string;
    version?: string;
  }
}
```

### Typing Object

```typescript
interface TypingStatus {
  isTyping: boolean;        // Is typing or not (required)
  userId?: string;          // User ID (optional)
  duration?: number;        // Duration in milliseconds (optional)
}
```

## Error Handling

### Connection Errors

```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  
  // Handle different error types
  if (error.type === 'UnauthorizedError') {
    console.error('Authentication failed');
  } else if (error.type === 'TransportError') {
    console.error('Transport layer error');
  }
});
```

### Message Errors

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('message_error', (error) => {
  console.error('Message delivery failed:', error.message);
});
```

## Rate Limiting

The backend may implement rate limiting:

```javascript
socket.on('rate_limit', (data) => {
  console.warn('Rate limited:', data.message);
  console.warn('Retry after:', data.retryAfter, 'seconds');
});
```

## Authentication (if required)

```javascript
socket = io(BACKEND_URL, {
  auth: {
    token: 'your-auth-token',
    userId: 'user-123'
  }
});

socket.on('connect_error', (error) => {
  if (error.data?.content?.message) {
    console.error('Auth error:', error.data.content.message);
  }
});
```

## Message Validation

### Before Sending

```javascript
function validateMessage(message) {
  if (!message.message || typeof message.message !== 'string') {
    console.error('Message text required');
    return false;
  }
  
  if (!message.timestamp) {
    console.error('Timestamp required');
    return false;
  }
  
  if (!message.userId) {
    console.error('User ID required');
    return false;
  }
  
  if (message.message.length > 5000) {
    console.error('Message too long (max 5000 characters)');
    return false;
  }
  
  return true;
}

// Usage
if (validateMessage(messageObj)) {
  socket.emit('message', messageObj);
}
```

## Best Practices

### 1. Always Include Timestamps
```javascript
// ✅ Good
socket.emit('message', {
  message: 'Hello',
  timestamp: new Date(),
  userId: socket.id
});

// ❌ Bad
socket.emit('message', {
  message: 'Hello',
  userId: socket.id
});
```

### 2. Handle Connection State
```javascript
// ✅ Good
if (socket && socket.connected) {
  socket.emit('message', messageObj);
} else {
  console.error('Socket not connected');
  // Show error to user
}

// ❌ Bad
socket.emit('message', messageObj); // May fail silently
```

### 3. Implement Retry Logic
```javascript
function sendMessageWithRetry(message, maxRetries = 3) {
  let attempts = 0;
  
  function attempt() {
    if (attempts >= maxRetries) {
      console.error('Failed to send message after retries');
      return;
    }
    
    if (socket?.connected) {
      socket.emit('message', message);
    } else {
      attempts++;
      setTimeout(attempt, 1000 * attempts);
    }
  }
  
  attempt();
}
```

### 4. Clean Up Listeners
```javascript
// ✅ Good - Remove listener when done
const messageHandler = (data) => {
  console.log('Message:', data);
};

socket.on('message', messageHandler);

// Later, when component unmounts:
socket.off('message', messageHandler);

// ❌ Bad - Memory leak
socket.on('message', (data) => {
  console.log('Message:', data);
}); // No cleanup
```

### 5. Debounce Typing Indicator
```javascript
let typingTimeout;

function handleUserTyping() {
  // Clear previous timeout
  clearTimeout(typingTimeout);
  
  // Emit typing started
  socket.emit('typing', { isTyping: true });
  
  // Set timeout to emit typing stopped
  typingTimeout = setTimeout(() => {
    socket.emit('typing', { isTyping: false });
  }, 3000); // Stop after 3 seconds of inactivity
}

input.addEventListener('input', handleUserTyping);
```

## Testing the API

### Using Socket.io Client Library

```javascript
import io from 'socket.io-client';

const socket = io('https://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net');

socket.on('connect', () => {
  console.log('Connected!');
  
  // Send test message
  socket.emit('message', {
    message: 'Test message',
    timestamp: new Date(),
    userId: socket.id
  });
});

socket.on('message', (data) => {
  console.log('Received:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

### Using curl (for WebSocket testing)
```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c "wss://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net/socket.io/?transport=websocket"

# Send message
{"message":"test","timestamp":"2024-04-02T10:30:00Z","userId":"test-user"}
```

## Debugging

### Enable Debug Logging

```javascript
// Enable Socket.io debug logs
localStorage.debug = 'socket.io-client:*';

// Or in code
socket.onAny((event, ...args) => {
  console.log(`>>> ${event}`, args);
});
```

### Check Connection Status

```javascript
console.log('Connected:', socket.connected);
console.log('Socket ID:', socket.id);
console.log('URL:', socket.io.uri);
console.log('Transport:', socket.io.engine.transport.name);
```

## Troubleshooting

### Messages Not Received
- ✅ Check socket is connected
- ✅ Verify message format
- ✅ Check backend logs
- ✅ Verify network in DevTools

### Connection Drops
- ✅ Check network stability
- ✅ Increase reconnection attempts
- ✅ Check server capacity
- ✅ Verify firewall rules

### Typing Indicator Not Working
- ✅ Listen to correct event name ('typing' or 'user:typing')
- ✅ Ensure data format is correct
- ✅ Check if server emits this event

## Related Documentation

- [Socket.io Official Docs](https://socket.io/docs/)
- [Widget HTML](./widget.html)
- [Socket Service](./src/services/socketService.js)
- [README](./README.md)
