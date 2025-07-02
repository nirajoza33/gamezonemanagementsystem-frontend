import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/Payment.css';

const Payment = () => {
    const { gameId } = useParams(); // Assuming you pass gameId in URL
    const [gameDetails, setGameDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const token = sessionStorage.getItem("token");

                const response = await axios.get(`https://localhost:7250/api/Games/${gameId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setGameDetails(response.data);
                console.log("Game Details:", response.data);
            } catch (error) {
                console.error("Error fetching game details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [gameId]);

    const handlePayment = async () => {
        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load.");
            return;
        }

        const token = sessionStorage.getItem("token");
        const user = JSON.parse(sessionStorage.getItem("user")); // assuming user object is stored
        const amountInPaise = gameDetails.price * 100;

        const options = {
            key: "rzp_test_mKFFsoRNrHIPv0", // Replace with your key
            currency: "INR",
            amount: amountInPaise,
            name: "GameZone Booking",
            description: "Payment for game booking",
            image: "/logo.png",
            handler: async function (response) {
                const paymentData = {
                    transactionId: response.razorpay_payment_id,
                    userId: user.userId, // Update based on your session storage structure
                    amount: parseFloat(gameDetails.price),
                    paymentDate: new Date().toISOString(),
                    gameId: parseInt(gameId),
                };

                try {
                    const result = await axios.post(
                        "https://localhost:7186/api/TblPayments",
                        paymentData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    console.log("Payment saved:", result.data);
                    setPaymentSuccess(true);
                } catch (err) {
                    console.error("Payment saving failed:", err);
                    alert("Payment was successful but saving failed.");
                }
            },
            prefill: {
                name: user?.name || "Customer",
                email: user?.email || "customer@example.com",
                contact: user?.phone || "9999999999"
            },
            notes: {
                game_id: gameId
            },
            theme: {
                color: "#3399cc"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className="booking-page">
            <div className="payment-container">
                {loading ? (
                    <p style={{ color: 'white' }}>Loading payment details...</p>
                ) : paymentSuccess ? (
                    <div className="payment-success">
                        <h2>🎉 Payment Successful!</h2>
                        <p>Your booking is confirmed for:</p>
                        <p><strong>{gameDetails.title}</strong></p>
                        <p>Thank you for booking with GameZone!</p>
                    </div>
                ) : (
                    <>
                        <h2 className="payment-title">Game Payment</h2>
                        <div className="payment-card">
                            <p><strong>Game:</strong> {gameDetails.title}</p>
                            <p><strong>Price:</strong> ₹{gameDetails.price}</p>
                        </div>
                        <button className="payment-btn" onClick={handlePayment}>Pay Now</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Payment;
