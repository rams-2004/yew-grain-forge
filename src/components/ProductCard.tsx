import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  dimensions: string;
  grade: string;
  liveEdge: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div
      className="group relative bg-card overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Live Edge Badge */}
        {product.liveEdge && (
          <span className="absolute top-4 left-4 label-uppercase text-xs bg-primary text-primary-foreground px-3 py-1">
            Live Edge
          </span>
        )}

        {/* Hover Overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-charcoal/80 flex flex-col items-center justify-center p-6"
        >
          <span className="heading-elegant text-3xl text-cream mb-2">
            £{product.price.toLocaleString()}
          </span>
          <span className="label-uppercase text-cream/70 text-xs mb-6">
            {product.dimensions}
          </span>
          <button
            onClick={handleAddToCart}
            className="label-uppercase px-6 py-3 bg-primary text-primary-foreground hover:bg-amber-dark transition-colors duration-300"
          >
            Add to Cart
          </button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="heading-elegant text-xl text-foreground">
            {product.name}
          </h3>
          <span className="label-uppercase text-xs text-muted-foreground">
            {product.grade}
          </span>
        </div>
        <span className="label-uppercase text-xs text-primary">
          {product.category}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;