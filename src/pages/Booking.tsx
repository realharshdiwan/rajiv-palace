import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { format, addDays, differenceInDays } from 'date-fns';
import { ArrowLeft, ShieldCheck, Clock, Check, Users, BedDouble, Maximize, Eye } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  price: number;
  images: string[];
  maxGuests: number;
  size: string;
  view: string;
  bed: string;
  amenities: string[];
}

export function Booking() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || format(new Date(), 'yyyy-MM-dd'));
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/hotel')
      .then(res => res.json())
      .then(data => {
        const found = data.rooms.find((r: Room) => r.id === Number(roomId));
        if (found) setRoom(found);
      });
  }, [roomId]);

  const checkAvailability = async () => {
    setChecking(true);
    setError('');
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: Number(roomId), checkIn, checkOut })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAvailable(data.available);
        if (!data.available) setError('Room is not available for these dates.');
      } else {
        setError(data.error || 'Failed to check availability');
      }
    } catch (err) {
      setError('Network error');
    }
    setChecking(false);
  };

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setIsAvailable(null);
      return;
    }
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inDate < today) {
      setError('Check-in cannot be in the past.');
      setIsAvailable(false);
      return;
    }
    if (inDate >= outDate) {
      setCheckOut(format(addDays(inDate, 1), 'yyyy-MM-dd'));
      return;
    }
    checkAvailability();
  }, [checkIn, checkOut]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) return;
    
    setBooking(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomId: Number(roomId), 
          checkIn, 
          checkOut, 
          name: guestName, 
          email: guestEmail, 
          phone 
        })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      navigate(`/payment/${data.booking.id}`);
    } catch (err: any) {
      setError(err.message);
    }
    setBooking(false);
  };

  if (!room) return <div className="min-h-screen flex items-center justify-center bg-beige-100">Loading room details...</div>;

  const nights = Math.max(1, differenceInDays(new Date(checkOut), new Date(checkIn)));
  const total = room.price * nights;
  const mmtPrice = total + (300 * nights); // ~₹300 more per night on MMT

  return (
    <div className="min-h-screen bg-beige-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-ink-500 hover:text-terracotta-500 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
        
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-serif mb-2">Complete your reservation</h1>
              <p className="text-ink-500">Almost there. Just a few details needed.</p>
            </div>

            <form onSubmit={handleBook} className="space-y-8">
              {/* Dates */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-beige-200">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-terracotta-500 text-white flex items-center justify-center text-xs font-sans">1</span>
                  Your Stay
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Check-in</label>
                    <input 
                      type="date" 
                      required
                      min={format(new Date(), 'yyyy-MM-dd')}
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      className="w-full p-3 bg-beige-100 border border-beige-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Check-out</label>
                    <input 
                      type="date" 
                      required
                      min={format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd')}
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full p-3 bg-beige-100 border border-beige-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none transition-all"
                    />
                  </div>
                </div>
                {checking && <p className="text-sm text-terracotta-500 mt-4 flex items-center gap-2"><Clock className="w-4 h-4 animate-spin"/> Checking availability...</p>}
                {isAvailable === false && <p className="text-sm text-red-500 mt-4 font-medium">Sorry, this room is not available for the selected dates.</p>}
                {error && <p className="text-sm text-red-500 mt-4 font-medium">{error}</p>}
              </div>

              {/* Guest Details */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-beige-200">
                <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-terracotta-500 text-white flex items-center justify-center text-xs font-sans">2</span>
                  Guest Details
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      className="w-full p-3 bg-beige-100 border border-beige-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none transition-all"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={guestEmail}
                        onChange={e => setGuestEmail(e.target.value)}
                        className="w-full p-3 bg-beige-100 border border-beige-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none transition-all"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Phone</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full p-3 bg-beige-100 border border-beige-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Sticky CTA */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-beige-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50">
                <button 
                  type="submit" 
                  disabled={!isAvailable || booking || checking}
                  className="w-full bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-ink-500 text-white font-medium py-3.5 rounded-xl transition-colors text-lg shadow-lg shadow-terracotta-500/30"
                >
                  {booking ? 'Securing Room...' : `Confirm Booking • ₹${total}`}
                </button>
              </div>

              {/* Desktop CTA */}
              <button 
                type="submit" 
                disabled={!isAvailable || booking || checking}
                className="hidden lg:block w-full bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-ink-500 text-white font-medium py-4 rounded-xl transition-colors text-lg shadow-lg shadow-terracotta-500/30"
              >
                {booking ? 'Securing Room...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-200 sticky top-24">
              <h3 className="font-serif text-xl mb-4">Your Room</h3>
              <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                <img src={room.images[0] || 'https://picsum.photos/seed/room/800/600'} alt={room.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h4 className="font-semibold text-lg mb-1">{room.name}</h4>
              
              <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs text-ink-800 mb-4">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-terracotta-500"/> {room.maxGuests} Guests</span>
                <span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5 text-terracotta-500"/> {room.size}</span>
                <span className="flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-terracotta-500"/> {room.bed}</span>
                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-terracotta-500"/> {room.view}</span>
              </div>

              <p className="text-sm text-ink-500 mb-6 flex items-center gap-2">
                <Check className="w-4 h-4 text-terracotta-500" /> Free cancellation
              </p>

              <div className="space-y-3 text-sm border-t border-beige-200 pt-6 mb-6">
                <div className="flex justify-between text-ink-500">
                  <span>₹{room.price} x {nights} nights</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-ink-500">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-beige-200 pt-4 mb-6">
                <span className="font-medium">Total</span>
                <div className="text-right">
                  <span className="text-xs text-ink-500 line-through block">OTA Price: ₹{mmtPrice}</span>
                  <span className="text-2xl font-serif font-semibold text-terracotta-600">₹{total}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 leading-relaxed">
                  <strong>Direct Booking Perk:</strong> You are saving ₹{mmtPrice - total} by booking directly with us today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
