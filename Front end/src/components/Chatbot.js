import { useState, useRef, useEffect } from "react";
import { askChat } from "../api/employeeApi";

const SUGGESTIONS = [
  "Who has the highest salary?",
  "How many employees are active?",
  "Who is on leave?",
  "List Engineering team",
];

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Ask me anything about your employees — salaries, teams, headcount, and more." },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const question = (text || input).trim();
    if (!question || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);
    try {
      const data = await askChat(question);
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Could not reach the server. Is the backend running?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar-icon">AI</div>
          <div>
            <p className="chat-title">HR Assistant</p>
            <p className="chat-subtitle">Powered by Groq · Llama 3.3</p>
          </div>
        </div>
        <button className="chat-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-row ${m.role}`}>
            <div className="chat-bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-row bot">
            <div className="chat-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
      )}

      <div className="chat-footer">
        <input
          className="chat-input"
          placeholder="Ask about employees..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          disabled={loading}
        />
        <button className="chat-send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
          ↑
        </button>
      </div>
    </div>
  );
}