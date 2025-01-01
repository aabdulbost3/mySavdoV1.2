import { useEffect, useState } from "react";
import "./style.css"

export default function MessageComponent({ message, duration, onClose,color }) {
    const [visible, setVisible] = useState(true);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setClosing(true);
            setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, 700);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 700);
    };

    if (!visible) return null;
    return (
        <div className={`alert ${closing ? 'closing' : ''}`}>
            <span className="alert-text">{message}</span>
            <div className="progress-bar" style={{ animationDuration: `${duration}ms`, backgroundColor: color}}></div>
            <button className="close-btn" onClick={handleClose}>
                ×
            </button>
        </div>
    )
}