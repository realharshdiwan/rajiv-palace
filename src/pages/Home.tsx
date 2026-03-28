import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { MapPin, Star, Check, ShieldCheck, ArrowRight, Users, BedDouble, Maximize, Eye, X } from 'lucide-react';

interface Hotel {
  name: string;
  location: string;
  rating: number;
  highlight: string;
}

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  images: string[];
  totalRooms: number;
  size: string;
  view: string;
  bed: string;
  amenities: string[];
}

export function Home() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIn, setCheckIn] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [checkOut, setCheckOut] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetch('/api/hotel')
      .then(res => res.json())
      .then(data => {
        setHotel(data.hotel);
        setRooms(data.rooms);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!hotel) return <div className="min-h-screen bg-beige-100 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-beige-100">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-beige-200 text-terracotta-600 text-xs font-semibold tracking-wider uppercase">
              <Star className="w-3 h-3 fill-current" /> {hotel.rating} Guest Rating
            </div>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight text-ink-900">
              Stay in the heart of <span className="text-terracotta-500 italic">Sahibganj</span>.
            </h1>
            <p className="text-lg text-ink-500 max-w-md leading-relaxed">
              {hotel.highlight}. Enjoy clean, comfortable rooms with a warm, heritage-inspired ambiance near the gentle flow of the Ganga.
            </p>
            
            {/* Booking Widget */}
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-xl shadow-beige-200/50 flex flex-col sm:flex-row gap-4 mt-8 border border-beige-200">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1 px-2">Check-in</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full p-2 bg-transparent border-none focus:ring-0 text-ink-900 font-medium outline-none"
                />
              </div>
              <div className="w-px bg-beige-200 hidden sm:block"></div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1 px-2">Check-out</label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  min={format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd')}
                  className="w-full p-2 bg-transparent border-none focus:ring-0 text-ink-900 font-medium outline-none"
                />
              </div>
              <button type="submit" className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-3 rounded-xl font-medium transition-colors sm:w-auto w-full flex items-center justify-center gap-2">
                Check <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
          
          <div className="relative h-[600px] hidden md:block">
            <div className="absolute inset-0 bg-terracotta-500/10 rounded-t-full transform translate-x-4 translate-y-4"></div>
            <img 
              src="https://res.cloudinary.com/dtwjyjz3r/image/upload/v1774637772/hotel-rajiv-palace-in-s_C4_81hibganj-bc-13365071-3_tqpdjc.jpg" 
              alt="Hotel Exterior" 
              className="absolute inset-0 w-full h-full object-cover rounded-t-full shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-md mx-auto flex items-center justify-center py-12 opacity-50">
        <div className="h-px bg-terracotta-500 flex-1"></div>
        <div className="w-2 h-2 rounded-full bg-terracotta-500 mx-4"></div>
        <div className="h-px bg-terracotta-500 flex-1"></div>
      </div>

      {/* Why Book Direct */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Why Book Directly With Us?</h2>
            <p className="text-ink-500">Skip the middleman and enjoy exclusive benefits.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-beige-100 border border-beige-200 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-terracotta-500 shadow-sm">
                <span className="font-serif font-bold text-xl">₹</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
              <p className="text-sm text-ink-500 mb-3">Save ₹200–₹400 per night compared to MakeMyTrip or Agoda. No hidden fees.</p>
              <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                Save ~₹300/night
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-beige-100 border border-beige-200 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-terracotta-500 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Flexible Cancellation</h3>
              <p className="text-sm text-ink-500">Plans change. Cancel up to 24 hours before check-in for free when booking direct.</p>
            </div>
            <div className="p-6 rounded-2xl bg-beige-100 border border-beige-200 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-terracotta-500 shadow-sm">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Direct Communication</h3>
              <p className="text-sm text-ink-500">Speak directly with our front desk for special requests, early check-ins, or local guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif mb-4">Our Rooms</h2>
              <p className="text-ink-500">Clean, comfortable, and designed for a restful stay.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {rooms.map(room => (
              <div key={room.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-beige-200 flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={room.images[0] || 'https://picsum.photos/seed/room/800/600'} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {room.totalRooms <= 3 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Limited rooms available!
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-semibold">{room.name}</h3>
                  </div>
                  <p className="text-sm text-ink-500 mb-6 flex-1">{room.description}</p>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-ink-800 mb-6 pb-6 border-b border-beige-200">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-terracotta-500"/> {room.maxGuests} Guests</span>
                    <span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5 text-terracotta-500"/> {room.size}</span>
                    <span className="flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-terracotta-500"/> {room.bed}</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-terracotta-500"/> {room.view}</span>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Top Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="bg-beige-100 text-ink-800 text-xs px-2 py-1 rounded-md border border-beige-200">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <button 
                          onClick={() => setSelectedRoom(room)}
                          className="text-xs text-terracotta-600 hover:text-terracotta-700 self-center font-medium underline underline-offset-2"
                        >
                          +{room.amenities.length - 4} more
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-ink-500 line-through block">₹{room.price + 300}</span>
                      <span className="text-2xl font-serif font-semibold text-terracotta-600">₹{room.price}</span>
                      <span className="text-xs text-ink-500 uppercase tracking-wider ml-1">/ night</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedRoom(room)}
                        className="bg-beige-200 hover:bg-beige-300 text-ink-900 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Details
                      </button>
                      <Link 
                        to={`/book/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}`}
                        className="bg-ink-900 hover:bg-terracotta-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-beige-100 hover:bg-beige-200 text-ink-500 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-64 relative">
              <img 
                src={selectedRoom.images[0] || 'https://picsum.photos/seed/room/800/600'} 
                alt={selectedRoom.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="p-8">
              <h2 className="text-3xl font-serif mb-2">{selectedRoom.name}</h2>
              <p className="text-ink-500 mb-8 leading-relaxed">{selectedRoom.description}</p>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 border-b border-beige-200 pb-2">Room Features</h3>
                  <ul className="space-y-3 text-sm text-ink-800">
                    <li className="flex items-center gap-3"><Users className="w-4 h-4 text-terracotta-500"/> Up to {selectedRoom.maxGuests} Guests</li>
                    <li className="flex items-center gap-3"><Maximize className="w-4 h-4 text-terracotta-500"/> {selectedRoom.size}</li>
                    <li className="flex items-center gap-3"><BedDouble className="w-4 h-4 text-terracotta-500"/> {selectedRoom.bed}</li>
                    <li className="flex items-center gap-3"><Eye className="w-4 h-4 text-terracotta-500"/> {selectedRoom.view}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 border-b border-beige-200 pb-2">All Amenities</h3>
                  <ul className="space-y-3 text-sm text-ink-800">
                    {selectedRoom.amenities.map((amenity, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-terracotta-500"/> {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-beige-200">
                <div>
                  <span className="text-xs text-ink-500 line-through block">₹{selectedRoom.price + 300}</span>
                  <span className="text-3xl font-serif font-semibold text-terracotta-600">₹{selectedRoom.price}</span>
                  <span className="text-sm text-ink-500 uppercase tracking-wider ml-1">/ night</span>
                </div>
                <Link 
                  to={`/book/${selectedRoom.id}?checkIn=${checkIn}&checkOut=${checkOut}`}
                  className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-lg shadow-terracotta-500/30"
                >
                  Book This Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-ink-900 text-beige-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif mb-4">Words from our guests</h2>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-6 h-6 ${j < 4 ? 'fill-terracotta-500 text-terracotta-500' : 'fill-terracotta-500/30 text-terracotta-500/30'}`} />
                  ))}
                </div>
                <span className="text-3xl font-serif font-semibold text-terracotta-500">4.6</span>
              </div>
              <p className="text-ink-400 text-sm tracking-wide uppercase font-medium">Based on multiple guest reviews</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "Very clean rooms and the location in Chowk Bazaar is perfect for getting around. The staff was incredibly helpful during our stay.", author: "Amit K.", rating: 5, source: "Google" },
              { text: "Great value for money. It's just a short walk from the railway station, and the heritage touches in the decor give it a nice warm feel.", author: "Priya S.", rating: 4, source: "MakeMyTrip" },
              { text: "Reliable room service and good AC. The banquet hall was also well-maintained. Will definitely stay here again when visiting Sahibganj.", author: "Rahul M.", rating: 5, source: "Google" }
            ].map((review, i) => (
              <div key={i} className="bg-ink-800/50 p-8 rounded-2xl border border-ink-800 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-terracotta-500 text-terracotta-500' : 'fill-transparent text-ink-600'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-ink-400 bg-ink-800 px-2.5 py-1 rounded-md border border-ink-700">via {review.source}</span>
                </div>
                <p className="text-beige-200 mb-6 leading-relaxed flex-1">"{review.text}"</p>
                <p className="font-serif italic text-terracotta-500">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="h-96 bg-beige-200 rounded-2xl overflow-hidden relative border border-beige-300 shadow-lg">
            <iframe 
              src="https://maps.google.com/maps?q=25.24375,87.6295142&hl=en&z=15&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Location"
              className="absolute inset-0"
            ></iframe>
          </div>
          <div>
            <h2 className="text-3xl font-serif mb-6">Perfectly Situated</h2>
            <p className="text-ink-500 mb-6 leading-relaxed">
              Located centrally in the main market of Chowk Bazaar, {hotel.name} offers unparalleled convenience. 
              Whether you are here for business or to visit the historic Ganga river banks, everything is within reach.
            </p>
            <div className="space-y-4 text-sm text-ink-800 mb-8">
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-terracotta-500"></span> 5-10 mins from Sahibganj Railway Station</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-terracotta-500"></span> Centrally located in Chowk Bazaar</p>
              <p className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-terracotta-500"></span> Near the historic Ganga river</p>
            </div>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=25.24375,87.6295142" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ink-900 hover:bg-terracotta-500 text-white px-6 py-3.5 rounded-xl font-medium transition-colors shadow-md"
            >
              <MapPin className="w-4 h-4" /> View on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-beige-200 py-12 text-center text-ink-500 text-sm">
        <p className="font-serif text-2xl text-terracotta-600 mb-4">{hotel.name}</p>
        <p>© {new Date().getFullYear()} {hotel.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}
