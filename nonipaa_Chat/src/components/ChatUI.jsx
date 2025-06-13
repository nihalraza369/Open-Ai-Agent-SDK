import { useState, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [model, setModel] = useState('openai/gpt-3.5-turbo');

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, model }),
      });

      const data = await res.json();
      const aiMsg = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('❌ Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-2 md:p-6">
      {/* Model Selector */}
      <div className="mb-3">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="p-3 border rounded shadow-md text-lg px-50 bg-gray-300"
        >
          <option value="openai/gpt-3.5-turbo">GPT-3.5</option>
          <option value="openai/gpt-4">GPT-4</option>
          <option value="mistralai/mistral-7b-instruct">Mistral</option>
          <option value="anthropic/claude-3-opus">Claude 3</option>
        </select>
      </div>

      {/* Chat Window */}
      <motion.div
        className="w-full max-w-5xl h-full md:h-[85vh] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`p-4 px-3 rounded-2xl shadow-sm max-w-[80%] text-sm md:text-base transition-all
                ${msg.role === 'user' ? 'bg-blue-300 text-left' : ' text-right'}`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="italic text-gray-400 text-lg">AI is typing...</div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4 bg-white">
          <div className="relative flex items-center gap-2">
            <input
              className="w-full py-5 px-5 pr-14 rounded-full border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={sendMessage}
              className="absolute right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow transition-all"
            >
              <FiSend size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Clear Chat */}
      <button
        onClick={() => {
          setMessages([]);
          localStorage.removeItem('chatHistory');
        }}
        className="mt-3 text-xs text-red-500 hover:underline"
      >
        Clear Chat History
      </button>
    </div>
  );
}
