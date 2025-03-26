import React, { useState } from 'react';
import { GetCookie } from '../auth/cookies.jsx';
// PayPal Components
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PaypalStyle from './paypal.module.css';

const Paypal = ({ onClose, UserId }) => {
  const [amount, setAmount] = useState(10); // Default amount to $10

  const handleSuccess = async (details) => {
    try {
      const token = GetCookie("data")?.token;
      const response = await fetch('http://localhost:8000/api/accounts/paypal/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transactionId: details.id,
          amount: details.purchase_units[0].amount.value,
          payerId: UserId
        })
      });
      if (!response.ok) {
        throw new Error('Failed to add balance');
      }
      window.dispatchEvent(new Event('userDataUpdate'));
    } catch (error) {
      console.error('Error adding balance:', error);
      alert('There was an error processing your transaction. Please try again.');
    } finally {
      onClose();
    }
  };

  return (
    <div className={PaypalStyle.PaypalPopup}>
      <div className={PaypalStyle.PaypalPopupContent}>
        <span className={PaypalStyle.Close} onClick={onClose}>&times;</span>
        <h2>Top Up Your Wallet</h2>
        <div className={PaypalStyle.AmountButtons}>
          {[10, 25, 50, 100].map(value => (
            <button
              key={value}
              className={PaypalStyle.AmountButton}
              onClick={() => setAmount(value)}
            >
              ${value}
            </button>
          ))}
        </div>
        <PayPalScriptProvider options={{ "client-id": "AYKWmFb-WbpwQ33wj5ox1adj-mThTPiLyYQG6431I6FVaepTksSkjfvmJLgE9iRqCpRu5_06ZwOQzBUS" }}> {/* Client ID from PayPal Developer Portal(Sandbox) */}
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: amount.toString()
                  }
                }]
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(handleSuccess);
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default Paypal;