import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Heritage from "@/components/Heritage";
import Inventory from "@/components/Inventory";
import TechnicalSpecs from "@/components/TechnicalSpecs";
import SafetyWarning from "@/components/SafetyWarning";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Heritage />
        <Inventory />
        <TechnicalSpecs />
        <SafetyWarning />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
