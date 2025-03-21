import axiosInstance from '@/lib/axiosInstance';
import { useState } from 'react';

interface Message {
  from: 'user' | 'model';
  message: string;
  timestamp: Date;
}

interface ApiResponse {
  data: string;
}

const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'model',
      message: "Hi there! I'm your AI assistant. How can I help you with your tasks today?",
      timestamp: new Date(),
    },
  ]);

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    // Add user message to the state immediately
    const newUserMessage: Message = {
      from: 'user',
      message: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await axiosInstance.post('http://localhost:3000/api/dot', {
          history: [], // Ensuring latest messages are sent
          query,
        });

      if (!response.status) {
        throw new Error(`Failed to fetch response. Status: ${response.status}`);
      }

      const data: ApiResponse = await response.data
      console.log(data)
      const aiMessage: Message = {
        from: 'model',
        message: data.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      setMessages((prev) => [
        ...prev,
        { from: 'model', message: "Oops! Something went wrong.", timestamp: new Date() },
      ]);
    }
  };

  return { messages, sendMessage };
};

export default useChatbot;
