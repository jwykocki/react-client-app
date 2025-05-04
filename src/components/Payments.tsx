import React, { useState } from 'react';

function Payments() {
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        orderId: 'ORD-' + Math.floor(Math.random() * 10000),
        amount: 299.99,
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            setPaymentStatus(result.message);
        } catch (error) {
            setPaymentStatus('Payment failed: ' + error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <h2>Payments</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Order ID:
                        <input type="text" value={formData.orderId} readOnly />
                    </label>
                </div>
                <div>
                    <label>
                    Amount:
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        step="0.01"
                    />
                    </label>
                </div>
                <div>
                    <label>
                    Card Number:
                    <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234123412341234"
                    />
                    </label>
                </div>
                <div>
                    <label>
                    Card Holder:
                    <input
                        type="text"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleChange}
                        placeholder="VPL-K"
                    />
                    </label>
                </div>
                <div>
                    <label>
                    Expiry Date (MM/YY):
                    <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="12/25"
                    />
                    </label>
                </div>
                <div>
                    <label>
                    CVV:
                    <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                    />
                    </label>
                </div>
                <button type="submit">Process Payment</button>
            </form>
            {paymentStatus && <div>{paymentStatus}</div>}
        </div>
    );
}

export default Payments;