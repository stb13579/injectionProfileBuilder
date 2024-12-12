import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';


const ChatbotInterface = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userMessage.trim()) return;

    const newChatHistory = [...chatHistory, { 
      type: 'user', 
      content: userMessage 
    }];
    setChatHistory(newChatHistory);

    try {
      const response = await fetch(import.meta.env.VITE_HOST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      setChatHistory(prevHistory => [...prevHistory, { 
        type: 'bot', 
        content: data.reply 
      }]);

      setUserMessage('');
    } catch (error) {
      console.error('Error communicating with backend:', error);
      setChatHistory(prevHistory => [...prevHistory, { 
        type: 'error', 
        content: 'Sorry, there was an error processing your request.' 
      }]);
    }
  };

  // Custom markdown components
  const MarkdownComponents = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gatling Injection Profile Builder</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chat History Display */}
        <div className="mb-4 max-h-96 overflow-y-auto space-y-4">
          {chatHistory.map((message, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-50 text-right' 
                  : message.type === 'error' 
                  ? 'bg-red-50' 
                  : 'bg-green-50'
              }`}
            >
              <ReactMarkdown 
                components={MarkdownComponents}
                className={`prose ${
                  message.type === 'user' 
                    ? 'text-right' 
                    : 'text-left'
                }`}
              >
                {message.content}
              </ReactMarkdown>
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
