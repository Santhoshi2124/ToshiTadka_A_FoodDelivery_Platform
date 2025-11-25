import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi there! I\'m Toshi, your foodie friend. Ask me anything about food or your orders!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for the API call
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const config = userInfo ? {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      } : {};

      const { data } = await axios.post(
        'http://localhost:5000/api/ai/chat',
        {
          message: input,
          history: history,
        },
        config
      );

      const modelMessage = { role: 'model', text: data.response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage = { role: 'model', text: 'Sorry, I\'m having trouble connecting. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chatbot error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h3>Toshi, your Foodie Friend 🧑‍🍳</h3>
          <button onClick={() => setIsOpen(false)} className="close-btn">&times;</button>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="message model loading"><span></span><span></span><span></span></div>}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="chatbot-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about food, orders..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>Send</button>
        </form>
      </div>
      <button onClick={() => setIsOpen(!isOpen)} className="chatbot-toggle-button">
        👩‍🍳
      </button>
    </div>
  );
}

export default Chatbot;
