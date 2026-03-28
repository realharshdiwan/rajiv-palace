import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [hotelName, setHotelName] = useState('Loading...');

  useEffect(() => {
    fetch('/api/hotel')
      .then(res => res.json())
      .then(data => {
        if (data.hotel) {
          setHotelName(data.hotel.name);
        }
      })
      .catch(() => setHotelName('Hotel'));
  }, []);

  return (
    <nav className="bg-beige-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-beige-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-semibold text-terracotta-600 tracking-wide">
          {hotelName}
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-ink-800 tracking-wide uppercase">
          <a href="#rooms" className="hover:text-terracotta-500 transition-colors">Rooms</a>
          <a href="#reviews" className="hover:text-terracotta-500 transition-colors">Reviews</a>
          <a href="#location" className="hover:text-terracotta-500 transition-colors">Location</a>
        </div>
        <a href="#rooms" className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
          Book Now
        </a>
      </div>
    </nav>
  );
}
