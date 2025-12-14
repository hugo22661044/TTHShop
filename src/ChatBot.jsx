import React, { useState } from "react";
import "./css/chatbot.css";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggle = () => setOpen(!open);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, user: true }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Tôi đang xử lý...", user: false }]);
    }, 500);
  };

  return (
    <div className={`chatbot ${open ? "open" : ""}`}>
      <div className="chatbot-header" onClick={toggle}>
        Chat Bot
      </div>
      {open && (
        <div className="chatbot-body">
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-message ${m.user ? "user" : "bot"}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}
