import React, { useState, useEffect } from "react";
import "./style.css"

export default function AddPhone({ setAddModal }) {
    const [showModal, setShowModal] = useState(false);
    const [imeiModal, setImeiModal] = useState(false);
    const [imei, setImei] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (showModal) {
            const cards = document.querySelectorAll(".addCard");
            cards.forEach((card) => {
                card.addEventListener("mousemove", handleMouseMove);
                card.addEventListener("mouseleave", handleMouseLeave);
            });

            return () => {
                cards.forEach((card) => {
                    card.removeEventListener("mousemove", handleMouseMove);
                    card.removeEventListener("mouseleave", handleMouseLeave);
                });
            };
        }
    }, [showModal]);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(500px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg)`;
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = "perspective(400px) rotateX(0deg) rotateY(0deg)";
    };

    const modalClose = () => {
        setShowModal(false);
        setAddModal(false);
        setImeiModal(false);
        setImei("")
        setError("")
    }
  
    const handleChange = (e) => {
      const input = e.target.value;
      if (/^\d{0,15}$/.test(input)) {
        setImei(input);
        setError("");
      } else {
        setError("IMEI must be a 15-digit number.");
      }
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
      if (imei.length === 15) {
        alert("IMEI Submitted: " + imei);
      } else {
        setError("Please enter exactly 15 digits for IMEI.");
      }
    };

    return (
        <div className="addPhone">
            <button className="addButton" onClick={() => setShowModal(true)}>
                <i className="fa-solid fa-plus" />
                <span>Add Phone</span>
            </button>

            {showModal && (
                <div className="addPhone-backdrop" onClick={modalClose}>
                    <div className="addModal" onClick={(e) => e.stopPropagation()} style={!imeiModal ? { padding: "20px" } : { padding: 0 }}>
                        <div className={`addCard ${imeiModal ? "imeiCard" : ""}`} onClick={!imeiModal ? () => setImeiModal(true) : null}>
                            {!imeiModal ? <>
                                <i className="fa-solid fa-barcode" />
                                <h2>IMEI Bilan To'ldirish</h2>
                                <p>Birgina IMEI kiritish orqali barchasi avtomatik ravishda to'ldiriladi</p>
                            </> : <form onSubmit={handleSubmit} className="imeiModal">
                                <h2>IMEI</h2>
                                <p>
                                    Siz IMEI ni shunchaki kiriting. Biz u IMEI dan ro'yxatdan o'tgan telefon
                                    ma'lumotlarini sizga qaytaramiz.
                                </p>
                                <span>
                                    <input
                                        type="number"
                                        value={imei}
                                        onChange={handleChange}
                                        placeholder="Enter 15-digit IMEI"
                                        className={error ? "input-error" : ""}
                                    />
                                </span>
                                {error && <p className="error-text">{error}</p>}
                                <button type="submit" disabled={imei.length !== 15}>
                                    Submit
                                </button>
                            </form>}
                        </div>
                        {!imeiModal ? <div className="addCard" onClick={() => { modalClose(); setAddModal(true); }}>
                            <i className="fa-solid fa-keyboard" />
                            <h2> Qo'lda To'ldirish</h2>
                            <p>O'zingiz berilgan qismlarni to'ldirish orqali yangi telefon qo'shing</p>
                        </div> : null}
                    </div>
                </div>
            )}
        </div>
    );
}
