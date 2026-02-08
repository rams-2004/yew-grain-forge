import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";

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
  onInquire: (product: Product) => void;
}

const ProductCard = ({ product, onInquire }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative bg-card overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Live Edge Badge */}
        {product.liveEdge && (
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4 label-uppercase text-xs bg-primary text-primary-foreground px-3 py-1"
          >
            Live Edge
          </motion.span>
        )}

        {/* Gradient overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 0 : 0.3 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent"
        />

        {/* Hover Overlay */}
        <motion.div
          initial={false}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            backdropFilter: isHovered ? "blur(4px)" : "blur(0px)"
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-charcoal/75 flex flex-col items-center justify-center p-6"
        >
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="heading-elegant text-4xl text-cream mb-2"
          >
            £{product.price.toLocaleString()}
          </motion.span>
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="label-uppercase text-cream/70 text-xs mb-8"
          >
            {product.dimensions}
          </motion.span>
           <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onInquire(product)}
            className="label-uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-amber-dark transition-colors duration-300 flex items-center gap-2 font-bold text-base min-h-[48px]"
          >
            <Mail className="w-5 h-5" />
            Inquire Now
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-2">
          <h3 className="heading-elegant text-xl text-foreground group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <motion.div
            animate={{ rotate: isHovered ? 45 : 0, scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          </motion.div>
        </div>
        <div className="flex items-center justify-between">
          <span className="label-uppercase text-xs text-primary">
            {product.category}
          </span>
          <span className="label-uppercase text-xs text-muted-foreground">
            {product.grade}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
