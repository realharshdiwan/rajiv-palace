import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { PaymentSimulation } from './pages/Payment';
import { Confirmation } from './pages/Confirmation';

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-8 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out font-medium text-sm">
        Chat with us
      </span>
    </a>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-beige-100 font-sans text-ink-900 selection:bg-terracotta-500/20">
        <Routes>
          <Route path="/" element={<><Navbar /><Home /><WhatsAppButton /></>} />
          <Route path="/book/:roomId" element={<><Navbar /><Booking /><WhatsAppButton /></>} />
          <Route path="/payment/:bookingId" element={<PaymentSimulation />} />
          <Route path="/confirmation/:bookingId" element={<Confirmation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
