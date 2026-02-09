import type { Intent } from './types';

// Pre-import all product images so Vite can bundle them
import macbookPro from '@/assets/products/macbook-pro.jpg';
import asusRog from '@/assets/products/asus-rog.jpg';
import dellXps from '@/assets/products/dell-xps.jpg';
import lgMonitor from '@/assets/products/lg-monitor.jpg';
import sonyHeadphones from '@/assets/products/sony-headphones.jpg';
import keychronKeyboard from '@/assets/products/keychron-keyboard.jpg';
import ps5Pro from '@/assets/products/ps5-pro.jpg';
import iphone16 from '@/assets/products/iphone-16.jpg';
import philipsHue from '@/assets/products/philips-hue.jpg';
import samsungGalaxy from '@/assets/products/samsung-galaxy.jpg';
import airpodsPro from '@/assets/products/airpods-pro.jpg';
import logitechMouse from '@/assets/products/logitech-mouse.jpg';
import appleWatch from '@/assets/products/apple-watch.jpg';
import nintendoSwitch from '@/assets/products/nintendo-switch.jpg';
import samsungTv from '@/assets/products/samsung-tv.jpg';
import boseSpeaker from '@/assets/products/bose-speaker.jpg';
import goproHero from '@/assets/products/gopro-hero.jpg';
import djiDrone from '@/assets/products/dji-drone.jpg';
import razerMouse from '@/assets/products/razer-mouse.jpg';
import ipadPro from '@/assets/products/ipad-pro.jpg';
import ringDoorbell from '@/assets/products/ring-doorbell.jpg';
import xboxSeriesX from '@/assets/products/xbox-series-x.jpg';
import heroLifestyle from '@/assets/hero-lifestyle.jpg';

export interface AssetEntry {
  id: string;
  src: string;
  name: string;
  category: string;
  price_range: 'budget' | 'mid' | 'premium';
  use_case: string[];
  vibe: string[];
  description: string;
}

