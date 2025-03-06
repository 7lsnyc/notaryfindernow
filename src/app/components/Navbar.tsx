'use client';

import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo className="w-12 h-12" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#1E90FF]">
              NotaryFinderNow
            </span>
            <span className="tagline">Notaries, Now—Anywhere, Anytime.</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/services" className="text-gray-700 hover:text-[#1E90FF]">
            Services
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-[#1E90FF]">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-[#1E90FF]">
            Contact
          </Link>
          <Link 
            href="/notary-signup" 
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              backgroundColor: '#4285F4',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: 'none',
              fontSize: '1.125rem',
              lineHeight: '1.5',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              minWidth: '160px',
              textAlign: 'center'
            }}
          >
            Notary Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
} 