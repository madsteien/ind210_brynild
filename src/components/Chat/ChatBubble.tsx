'use client';

import React from 'react';

type ChatBubbleProps = {
  message: string;
  isUser: boolean;
  timestamp?: Date;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, timestamp }) => {
  // Format timestamp as HH:MM if provided
  const timeString = timestamp 
    ? `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`
    : '';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`relative max-w-[80%] px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-red-600 text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message}</div>
        {timestamp && (
          <div className={`text-xs mt-1 text-right ${isUser ? 'text-red-200' : 'text-gray-500'}`}>
            {timeString}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
