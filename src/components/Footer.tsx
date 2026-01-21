const Footer = () => {
  return (
    <footer className="py-12 bg-charcoal border-t border-border/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="heading-elegant text-xl text-cream">
              Yew<span className="text-primary">&</span>Grain
            </span>
            <p className="body-refined text-sm text-cream/50 mt-2">
              Rare English Yew, sustainably salvaged
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <a
              href="#heritage"
              className="label-uppercase text-xs text-cream/60 hover:text-cream transition-colors duration-300"
            >
              The Wood
            </a>
            <a
              href="#inventory"
              className="label-uppercase text-xs text-cream/60 hover:text-cream transition-colors duration-300"
            >
              Inventory
            </a>
            <a
              href="#contact"
              className="label-uppercase text-xs text-cream/60 hover:text-cream transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-cream/10 text-center">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Yew & Grain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;