export const ASSET_REGISTRY: AssetEntry[] = [
  { id: 'macbook-pro', src: macbookPro, name: 'MacBook Pro M4', category: 'laptop', price_range: 'premium', use_case: ['work', 'creative'], vibe: ['professional', 'premium', 'urgent'], description: 'Premium professional laptop for creative work' },
  { id: 'asus-rog', src: asusRog, name: 'ASUS ROG Strix G16', category: 'laptop', price_range: 'premium', use_case: ['gaming', 'streaming'], vibe: ['playful', 'premium'], description: 'High-performance gaming laptop' },
  { id: 'dell-xps', src: dellXps, name: 'Dell XPS 15', category: 'laptop', price_range: 'premium', use_case: ['work', 'creative'], vibe: ['professional', 'premium'], description: 'Sleek professional ultrabook' },
  { id: 'lg-monitor', src: lgMonitor, name: 'LG UltraGear 4K 27"', category: 'monitor', price_range: 'mid', use_case: ['gaming', 'creative'], vibe: ['playful', 'professional'], description: '4K gaming monitor with high refresh rate' },
  { id: 'sony-headphones', src: sonyHeadphones, name: 'Sony WH-1000XM6', category: 'audio', price_range: 'mid', use_case: ['work', 'casual'], vibe: ['professional', 'value'], description: 'Premium noise-cancelling headphones' },
  { id: 'keychron-keyboard', src: keychronKeyboard, name: 'Keychron Q1 Pro', category: 'accessories', price_range: 'mid', use_case: ['work', 'gaming'], vibe: ['professional', 'playful'], description: 'Mechanical keyboard for enthusiasts' },
  { id: 'ps5-pro', src: ps5Pro, name: 'PS5 Pro Console', category: 'gaming', price_range: 'premium', use_case: ['gaming', 'casual'], vibe: ['playful', 'premium'], description: 'Next-gen gaming console' },
  { id: 'iphone-16', src: iphone16, name: 'iPhone 16 Pro', category: 'phone', price_range: 'premium', use_case: ['casual', 'creative'], vibe: ['premium', 'professional'], description: 'Flagship smartphone with pro cameras' },
  { id: 'philips-hue', src: philipsHue, name: 'Philips Hue Starter Kit', category: 'smart_home', price_range: 'budget', use_case: ['casual'], vibe: ['value', 'playful'], description: 'Smart lighting starter kit' },
  { id: 'samsung-galaxy', src: samsungGalaxy, name: 'Samsung Galaxy S24 Ultra', category: 'phone', price_range: 'premium', use_case: ['work', 'creative'], vibe: ['premium', 'professional'], description: 'Premium Android flagship with S Pen' },
  { id: 'airpods-pro', src: airpodsPro, name: 'AirPods Pro 3', category: 'audio', price_range: 'mid', use_case: ['casual', 'work'], vibe: ['professional', 'value'], description: 'Wireless earbuds with ANC' },
  { id: 'logitech-mouse', src: logitechMouse, name: 'Logitech MX Master 3S', category: 'accessories', price_range: 'budget', use_case: ['work'], vibe: ['professional', 'value'], description: 'Ergonomic productivity mouse' },
  { id: 'apple-watch', src: appleWatch, name: 'Apple Watch Ultra 2', category: 'wearable', price_range: 'premium', use_case: ['casual', 'work'], vibe: ['premium', 'professional'], description: 'Premium smartwatch for adventurers' },
  { id: 'nintendo-switch', src: nintendoSwitch, name: 'Nintendo Switch OLED', category: 'gaming', price_range: 'mid', use_case: ['gaming', 'casual'], vibe: ['playful', 'value'], description: 'Portable gaming console' },
  { id: 'samsung-tv', src: samsungTv, name: 'Samsung 65" OLED TV', category: 'display', price_range: 'premium', use_case: ['casual', 'gaming'], vibe: ['premium', 'playful'], description: 'Large OLED TV for immersive viewing' },
  { id: 'bose-speaker', src: boseSpeaker, name: 'Bose SoundLink Flex', category: 'audio', price_range: 'budget', use_case: ['casual'], vibe: ['value', 'playful'], description: 'Portable Bluetooth speaker' },
  { id: 'gopro-hero', src: goproHero, name: 'GoPro Hero 12 Black', category: 'camera', price_range: 'mid', use_case: ['creative', 'casual'], vibe: ['playful', 'professional'], description: 'Action camera for adventures' },
  { id: 'dji-drone', src: djiDrone, name: 'DJI Mini 4 Pro', category: 'camera', price_range: 'premium', use_case: ['creative'], vibe: ['premium', 'professional'], description: 'Compact drone for aerial photography' },
  { id: 'razer-mouse', src: razerMouse, name: 'Razer DeathAdder V3 Pro', category: 'accessories', price_range: 'budget', use_case: ['gaming'], vibe: ['playful', 'value'], description: 'Lightweight esports gaming mouse' },
  { id: 'ipad-pro', src: ipadPro, name: 'iPad Pro 13" M4', category: 'tablet', price_range: 'premium', use_case: ['creative', 'work'], vibe: ['premium', 'professional'], description: 'Pro tablet for artists and professionals' },
  { id: 'ring-doorbell', src: ringDoorbell, name: 'Ring Video Doorbell Pro 2', category: 'smart_home', price_range: 'mid', use_case: ['casual'], vibe: ['value', 'professional'], description: 'Smart video doorbell' },
  { id: 'xbox-series-x', src: xboxSeriesX, name: 'Xbox Series X', category: 'gaming', price_range: 'mid', use_case: ['gaming', 'casual'], vibe: ['playful', 'value'], description: 'Powerful gaming console' },
  { id: 'hero-lifestyle', src: heroLifestyle, name: 'Gaming Setup', category: 'lifestyle', price_range: 'premium', use_case: ['gaming'], vibe: ['playful', 'premium'], description: 'Complete gaming battlestation with RGB lighting' },
];

/** Map asset IDs to their imported image sources for quick lookup */
export const ASSET_MAP: Record<string, string> = Object.fromEntries(
  ASSET_REGISTRY.map(a => [a.id, a.src])
);

/** Available CTA options for Claude to select from */
export const CTA_OPTIONS: string[] = [
  'Buy Now — Free Next-Day Delivery',
  'Add to Cart — Ships Today',
  'Shop Best Value',
  'See All Deals Under $500',
  'Compare All Models',
  'Read Full Reviews',
  'Shop Gaming Setups',
  'View Buying Guide',
  'Take the Quiz — Find Your Match',
  'Shop Gift Guide',
  'Add Gift Wrapping — Free',
  'Pre-Order Now',
];

/** Default hero image per intent (used when Claude is unavailable) */
export const HERO_IMAGE_DEFAULTS: Record<Intent, string> = {
  BUY_NOW: 'macbook-pro',
  COMPARE: 'asus-rog',
  USE_CASE: 'hero-lifestyle',
  BUDGET: 'nintendo-switch',
  RESEARCH: 'ipad-pro',
  GIFTING: 'sony-headphones',
};

/** Default CTA per intent (used when Claude is unavailable) */
export const CTA_DEFAULTS: Record<Intent, string> = {
  BUY_NOW: 'Buy Now — Free Next-Day Delivery',
  COMPARE: 'Compare All Models',
  USE_CASE: 'Shop Gaming Setups',
  BUDGET: 'Shop Best Value',
  RESEARCH: 'Take the Quiz — Find Your Match',
  GIFTING: 'Shop Gift Guide',
};
