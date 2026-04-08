import React, { useState, useEffect, useRef } from 'react';
import ChatBot from 'react-chatbotify';
import { connectSocket, disconnectSocket, sendMessage, onMessageReceived, emitTyping } from '../services/socketService';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = connectSocket();
    setIsConnected(socketRef.current?.connected || false);

    // Listen for incoming messages with agent metadata
    onMessageReceived((data) => {
      // Handle both new format (object) and old format (string)
      const message = typeof data === 'string' ? data : data.text;
      const agent = typeof data === 'object' ? data.agent : null;
      
      setMessages((prev) => [...prev, {
        id: Date.now(),
        text: message,
        sender: 'bot',
        agent: agent,
        timestamp: new Date(),
        shouldEscalate: data.shouldEscalate || false
      }]);
      
      if (agent) {
        setCurrentAgent(agent);
      }
      
      setIsTyping(false);
    });

    // Listen for typing indicator
    socketRef.current?.on('user:typing', (data) => {
      setIsTyping(data.isTyping);
    });

    // Handle connection events
    socketRef.current?.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to chat server');
    });

    socketRef.current?.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected from chat server');
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
      setIsTyping(true);
    }
  };

  /**
   * Get agent display label and color
   */
  const getAgentBadge = (agent) => {
    const agentInfo = {
      lead: { label: '📈 Sales Team', color: '#22c55e' },
      support: { label: '🛠️ Support Team', color: '#3b82f6' },
      product: { label: '📚 Product Team', color: '#8b5cf6' },
      billing: { label: '💳 Billing Team', color: '#f59e0b' },
      escalation: { label: '👤 Specialist', color: '#ef4444' },
      error: { label: '⚠️ Error', color: '#6b7280' }
    };
    return agentInfo[agent] || { label: '🤖 Assistant', color: '#6366f1' };
  };

  return (
    <div className="chatbot-widget-container">
      <div className="chatbot-header">
        <h2>Smart Chat Support</h2>
        <div className="header-right">
          {currentAgent && (
            <span className="agent-badge" style={{ backgroundColor: getAgentBadge(currentAgent).color }}>
              {getAgentBadge(currentAgent).label}
            </span>
          )}
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
      </div>
      
      <div className="chatbot-body">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>👋 Start a conversation with us!</p>
            <p className="empty-subtitle">Our AI will route you to the right team</p>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((msg) => {
              const agentBadgeInfo = msg.agent ? getAgentBadge(msg.agent) : null;
              return (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  {msg.sender === 'bot' && msg.agent && (
                    <div className="agent-indicator" style={{ color: agentBadgeInfo.color }}>
                      {agentBadgeInfo.label}
                    </div>
                  )}
                  <div className="message-content">
                    {msg.text}
                  </div>
                  {msg.shouldEscalate && (
                    <div className="escalation-notice">
                      🔔 This may require human assistance
                    </div>
                  )}
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            {isTyping && (
              <div className="message bot typing-indicator">
                <div className="typing-dots">
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

      <div className="chatbot-footer">
        <input
          type="text"
          placeholder={isConnected ? "Type your message..." : "Reconnecting..."}
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
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotWidget;
