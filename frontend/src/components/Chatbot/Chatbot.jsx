import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  // Welcome message when chatbot opens
  useEffect(() => {
    const welcomeMessage = {
      role: 'bot',
      content: `Hey, Welcome to CollabConnect chatbot! 👋\n\nI can help you with questions like:\n1. Who is the POC for servicenow_backend repository?\n2. Which team works on the Security Scanner product?\n\nFeel free to ask me anything!`
    };
    setMessages([welcomeMessage]);
  }, []);

  // Function to extract entities using Gemini
  const extractEntities = async (userInput) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
      const prompt = `Extract the following entities from this text if they exist: product name, repository name, and location. Return in JSON format like this: {"product_name": "", "repository_name": "", "location": ""}. Text: "${userInput}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonString = text.replace(/```json\n|\n```/g, '').trim();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error extracting entities:', error);
      return null;
    }
  };

  // Function to fetch data from backend
  const fetchFromBackend = async (entities) => {
    try {
      let url = 'https://collabconnect-y1zi.onrender.com/search';
      const queryParams = new URLSearchParams();
  
      // Add the search term (product_name or repository_name) to the URL
      const searchTerm = entities.product_name || entities.repository_name;
      if (searchTerm) {
        url += `/${searchTerm}`;
      }
  
      // Add location to query params if present
    //   if (entities.location) {
    //     queryParams.append('location', entities.location);
    //   }
  
      // Append query params to URL if any
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      console.log(url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Backend API request failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching from backend:', error);
      return null;
    }
  };

  // Function to format response using Gemini
  const formatResponse = async (userQuestion, backendData) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
      const prompt = `Given this user question: "${userQuestion}" and this data: ${JSON.stringify(backendData)}, 
        provide a natural, helpful response. Ensure to include chat_username, email, title and role as well. If the data doesn't contain relevant information, politely indicate that the information is not available. PS: Don't format the message in bold, Have the user details in bullet points format.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error formatting response:', error);
      return 'I apologize, but I encountered an error processing your request.';
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      // Add user message to chat
      const userMessage = { role: 'user', content: inputMessage };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');

      // Extract entities from user message
      const entities = await extractEntities(inputMessage);
      
      if (!entities) {
        throw new Error('Unable to understand the request. Please try rephrasing your question.');
      }

      // Fetch data from backend
      const backendData = await fetchFromBackend(entities);
      
      if (!backendData) {
        throw new Error('Unable to understand the request. Please try rephrasing your question.');
      }

      // Format response using Gemini
      const formattedResponse = await formatResponse(inputMessage, backendData);

      // Add bot response to chat
      const botMessage = { role: 'bot', content: formattedResponse };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: error.message || 'I apologize, but I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-content">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
        {isLoading && <div className="bot-message loading">Thinking...</div>}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;