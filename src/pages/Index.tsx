import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Heritage from "@/components/Heritage";
import Inventory from "@/components/Inventory";
import TechnicalSpecs from "@/components/TechnicalSpecs";
import SafetyWarning from "@/components/SafetyWarning";
import Contact from "@/components/Contact";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Heritage />
        <Inventory />
        <TechnicalSpecs />
        <SafetyWarning />
        <Contact />
      </main>
      <Footer />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Index;