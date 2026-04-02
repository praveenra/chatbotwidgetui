import io from 'socket.io-client';

const BACKEND_URL = 'https://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net';

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      secure: true,
      rejectUnauthorized: false,
      path: '/socket.io',
      forceNew: false,
      multiplex: true
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected to backend:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error.message);
    });

    socket.on('error', (error) => {
      console.error('⚠️ Socket error:', error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

export const sendMessage = (message) => {
  if (socket && socket.connected) {
    socket.emit('user_message', message);
    console.log('📤 Message sent:', message);
  } else {
    console.error('❌ Socket not connected');
  }
};

export const onBotMessage = (callback) => {
  if (socket) {
    socket.on('bot_message', callback);
  }
};

export const offBotMessage = (callback) => {
  if (socket) {
    socket.off('bot_message', callback);
  }
};

export const onTyping = (callback) => {
  if (socket) {
    socket.on('typing', callback);
  }
};

export const emitTyping = (isTyping) => {
  if (socket && socket.connected) {
    socket.emit('typing', isTyping);
  }
};
