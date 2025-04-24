'use client';

import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

function ChatWidget() {  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '0',
          text: 'Hei! Jeg er Brynild-assistenten. Hvordan kan jeg hjelpe deg med godteri i dag?',
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);  const handleSendMessage = async (messageText: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    try {
      // Send message to API and get response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText
        }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Noe gikk galt');
      }
      
      // Add bot response to the chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to the chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Beklager, jeg kunne ikke behandle forespørselen din. Vennligst prøv igjen senere.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-red-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label={isOpen ? 'Lukk chat' : 'Åpne chat'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden border border-red-100">          <div className="bg-red-600 text-white p-3 flex items-center">
            <div className="flex items-center">
              <span className="bg-white text-red-600 px-2 py-1 rounded-lg mr-2 transform -rotate-2 text-sm font-bold">Brynild</span>
              <h3 className="font-bold">Kundechat</h3>
            </div>
          </div>
          
          <div className="flex flex-col h-80">
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((msg) => (
                <ChatBubble 
                  key={msg.id}
                  message={msg.text}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <ChatInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Make sure to use a named export as well as default export
export { ChatWidget };
export default ChatWidget;
