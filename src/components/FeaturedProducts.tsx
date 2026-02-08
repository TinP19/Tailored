import ProductCard from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const laptops = [
  {
    name: "ProBook Elite 15",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=450&fit=crop",
    price: 1299,
    originalPrice: 1499,
    specs: ["Intel Core i7-13700H", "16GB DDR5 RAM", "512GB NVMe SSD"],
    badge: "Best Seller",
  },
  {
    name: "GameForce RTX Pro",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=450&fit=crop",
    price: 1899,
    specs: ["AMD Ryzen 9 7945HX", "32GB DDR5 RAM", "RTX 4070 8GB"],
    badge: "Gaming",
  },
  {
    name: "UltraSlim Air 14",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=450&fit=crop",
    price: 999,
    originalPrice: 1199,
    specs: ["Intel Core i5-1340P", "16GB RAM", "14\" 2.8K OLED"],
  },
];

const tablets = [
  {
    name: "iPad Pro 12.9\"",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=450&fit=crop",
    price: 1099,
    specs: ["M2 Chip", "128GB Storage", "Liquid Retina XDR"],
    badge: "Pro",
  },
  {
    name: "Galaxy Tab S9 Ultra",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=450&fit=crop",
    price: 1199,
    originalPrice: 1399,
    specs: ["Snapdragon 8 Gen 2", "256GB Storage", "14.6\" AMOLED"],
    badge: "Best Value",
  },
  {
    name: "Surface Pro 9",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=450&fit=crop",
    price: 999,
    specs: ["Intel Core i5", "8GB RAM", "13\" PixelSense"],
  },
];

const tvs = [
  {
    name: "Samsung Neo QLED 65\"",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=450&fit=crop",
    price: 1799,
    originalPrice: 2199,
    specs: ["4K 120Hz", "Neural Quantum Processor", "Dolby Atmos"],
    badge: "Top Rated",
  },
  {
    name: "LG OLED C3 55\"",
    image: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&h=450&fit=crop",
    price: 1299,
    specs: ["4K OLED", "α9 Gen6 AI", "G-Sync & FreeSync"],
    badge: "Gaming",
  },
  {
    name: "Sony Bravia XR 75\"",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&h=450&fit=crop",
    price: 2499,
    specs: ["4K HDR", "Cognitive Processor XR", "Google TV"],
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Devices</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium tech for every need and budget.
          </p>
        </div>

        <Tabs defaultValue="laptops" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="laptops">Laptops</TabsTrigger>
            <TabsTrigger value="tablets">Tablets</TabsTrigger>
            <TabsTrigger value="tvs">TVs</TabsTrigger>
          </TabsList>

          <TabsContent value="laptops">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {laptops.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tablets">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tablets.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tvs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tvs.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedProducts;
