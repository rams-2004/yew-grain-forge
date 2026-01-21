import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import heritageImage from "@/assets/heritage-tree.jpg";

const Heritage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });
  
  const stats = [{
    label: "Felled",
    value: "January 2026"
  }, {
    label: "Estimated Age",
    value: "~180 Years"
  }, {
    label: "Origin",
    value: "The Lake District"
  }];

  return (
    <section id="heritage" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div ref={ref} className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="label-uppercase text-primary mb-4 block">
              The Provenance
            </span>
            <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-6">
              A Legacy <span className="text-primary">Preserved</span>
            </h2>
          </motion.div>

          {/* Content with image on right */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Text Content - Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 order-2 lg:order-1"
            >
              <div className="body-refined text-muted-foreground space-y-6 mb-12">
                <p>
                  This exceptional English Yew stood for nearly two centuries in the heart of 
                  <span className="text-primary font-medium"> The Lake District, Cumbria</span>—shaped 
                  by the region's unique growing conditions, its dramatic rainfall, and the mineral-rich 
                  Cumbrian soil that produces timber of unparalleled character.
                </p>
                <p>
                  When the tree reached the end of its natural life in January
                  2026, we were entrusted with its careful salvage from the Lakes—ensuring that
                  its remarkable wood would continue to serve craftspeople for
                  generations to come.
                </p>
                <p>
                  Each slab has been precision-milled at our Lake District workshop and is now 
                  undergoing our signature slow-seasoning process, preserving the deep amber
                  tones and intricate grain patterns that make Cumbrian Yew one of
                  the most coveted timbers in the world.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <span className="label-uppercase text-muted-foreground text-xs block mb-2">
                      {stat.label}
                    </span>
                    <span className="heading-elegant text-lg text-foreground">
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image - Right, smaller */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative order-1 lg:order-2 w-full lg:w-auto flex-shrink-0"
            >
              <div className="w-48 h-64 lg:w-56 lg:h-72 overflow-hidden mx-auto lg:mx-0">
                <img 
                  src={heritageImage} 
                  alt="The original Yew tree from The Lake District before salvage" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 border-2 border-primary opacity-50" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heritage;
