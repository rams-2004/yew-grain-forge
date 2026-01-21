import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface HeaderProps {
  onCartOpen: () => void;
}

const Header = ({ onCartOpen }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "The Wood", href: "#heritage" },
    { name: "Inventory", href: "#inventory" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-subtle"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#" className="group">
          <span className="heading-elegant text-2xl tracking-tight text-foreground">
            Yew
            <span className="text-primary">&</span>
            Grain
          </span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="label-uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
        </div>

        <button
          onClick={onCartOpen}
          className="relative p-2 hover:bg-secondary/50 rounded-sm transition-colors duration-300"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-5 h-5 text-foreground" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
              {items.length}
            </span>
          )}
        </button>
      </nav>
    </motion.header>
  );
};

export default Header;