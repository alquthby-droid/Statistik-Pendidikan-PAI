import React from "react";

/**
 * Official vector emblem for IAI ASA PASCASARJANA
 * (Institut Agama Islam As'adiyah Sengkang - Program Pascasarjana)
 * Faithfully reconstructed from the institutional emblem:
 * - Arched royal blue dome
 * - Golden globe grid with radiant sunbeams
 * - Layered open Kitab / Quran in royal blue & Islamic green
 * - Arabic calligraphy "اقرأ" (Iqra')
 * - Bold serif typography "IAI ASA" and "PASCASARJANA"
 */

export const LOGO_IAI_ASA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 420" width="100%" height="100%">
  <defs>
    <linearGradient id="blueDome" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#0066b2" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="bookBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#075985" />
    </linearGradient>
  </defs>

  <!-- Outer Dome Arch -->
  <path d="M 75 260 A 175 175 0 0 1 425 260 L 405 260 A 155 155 0 0 0 95 260 Z" fill="url(#blueDome)" />

  <!-- Inner Globe Grid (Gold / Amber) -->
  <!-- Outer rim of globe -->
  <path d="M 105 255 A 145 145 0 0 1 395 255" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="none" opacity="0.85" />
  <!-- Longitude curves -->
  <path d="M 140 255 A 130 145 0 0 1 360 255" fill="none" stroke="#fbbf24" stroke-width="1.8" opacity="0.75" />
  <path d="M 180 255 A 100 145 0 0 1 320 255" fill="none" stroke="#fbbf24" stroke-width="1.8" opacity="0.7" />
  <path d="M 220 255 A 60 145 0 0 1 280 255" fill="none" stroke="#fbbf24" stroke-width="1.8" opacity="0.65" />
  <line x1="250" y1="110" x2="250" y2="255" stroke="#fbbf24" stroke-width="2" opacity="0.8" />
  <!-- Latitude curves -->
  <path d="M 130 160 Q 250 135 370 160" fill="none" stroke="#fbbf24" stroke-width="1.6" opacity="0.7" />
  <path d="M 112 210 Q 250 180 388 210" fill="none" stroke="#fbbf24" stroke-width="1.6" opacity="0.65" />

  <!-- Radiant Sun in the Center (Gold) -->
  <path d="M 210 135 A 40 40 0 0 1 290 135" fill="none" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round" />
  <!-- Sun Rays -->
  <line x1="250" y1="78" x2="250" y2="108" stroke="#f59e0b" stroke-width="4.5" stroke-linecap="round" />
  <line x1="220" y1="92" x2="232" y2="116" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
  <line x1="280" y1="92" x2="268" y2="116" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
  <line x1="195" y1="115" x2="214" y2="128" stroke="#f59e0b" stroke-width="3.8" stroke-linecap="round" />
  <line x1="305" y1="115" x2="286" y2="128" stroke="#f59e0b" stroke-width="3.8" stroke-linecap="round" />
  <line x1="180" y1="145" x2="204" y2="145" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" />
  <line x1="320" y1="145" x2="296" y2="145" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" />

  <!-- Open Quran / Kitab Layer 1: Green Trim Pages -->
  <!-- Left Green Wing -->
  <path d="M 250 250 Q 190 248 115 268 Q 145 220 185 160 L 250 195 Z" fill="#15803d" />
  <!-- Right Green Wing -->
  <path d="M 250 250 Q 310 248 385 268 Q 355 220 315 160 L 250 195 Z" fill="#15803d" />

  <!-- Open Quran Layer 2: Deep Blue Book Covers/Ribbons -->
  <!-- Left Blue Outer Page -->
  <path d="M 250 242 Q 185 240 100 252 L 140 185 L 205 145 L 250 185 Z" fill="#0066b2" stroke="#ffffff" stroke-width="2.5" />
  <!-- Right Blue Outer Page -->
  <path d="M 250 242 Q 315 240 400 252 L 360 185 L 295 145 L 250 185 Z" fill="#0066b2" stroke="#ffffff" stroke-width="2.5" />

  <!-- Open Quran Layer 3: White Inner Pages with Blue Edges -->
  <!-- Left Page -->
  <path d="M 250 182 L 195 148 L 135 230 Q 195 228 250 234 Z" fill="#ffffff" stroke="#0066b2" stroke-width="3" />
  <!-- Right Page -->
  <path d="M 250 182 L 305 148 L 365 230 Q 305 228 250 234 Z" fill="#ffffff" stroke="#0066b2" stroke-width="3" />

  <!-- Inner Book Page Fold Accent -->
  <path d="M 250 185 L 250 234" stroke="#0066b2" stroke-width="2.5" />

  <!-- Arabic Calligraphy "اقرأ" (Iqra') -->
  <!-- Alif -->
  <path d="M 224 165 L 227 165 L 227 215 L 223 215 Z" fill="#111827" />
  <!-- Hamza above Alif -->
  <path d="M 223 158 Q 227 154 229 157 Q 229 161 224 162 L 228 163" fill="none" stroke="#111827" stroke-width="1.8" stroke-linecap="round" />
  <!-- Qaf and Ra' -->
  <path d="M 242 195 Q 248 185 258 185 Q 266 185 266 195 Q 266 205 254 205 L 244 205 L 240 216 Q 237 222 230 223" fill="none" stroke="#111827" stroke-width="3.2" stroke-linecap="round" />
  <!-- Dots for Qaf -->
  <circle cx="252" cy="178" r="2.2" fill="#111827" />
  <circle cx="260" cy="178" r="2.2" fill="#111827" />
  <!-- Closing Alif with Hamza (End of Iqra) -->
  <path d="M 276 166 L 279 166 L 279 214 L 276 214 Z" fill="#111827" />
  <path d="M 275 159 Q 279 155 281 158 Q 281 162 276 163 L 280 164" fill="none" stroke="#111827" stroke-width="1.8" stroke-linecap="round" />

  <!-- Lower Book Swoosh / Base -->
  <path d="M 95 266 Q 250 248 405 266 Q 250 278 95 266 Z" fill="#0066b2" />
  <path d="M 120 274 Q 250 262 380 274 Q 250 284 120 274 Z" fill="#15803d" opacity="0.9" />

  <!-- Typography: IAI ASA -->
  <text x="250" y="340" text-anchor="middle" font-family="'Times New Roman', Times, 'Playfair Display', Georgia, serif" font-size="58" font-weight="900" fill="#0f172a" letter-spacing="3">
    IAI ASA
  </text>

  <!-- Typography: PASCASARJANA -->
  <text x="250" y="380" text-anchor="middle" font-family="'Times New Roman', Times, 'Playfair Display', Georgia, serif" font-size="24" font-weight="800" fill="#0f172a" letter-spacing="6">
    PASCASARJANA
  </text>
</svg>`;

export const LOGO_IAI_ASA_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_IAI_ASA_SVG)}`;

interface LogoIaiAsaProps {
  className?: string;
  size?: number;
  alt?: string;
}

export const LogoIaiAsa: React.FC<LogoIaiAsaProps> = ({
  className = "w-12 h-12",
  size,
  alt = "Logo IAI ASA Pascasarjana",
}) => {
  return (
    <img
      src={LOGO_IAI_ASA_DATA_URI}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain select-none shrink-0 ${className}`}
      referrerPolicy="no-referrer"
    />
  );
};
