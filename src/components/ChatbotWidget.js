import React, { useState, useEffect, useRef } from 'react';
import ChatBot from 'react-chatbotify';
import { connectSocket, disconnectSocket, sendMessage, onMessageReceived, emitTyping } from '../services/socketService';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = connectSocket();
    setIsConnected(socketRef.current?.connected || false);

    // Listen for incoming messages
    onMessageReceived((data) => {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        text: data.message || data,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    });

    // Listen for typing indicator
    socketRef.current?.on('user:typing', (data) => {
      setIsTyping(data.isTyping);
    });

    // Handle connection events
    socketRef.current?.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socketRef.current?.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSendMessage = (message) => {
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to backend
    if (isConnected && socketRef.current) {
      sendMessage({
        message: message,
        timestamp: new Date(),
        userId: socketRef.current.id
      });
      emitTyping(true);
      setIsTyping(true);
    }
  };

  const chatbotflow = {
    start: {
      message: "Hi there! 👋 How can I help you today?",
      nextStep: "input_message"
    },
    input_message: {
      message: "Type your message:",
      function: (params) => { handleSendMessage(params); },
      nextStep: "end"
    },
    end: {
      message: "Thank you for chatting with us!",
      nextStep: "start"
    }
  };

  return (
    <div className="chatbot-widget-container">
      <div className="chatbot-header">
        <h2>Chat Support</h2>
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Online' : '🔴 Offline'}
        </span>
      </div>
      
      <div className="chatbot-body">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation with us!</p>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.text}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing-indicator">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chatbot-footer">
        <input
          type="text"
          placeholder="Type your message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              handleSendMessage(e.target.value);
              e.target.value = '';
            }
          }}
          disabled={!isConnected}
        />
        <button
          onClick={(e) => {
            const input = e.target.previousElementSibling;
            if (input.value.trim()) {
              handleSendMessage(input.value);
              input.value = '';
            }
          }}
          disabled={!isConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotWidget;
