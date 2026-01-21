import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import heritageImage from "@/assets/heritage-tree.jpg";

const Heritage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { label: "Felled", value: "January 2026" },
    { label: "Estimated Age", value: "~180 Years" },
    { label: "Origin", value: "Cotswolds Estate" },
  ];

  return (
    <section id="heritage" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={heritageImage}
                alt="Heritage Yew tree salvage"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border-2 border-primary opacity-50" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="label-uppercase text-primary mb-4 block">
              The Provenance
            </span>
            <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-8">
              A Legacy
              <br />
              <span className="text-primary">Preserved</span>
            </h2>

            <div className="body-refined text-muted-foreground space-y-6 mb-12">
              <p>
                This exceptional English Yew stood for nearly two centuries on a
                private Cotswolds estate, weathering storms and witnessing
                history unfold beneath its ancient boughs.
              </p>
              <p>
                When the tree reached the end of its natural life in January
                2026, we were entrusted with its careful salvage—ensuring that
                its remarkable wood would continue to serve craftspeople for
                generations to come.
              </p>
              <p>
                Each slab has been precision-milled and is now undergoing our
                signature slow-seasoning process, preserving the deep amber
                tones and intricate grain patterns that make English Yew one of
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
        </div>
      </div>
    </section>
  );
};

export default Heritage;