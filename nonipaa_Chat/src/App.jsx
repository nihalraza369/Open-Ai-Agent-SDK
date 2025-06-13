import { useState } from 'react';
import ChatUI from './components/ChatUI'; // Adjust path as needed
import './App.css';

function App() {
  const [chat, setChat] = useState([]);

  const handleSend = async (userMessage) => {
    const newMessages = [...chat, { role: 'user', content: userMessage }];
    setChat(newMessages);

    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();
      const botReply = { role: 'assistant', content: data.reply };
      setChat([...newMessages, botReply]);
    } catch (error) {
      console.error('❌ Backend Error:', error);
    }
  };

  return (
    <div className="App">
      <ChatUI messages={chat} onSend={handleSend} />
    </div>
  );
}

export default App;
