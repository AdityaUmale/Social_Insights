"use client";  // Mark the component as a client-side component

import { useState } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/runLangflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_value: inputValue }),
      });

      const data = await response.json();

      if (response.ok) {
        const finalOutput = data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text;

        if (finalOutput) {
          setResult(finalOutput);
        } else {
          setResult('No valid output received');
        }
      } else {
        setResult(data.error || 'Error occurred.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);  // Log the error message
        setResult('Failed to fetch response from API.');
      } else {
        setResult('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Social Insights</h1>
      <h2 className="subtitle">Get Your posts insights in one click!</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter input value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
          className="input"
        />
        <button type="submit" disabled={loading} className="button">
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      {result && (
        <div className="result">
          <h2>Result:</h2>
          <pre>{result}</pre>
        </div>
      )}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          max-width: 700px;
          margin: 0 auto;
          background: #f4f7fc;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
          text-align: center;
        }
        .subtitle {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 20px;
          font-weight: 400;
          text-align: center;
        }

        .form {
          display: flex;
          flex-direction: column;
          width: 100%;
          align-items: center;
        }

        .input {
          width: 85%;
          padding: 12px;
          margin: 12px 0;
          font-size: 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s ease;
        }

        .input:focus {
          border-color: #0070f3;
          box-shadow: 0 0 5px rgba(0, 112, 243, 0.6);
        }

        .button {
          padding: 12px 20px;
          font-size: 16px;
          cursor: pointer;
          background: linear-gradient(135deg, #0070f3, #00c6ff);
          color: white;
          border: none;
          border-radius: 8px;
          transition: background 0.3s ease, transform 0.3s ease;
          margin-top: 10px;
        }

        .button:disabled {
          background: #b0b0b0;
          cursor: not-allowed;
        }

        .button:hover:not(:disabled) {
          transform: scale(1.05);
          background: linear-gradient(135deg, #005bb5, #008ae6);
        }

        .result {
          margin-top: 30px;
          padding: 20px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
          word-wrap: break-word;
        }

        h2 {
          font-size: 1.8rem;
          margin-bottom: 10px;
          color: #333;
        }

        pre {
          font-size: 14px;
          color: #333;
          background: #f1f1f1;
          padding: 15px;
          border-radius: 6px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}
