"use client";
import React, { useState, useRef, useEffect } from "react";
import { FileText, UploadCloud, Send, Paperclip, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  file?: File;
}

const ResumeChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      const newMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: `Uploaded resume: ${file.name}`,
        file: file
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !resumeFile) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate assistant response
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const assistantMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: resumeFile 
          ? "I've reviewed your resume and can help you improve it. What specific areas would you like to focus on?"
          : "I'm ready to help you craft an outstanding resume. Could you tell me about your professional background?"
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Message sending failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-90 bg-yellow-50">
      {/* Header */}
      <div className="bg-yellow-200 p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="text-yellow-600" size={24} />
          <h1 className="text-xl font-bold text-yellow-800">Resume Assistant</h1>
        </div>
        <input 
          type="file" 
          accept=".pdf,.doc,.docx" 
          className="hidden" 
          id="resume-upload"
          onChange={handleFileUpload}
        />
        <label 
          htmlFor="resume-upload" 
          className="cursor-pointer hover:bg-yellow-300 p-2 rounded-full"
        >
          <UploadCloud className="text-yellow-600" size={24} />
        </label>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Initial Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center text-yellow-800 p-6">
            <p className="text-xl">Welcome to Resume Assistant!</p>
            <p className="mt-2">Upload your resume or start a conversation about your career goals.</p>
          </div>
        )}

        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${
              message.type === 'user' 
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-yellow-200 text-yellow-900' 
                  : 'bg-white text-gray-800 border'
              }`}
            >
              {message.content}
              {message.file && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <FileText size={16} className="mr-2" />
                  {message.file.name}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border p-3 rounded-lg flex items-center">
              <Loader2 className="mr-2 animate-spin text-yellow-600" size={16} />
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t flex items-center space-x-2">
        <input 
          type="file" 
          accept=".pdf,.doc,.docx" 
          className="hidden" 
          id="file-upload"
          onChange={handleFileUpload}
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer hover:bg-yellow-100 p-2 rounded-full"
        >
          <Paperclip className="text-yellow-600" size={20} />
        </label>
        <Input 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about your resume or career..."
          className="flex-grow bg-yellow-50 border-yellow-200"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button 
          onClick={handleSendMessage} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
          disabled={!inputMessage.trim() && !resumeFile}
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ResumeChatAssistant;