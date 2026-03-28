import { useParams, Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export function Confirmation() {
  const { bookingId } = useParams();
  
  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-xl border border-beige-200 text-center relative overflow-hidden">
        {/* Decorative arch background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-terracotta-500/5 arch-card -translate-y-16"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-terracotta-500/30">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif mb-4">Your stay is confirmed</h1>
          <p className="text-ink-500 mb-8 leading-relaxed">
            We look forward to welcoming you. A confirmation email has been sent with your itinerary details.
          </p>
          
          <div className="bg-beige-100 p-6 rounded-2xl mb-10 border border-beige-200">
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Booking Reference</p>
            <p className="font-mono text-lg text-ink-900 break-all">{bookingId}</p>
          </div>
          
          <Link 
            to="/" 
            className="inline-block border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white font-medium py-3 px-8 rounded-full transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
