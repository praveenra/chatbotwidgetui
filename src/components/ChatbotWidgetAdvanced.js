import React, { useState, useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, sendMessage, onBotMessage, offBotMessage } from '../services/socketService';
import './ChatbotWidgetAdvanced.css';

const ChatbotWidgetAdvanced = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = connectSocket();
    
    // Check initial connection status
    if (socketRef.current?.connected) {
      setIsConnected(true);
    }

    // Listen for incoming bot messages
    const handleBotMsg = (data) => {
      setIsTyping(false);
      const messageText = typeof data === 'string' ? data : data;
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: messageText,
        sender: 'bot',
        timestamp: new Date()
      }]);
    };

    onBotMessage(handleBotMsg);

    // Handle connection events
    socketRef.current?.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Socket connected:', socketRef.current.id);
      addSystemMessage('Connected to chat support');
    });

    socketRef.current?.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Socket disconnected');
      addSystemMessage('Disconnected from chat support');
    });

    socketRef.current?.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error);
      addSystemMessage('Connection error. Retrying...');
    });

    return () => {
      offBotMessage(handleBotMsg);
      disconnectSocket();
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: text,
      sender: 'system',
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !isConnected) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    if (socketRef.current?.connected) {
      // Send the message text as a string to the backend
      sendMessage(inputValue);
      setIsTyping(true);
    }

    setInputValue('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-widget">
        {/* Header */}
        <div className="chatbot-header-advanced">
          <div className="header-content">
            <h2>Support Team</h2>
            <p className="header-subtitle">We're here to help</p>
          </div>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            <span className="status-text">{isConnected ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.length === 0 ? (
            <div className="welcome-section">
              <div className="welcome-icon">👋</div>
              <h3>Welcome!</h3>
              <p>Start a conversation with our support team</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                  {msg.sender === 'system' ? (
                    <div className="system-message">
                      <span>{msg.text}</span>
                    </div>
                  ) : (
                    <>
                      <div className="message-bubble">
                        <p className="message-text">{msg.text}</p>
                        <span className="message-timestamp">
                          {msg.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="message-wrapper bot">
                  <div className="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form className="input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isConnected}
            className="message-input-advanced"
          />
          <button 
            type="submit" 
            disabled={!isConnected || !inputValue.trim()}
            className="send-button-advanced"
          >
            <span>→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotWidgetAdvanced;
