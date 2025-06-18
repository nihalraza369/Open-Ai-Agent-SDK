import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setChat([...chat, { role: "user", content: message }]);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: message,
      });
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error from server." },
      ]);
    }

    setMessage("");
  };

  return (
    <div className="App">
      <h1>🤖 Gemini Chatbot</h1>
      <div className="chat-box">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={msg.role === "user" ? "user-msg" : "bot-msg"}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Type something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
