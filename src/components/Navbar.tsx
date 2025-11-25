"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/clients", label: "Clients", icon: "👤" },
    { href: "/pets", label: "Pets", icon: "🐾" },
    { href: "/veterinarians", label: "Vets", icon: "👨‍⚕️" },
    { href: "/examinations", label: "Exams", icon: "📋" },
  ];

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold text-gray-900">Pet Clinic</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
