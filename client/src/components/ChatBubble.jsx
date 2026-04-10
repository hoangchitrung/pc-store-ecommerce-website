import { useState } from "react";
import { sendChatMessage } from "../api/chatApi";

export function ChatBubble() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleOpen = () => setOpen(prev => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage = message.trim();
        setHistory((prev) => [...prev, { role: "user", text: userMessage }]);
        setMessage("");
        setLoading(true);

        try {
            const response = await sendChatMessage(userMessage);
            const assistantText = response?.reply || "Xin lỗi, hệ thống chưa phản hồi.";
            setHistory((prev) => [...prev, { role: "assistant", text: assistantText }]);
        } catch (err) {
            console.error("Chat API error:", err);
            setHistory((prev) => [...prev, { role: "assistant", text: "Có lỗi khi kết nối API chat." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {open && (
                <div
                    className="card shadow-sm"
                    style={{
                        position: 'fixed',
                        bottom: 90,
                        right: 20,
                        width: 320,
                        maxWidth: 'calc(100vw - 40px)',
                        zIndex: 1050,
                    }}
                >
                    <div className="card-header d-flex justify-content-between align-items-center p-2">
                        <strong>AI Chat</strong>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={toggleOpen}>×</button>
                    </div>
                    <div className="card-body p-2" style={{ height: 180, overflowY: 'auto', background: '#f8f9fa' }}>
                        {history.length === 0 ? (
                            <p className="text-muted mb-0">Xin chào! Nhập tin nhắn của bạn ở dưới.</p>
                        ) : (
                            history.map((item, index) => (
                                <div key={`${item.role}-${index}`} className="mb-2">
                                    <span className={item.role === 'user' ? 'fw-semibold' : 'text-primary'}>
                                        {item.role === 'user' ? 'Bạn' : 'AI'}:
                                    </span>{' '}
                                    <span>{item.text}</span>
                                </div>
                            ))
                        )}
                        {loading && <div className="text-warning small mt-1">Đang xử lý ...</div>}
                    </div>
                    <form className="p-2" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            placeholder="Gõ tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary btn-sm w-100" disabled={!message.trim()}>
                            Gửi
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                className="btn btn-primary rounded-circle d-flex justify-content-center align-items-center"
                style={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    width: 56,
                    height: 56,
                    zIndex: 1050,
                }}
                onClick={toggleOpen}
            >
                <i className="fa-solid fa-comments fa-lg"></i>
            </button>
        </>
    );
}
