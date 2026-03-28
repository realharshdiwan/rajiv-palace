import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

export function PaymentSimulation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setConfirming(true);
    setError('');
    try {
      const res = await fetch(`/api/bookings/${bookingId}/confirm`, { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        navigate(`/confirmation/${bookingId}`);
      } else {
        setError(data.error || 'Failed to confirm booking. It may have expired.');
      }
    } catch (e) {
      setError('Network error while confirming booking.');
    }
    setConfirming(false);
  };

  const handleCancel = async () => {
    try {
      await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
      navigate('/');
    } catch (e) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-beige-200 text-center">
        <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-terracotta-500" />
        </div>
        <h1 className="text-3xl font-serif mb-3">Room Held</h1>
        <p className="text-ink-500 mb-8 leading-relaxed">
          Your sanctuary is reserved for <strong>10 minutes</strong>. 
          Complete your payment simulation to secure your stay.
        </p>
        
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm mb-8 border border-red-100">{error}</div>}

        <div className="space-y-4">
          <button 
            onClick={handleConfirm} 
            disabled={confirming} 
            className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium py-4 rounded-xl transition-colors shadow-lg shadow-terracotta-500/30"
          >
            {confirming ? 'Processing...' : 'Simulate Payment Success'}
          </button>
          <button 
            onClick={handleCancel} 
            disabled={confirming} 
            className="w-full bg-transparent hover:bg-beige-100 text-ink-500 font-medium py-4 rounded-xl transition-colors"
          >
            Release Room
          </button>
        </div>
      </div>
    </div>
  );
}
