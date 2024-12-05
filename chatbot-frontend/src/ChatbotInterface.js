import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

const ChatbotInterface = () => {
  // State to manage user input and chat history
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Handle user input submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent empty submissions
    if (!userMessage.trim()) return;

    // Add user message to chat history
    const newChatHistory = [...chatHistory, { 
      type: 'user', 
      content: userMessage 
    }];
    setChatHistory(newChatHistory);

    try {
      const response = await fetch('http://localhost:3001/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      // Add bot response to chat history
      setChatHistory(prevHistory => [...prevHistory, { 
        type: 'bot', 
        content: data.reply 
      }]);

      // Clear input after submission
      setUserMessage('');
    } catch (error) {
      console.error('Error communicating with backend:', error);
      setChatHistory(prevHistory => [...prevHistory, { 
        type: 'error', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    }
  };

  // Render chat messages, handling different content types
  const renderChatContent = (message) => {
    // Check if message or content is undefined
    if (!message || !message.content) {
      return <p>No content available</p>;
    }
  
    // Check if the content looks like code
    if (typeof message.content === 'string' && message.content.includes('```')) {
      return (
        <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
          <code>{message.content.replace(/```/g, '')}</code>
        </pre>
      );
    }
    
    // Check if the content is a base64 encoded image (for graphs)
    if (typeof message.content === 'string' && message.content.startsWith('data:image')) {
      return (
        <img 
          src={message.content} 
          alt="Generated Graph" 
          className="max-w-full h-auto"
        />
      );
    }
    
    // Plain text fallback
    return <p>{message.content}</p>;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gatling Injection Profile Builder</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chat History Display */}
        <div className="mb-4 max-h-96 overflow-y-auto">
          {chatHistory.map((message, index) => (
            <div 
              key={index} 
              className={`mb-2 p-2 rounded-md ${
                message.type === 'user' 
                  ? 'bg-blue-100 text-right' 
                  : message.type === 'error' 
                  ? 'bg-red-100' 
                  : 'bg-green-100'
              }`}
            >
              {renderChatContent(message)}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Enter your message..."
            className="flex-grow p-2 border rounded-md"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatbotInterface;
