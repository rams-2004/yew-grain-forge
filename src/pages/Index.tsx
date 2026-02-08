import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Heritage from "@/components/Heritage";
import Inventory from "@/components/Inventory";
import TechnicalSpecs from "@/components/TechnicalSpecs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import QuickInquiryButton from "@/components/QuickInquiryButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Heritage />
        <Inventory />
        <Contact />
        <TechnicalSpecs />
      </main>
      <Footer />
      <QuickInquiryButton />
    </div>
  );
};

export default Index;
