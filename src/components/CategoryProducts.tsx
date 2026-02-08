import ProductCard from "./ProductCard";

interface Product {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  specs: string[];
  badge?: string;
}

interface CategoryProductsProps {
  title: string;
  description: string;
  products: Product[];
}

const CategoryProducts = ({ title, description, products }: CategoryProductsProps) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryProducts;
