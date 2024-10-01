'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Change this import
import axios from 'axios';

export default function OtpVerification() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter(); // This will work in the app directory
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`/api/auth/verify-otp?acctype=${new URLSearchParams(window.location.search).get('acctype')}`, {
        email,
        verifyCode: otp,
      });

      const data = response.data;

      if (response.status === 200) {
        setSuccess(data.message);
        
        setTimeout(() => {
          router.push('/user'); // Use router.push to navigate
        }, 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>OTP Verification</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <label htmlFor="otp">Verification Code</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>

      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4fff1;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
          text-align: center;
          color: #4CAF50;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 5px;
          color: #333;
        }

        input {
          margin-bottom: 15px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          padding: 10px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:disabled {
          background-color: #a5d6a7;
        }

        .error {
          color: red;
          margin-top: 10px;
        }

        .success {
          color: green;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
