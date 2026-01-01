'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('chat');
  const [customerName, setCustomerName] = useState('Customer');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          channel,
          customer_name: customerName,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setResponse({ error: 'Failed to process request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#667eea',
          fontSize: '2.5rem',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          NextPlay AI Business Automation
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px'
        }}>
          Automate your sales, support, and communication with AI
        </p>

        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Enter customer name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            >
              <option value="chat">Chat</option>
              <option value="email">Email</option>
              <option value="call">Call</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              placeholder="Enter customer message..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? 'Processing...' : 'Process Request'}
          </button>
        </form>

        {response && (
          <div style={{
            padding: '20px',
            background: response.error ? '#fee' : '#f0f7ff',
            border: `2px solid ${response.error ? '#fcc' : '#d0e7ff'}`,
            borderRadius: '12px'
          }}>
            {response.error ? (
              <div>
                <h3 style={{ color: '#c00', marginBottom: '10px' }}>Error</h3>
                <p style={{ color: '#600' }}>{response.error}</p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    color: '#667eea',
                    marginBottom: '8px',
                    fontSize: '1.2rem'
                  }}>
                    Intent Detected
                  </h3>
                  <p style={{
                    padding: '10px',
                    background: 'white',
                    borderRadius: '6px',
                    color: '#333'
                  }}>
                    {response.intent}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    color: '#667eea',
                    marginBottom: '8px',
                    fontSize: '1.2rem'
                  }}>
                    AI Response
                  </h3>
                  <p style={{
                    padding: '15px',
                    background: 'white',
                    borderRadius: '6px',
                    whiteSpace: 'pre-wrap',
                    color: '#333',
                    lineHeight: '1.6'
                  }}>
                    {response.reply}
                  </p>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  <strong>Timestamp:</strong> {new Date(response.time).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f9f9f9',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <h4 style={{ marginBottom: '10px', color: '#333' }}>Test Examples:</h4>
          <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Buy:</strong> "I want to purchase your product"</li>
            <li><strong>Support:</strong> "I need help with my account"</li>
            <li><strong>Payment:</strong> "How do I pay for this?"</li>
            <li><strong>Call:</strong> "I'd like to schedule a call"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
