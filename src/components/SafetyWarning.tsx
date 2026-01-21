import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const SafetyWarning = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-charcoal">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-6 p-8 bg-charcoal border border-primary/30">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="heading-elegant text-xl text-cream mb-4">
                Important Safety Information
              </h3>
              <div className="body-refined text-cream/70 space-y-4 text-sm">
                <p>
                  <strong className="text-cream">Toxicity Warning:</strong> All
                  parts of the Yew tree (Taxus baccata) are highly toxic to
                  humans and animals, with the exception of the fleshy aril
                  surrounding the seeds. The wood dust can cause respiratory
                  irritation and allergic reactions.
                </p>
                <p>
                  <strong className="text-cream">Protective Equipment:</strong>{" "}
                  Always use appropriate respiratory protection (P2/N95 minimum)
                  and work in a well-ventilated area when cutting, sanding, or
                  machining Yew wood. Eye protection and dust extraction are
                  strongly recommended.
                </p>
                <p>
                  <strong className="text-cream">Not Food Safe:</strong> Yew
                  wood should not be used for items that will come into contact
                  with food unless properly sealed with a food-safe finish.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SafetyWarning;