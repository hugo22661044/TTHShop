import React, { useState } from "react";
import "./chatbot.css"; // Tạo file css riêng cho chatbot

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setOpen(!open);

  const handleSend = () => {
    if (!input.trim()) return;

    // Thêm tin nhắn người dùng
    const userMessage = { from: "user", text: input };
    setMessages([...messages, userMessage]);

    // Xử lý trả lời chatbot cơ bản
    const botReply = {
      from: "bot",
      text: `Bạn vừa nói: "${input}". Mình là bot demo nhé!`,
    };
    setMessages((prev) => [...prev, userMessage, botReply]);

    setInput("");
  };

  return (
    <div className={`chatbot-container ${open ? "open" : ""}`}>
      <button className="chatbot-toggle" onClick={toggleChat}>
        {open ? "❌" : "💬"}
      </button>

      {open && (
        <div className="chatbot-box">
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chatbot-message ${
                  m.from === "user" ? "user" : "bot"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}
