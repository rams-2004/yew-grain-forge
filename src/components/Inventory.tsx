import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProductCard from "./ProductCard";
import slab1 from "@/assets/slab-1.jpg";
import slab2 from "@/assets/slab-2.jpg";
import turningBlanks from "@/assets/turning-blanks.jpg";
import dimensional from "@/assets/dimensional.jpg";

const products = [
  {
    id: "1",
    name: "Heritage Slab A",
    category: "Slabs",
    price: 2850,
    image: slab1,
    dimensions: '48" × 18" × 2.5"',
    grade: "Prime",
    liveEdge: true,
  },
  {
    id: "2",
    name: "Heartwood Slab B",
    category: "Slabs",
    price: 3200,
    image: slab2,
    dimensions: '52" × 22" × 3"',
    grade: "Character",
    liveEdge: true,
  },
  {
    id: "3",
    name: "Bowl Blank Set",
    category: "Turning Blanks",
    price: 185,
    image: turningBlanks,
    dimensions: '8" × 8" × 4"',
    grade: "Prime",
    liveEdge: false,
  },
  {
    id: "4",
    name: "Dimensional Stock",
    category: "Dimensional",
    price: 420,
    image: dimensional,
    dimensions: '36" × 6" × 1.5"',
    grade: "Select",
    liveEdge: false,
  },
  {
    id: "5",
    name: "Bookmatched Pair",
    category: "Slabs",
    price: 4800,
    image: slab1,
    dimensions: '60" × 24" × 2"',
    grade: "Prime",
    liveEdge: true,
  },
  {
    id: "6",
    name: "Spindle Blanks Set",
    category: "Turning Blanks",
    price: 95,
    image: turningBlanks,
    dimensions: '3" × 3" × 12"',
    grade: "Character",
    liveEdge: false,
  },
];

const categories = ["All", "Slabs", "Turning Blanks", "Dimensional"];

const Inventory = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="inventory" className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="label-uppercase text-primary mb-4 block">
            Current Stock
          </span>
          <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-6">
            The Collection
          </h2>
          <p className="body-refined text-muted-foreground max-w-2xl mx-auto">
            Each piece is unique, carefully selected and prepared for the most
            discerning woodworkers and artisans.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`label-uppercase px-6 py-3 transition-all duration-300 ${
                activeCategory === category
                  ? "bg-charcoal text-cream"
                  : "bg-background text-foreground hover:bg-charcoal/10"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Inventory;