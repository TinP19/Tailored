import { ProductCard } from './ProductCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Product images
import macbookImg from '@/assets/products/macbook-pro.jpg';
import asusRogImg from '@/assets/products/asus-rog.jpg';
import lgMonitorImg from '@/assets/products/lg-monitor.jpg';
import sonyHeadphonesImg from '@/assets/products/sony-headphones.jpg';
import keychronImg from '@/assets/products/keychron-keyboard.jpg';
import ps5Img from '@/assets/products/ps5-pro.jpg';
import iphoneImg from '@/assets/products/iphone-16.jpg';
import philipsHueImg from '@/assets/products/philips-hue.jpg';
import samsungGalaxyImg from '@/assets/products/samsung-galaxy.jpg';
import airpodsImg from '@/assets/products/airpods-pro.jpg';
import dellXpsImg from '@/assets/products/dell-xps.jpg';
import logitechMouseImg from '@/assets/products/logitech-mouse.jpg';
import appleWatchImg from '@/assets/products/apple-watch.jpg';
import nintendoSwitchImg from '@/assets/products/nintendo-switch.jpg';
import samsungTvImg from '@/assets/products/samsung-tv.jpg';
import boseSpeakerImg from '@/assets/products/bose-speaker.jpg';
import goproImg from '@/assets/products/gopro-hero.jpg';
import djiDroneImg from '@/assets/products/dji-drone.jpg';
import razerMouseImg from '@/assets/products/razer-mouse.jpg';
import ipadProImg from '@/assets/products/ipad-pro.jpg';
import ringDoorbellImg from '@/assets/products/ring-doorbell.jpg';
import xboxImg from '@/assets/products/xbox-series-x.jpg';

const products = [
  {
    name: 'MacBook Pro M4 16"',
    description: 'The most powerful MacBook Pro ever. Blazing-fast performance with the M4 chip.',
    price: 2499,
    rating: 4.9,
    image: macbookImg,
  },
  {
    name: 'ASUS ROG Strix G16',
    description: 'Dominate the game with Intel Core i9 and RTX 4070 graphics.',
    price: 1399,
    rating: 4.7,
    image: asusRogImg,
  },
  {
    name: 'LG UltraGear 4K 27"',
    description: 'Stunning 4K clarity with 144Hz refresh rate for immersive gaming.',
    price: 449,
    rating: 4.8,
    image: lgMonitorImg,
  },
  {
    name: 'Sony WH-1000XM6',
    description: 'Industry-leading noise cancellation meets exceptional sound quality.',
    price: 349,
    rating: 4.9,
    image: sonyHeadphonesImg,
  },
  {
    name: 'Keychron Q1 Pro',
    description: 'Premium wireless mechanical keyboard with hot-swappable switches.',
    price: 199,
    rating: 4.6,
    image: keychronImg,
  },
  {
    name: 'PS5 Pro Console',
    description: 'Next-gen gaming with 8K support and lightning-fast SSD.',
    price: 699,
    rating: 4.8,
    image: ps5Img,
  },
  {
    name: 'iPhone 16 Pro',
    description: 'Titanium design, A18 Pro chip, and the most advanced camera system.',
    price: 1099,
    rating: 4.9,
    image: iphoneImg,
  },
  {
    name: 'Philips Hue Starter Kit',
    description: 'Transform your home with smart, colorful lighting that responds to you.',
    price: 129,
    rating: 4.5,
    image: philipsHueImg,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Ultimate productivity with S Pen and titanium frame. AI-powered camera.',
    price: 1299,
    rating: 4.8,
    image: samsungGalaxyImg,
  },
  {
    name: 'AirPods Pro 3',
    description: 'Adaptive audio with personalized spatial sound and improved ANC.',
    price: 249,
    rating: 4.7,
    image: airpodsImg,
  },
  {
    name: 'Dell XPS 15',
    description: 'InfinityEdge display meets powerful Intel Core Ultra for creators.',
    price: 1799,
    rating: 4.6,
    image: dellXpsImg,
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Precision tracking on any surface with whisper-quiet clicks.',
    price: 99,
    rating: 4.8,
    image: logitechMouseImg,
  },
  {
    name: 'Apple Watch Ultra 2',
    description: 'Built for extreme adventures with precision GPS and 36-hour battery.',
    price: 799,
    rating: 4.9,
    image: appleWatchImg,
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Vivid 7-inch OLED screen for gaming anywhere, anytime.',
    price: 349,
    rating: 4.7,
    image: nintendoSwitchImg,
  },
  {
    name: 'Samsung 65" QLED 4K',
    description: 'Quantum HDR delivers a billion shades of brilliant color.',
    price: 1199,
    rating: 4.6,
    image: samsungTvImg,
  },
  {
    name: 'Bose SoundLink Flex',
    description: 'Deep bass and clear audio in a rugged, waterproof portable speaker.',
    price: 149,
    rating: 4.5,
    image: boseSpeakerImg,
  },
  {
    name: 'GoPro Hero 12 Black',
    description: 'Capture life in stunning 5.3K video with HyperSmooth stabilization.',
    price: 399,
    rating: 4.7,
    image: goproImg,
  },
  {
    name: 'DJI Mini 4 Pro',
    description: 'Professional-grade aerial footage in an ultra-lightweight drone.',
    price: 759,
    rating: 4.8,
    image: djiDroneImg,
  },
  {
    name: 'Razer DeathAdder V3',
    description: 'Ultra-lightweight esports mouse with 30K DPI optical sensor.',
    price: 89,
    rating: 4.6,
    image: razerMouseImg,
  },
  {
    name: 'iPad Pro 13" M4',
    description: 'Tandem OLED display meets desktop-class power. Your next computer.',
    price: 1299,
    rating: 4.9,
    image: ipadProImg,
  },
  {
    name: 'Ring Video Doorbell Pro',
    description: 'Advanced motion detection and crystal-clear 1536p HD video.',
    price: 229,
    rating: 4.4,
    image: ringDoorbellImg,
  },
  {
    name: 'Xbox Series X',
    description: '12 teraflops of raw power for true 4K gaming at 120fps.',
    price: 499,
    rating: 4.8,
    image: xboxImg,
  },
];

export function FeaturedProducts() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of the latest and greatest tech
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              {...product}
              delay={index * 50}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
