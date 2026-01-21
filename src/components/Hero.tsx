import { motion } from "framer-motion";
import heroImage from "@/assets/hero-wood.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="English Yew wood grain"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="label-uppercase text-amber-light tracking-[0.25em] mb-6 block"
          >
            Authentic English Yew
          </motion.span>

          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-cream mb-8">
            Rare. Resilient.
            <br />
            <span className="text-primary">Reclaimed.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="body-refined text-lg md:text-xl text-cream/80 max-w-2xl mx-auto mb-12"
          >
            Sustainably salvaged and precision seasoned. Each piece tells a
            story centuries in the making.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#inventory"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground label-uppercase hover:bg-amber-dark transition-colors duration-300"
            >
              Explore Collection
            </a>
            <a
              href="#heritage"
              className="inline-flex items-center justify-center px-8 py-4 border border-cream/30 text-cream label-uppercase hover:bg-cream/10 transition-colors duration-300"
            >
              Our Story
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-cream/40 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-cream/60 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;