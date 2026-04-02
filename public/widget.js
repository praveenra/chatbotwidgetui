#!/usr/bin/env node

/**
 * Nobroker Chatbot Widget Loader
 * 
 * This script loads the chatbot widget into any website.
 * 
 * Usage:
 * <script src="https://your-domain.com/widget.js"></script>
 * <script>
 *   ChatbotWidget.init({
 *     position: 'bottom-right',
 *     theme: 'light'
 *   });
 * </script>
 */

(function() {
  'use strict';

  const WIDGET_VERSION = '1.0.0';
  const WIDGET_ID = 'nobroker-chatbot-widget';
  const IFRAME_ID = 'nobroker-chatbot-iframe';
  const DEFAULT_BACKEND_URL = 'https://chatbotapi-prod-v1-bhcsdnbbdygjhpe9.southindia-01.azurewebsites.net';

  // Get the current script's directory
  const getCurrentScriptDirectory = () => {
    const scripts = document.getElementsByTagName('script');
    let currentScript = null;

    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.includes('widget.js')) {
        currentScript = scripts[i];
        break;
      }
    }

    if (!currentScript) {
      return window.location.origin;
    }

    const url = new URL(currentScript.src);
    return url.origin;
  };

  const WIDGET_URL = getCurrentScriptDirectory();

  // Default configuration
  const defaultConfig = {
    position: 'bottom-right',
    width: 380,
    height: 500,
    theme: 'light',
    zIndex: 9999,
    backendUrl: DEFAULT_BACKEND_URL,
    autoOpen: false,
    animated: true
  };

  let config = { ...defaultConfig };
  let isLoaded = false;

  /**
   * Load external stylesheet
   */
  const loadStylesheet = (href) => {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = resolve; // Don't fail on CSS error
      document.head.appendChild(link);
    });
  };

  /**
   * Create widget container
   */
  const createWidgetContainer = () => {
    // Create container div
    const container = document.createElement('div');
    container.id = WIDGET_ID;
    container.style.cssText = `
      position: fixed;
      ${config.position === 'bottom-right' ? 'right: 20px; bottom: 20px;' : 'left: 20px; bottom: 20px;'}
      width: ${config.width}px;
      height: ${config.height}px;
      z-index: ${config.zIndex};
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    if (config.animated) {
      container.style.animation = 'chatbot-slide-up 0.3s ease-out';
    }

    document.body.appendChild(container);
    return container;
  };

  /**
   * Create and inject iframe
   */
  const createIframe = (container) => {
    const iframe = document.createElement('iframe');
    iframe.id = IFRAME_ID;
    iframe.src = `${WIDGET_URL}/chatbot.html`;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
    `;
    iframe.title = 'Nobroker Chatbot Widget';
    
    container.appendChild(iframe);
    
    // Send config to iframe after load
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.postMessage({
          type: 'CHATBOT_CONFIG',
          payload: {
            ...config,
            widgetUrl: WIDGET_URL
          }
        }, '*');
      }, 100);
    };

    return iframe;
  };

  /**
   * Add animation styles
   */
  const addAnimationStyles = () => {
    if (document.getElementById('chatbot-animations')) return;

    const style = document.createElement('style');
    style.id = 'chatbot-animations';
    style.textContent = `
      @keyframes chatbot-slide-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes chatbot-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Initialize the widget
   */
  const init = (userConfig = {}) => {
    if (isLoaded) {
      console.warn('[Chatbot Widget] Already initialized');
      return;
    }

    // Merge user config with defaults
    config = { ...defaultConfig, ...userConfig };

    // Add animations
    addAnimationStyles();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', load);
    } else {
      load();
    }
  };

  /**
   * Load the widget
   */
  const load = () => {
    try {
      const container = createWidgetContainer();
      createIframe(container);
      isLoaded = true;
      console.log('[Chatbot Widget] Loaded successfully');
    } catch (error) {
      console.error('[Chatbot Widget] Failed to load:', error);
    }
  };

  /**
   * Destroy the widget
   */
  const destroy = () => {
    const container = document.getElementById(WIDGET_ID);
    if (container) {
      container.remove();
      isLoaded = false;
      console.log('[Chatbot Widget] Destroyed');
    }
  };

  /**
   * Hide/Show widget
   */
  const setVisible = (visible) => {
    const container = document.getElementById(WIDGET_ID);
    if (container) {
      container.style.display = visible ? 'block' : 'none';
    }
  };

  /**
   * Get widget status
   */
  const getStatus = () => {
    return {
      loaded: isLoaded,
      version: WIDGET_VERSION,
      config: config
    };
  };

  /**
   * Post message to iframe
   */
  const postMessage = (type, payload = {}) => {
    const iframe = document.getElementById(IFRAME_ID);
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type, payload }, '*');
    }
  };

  // Expose public API
  window.ChatbotWidget = {
    init,
    destroy,
    setVisible,
    getStatus,
    postMessage,
    version: WIDGET_VERSION
  };

  console.log(`[Chatbot Widget v${WIDGET_VERSION}] Ready to initialize`);

  // Auto-initialize if data attribute is present
  const script = document.currentScript;
  if (script && script.dataset.autoInit === 'true') {
    init(script.dataset);
  }
})();
