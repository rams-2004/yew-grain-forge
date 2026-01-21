import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const specs = [
  {
    category: "Material Properties",
    items: [
      { label: "Species", value: "Taxus baccata (English Yew)" },
      { label: "Janka Hardness", value: "1,520 lbf" },
      { label: "Density", value: "670 kg/m³" },
    ],
  },
  {
    category: "Current Stock Status",
    items: [
      { label: "Moisture Content", value: "12-15%" },
      { label: "Seasoning Method", value: "Air-dried + Kiln finish" },
      { label: "Available Grades", value: "Prime, Character, Select" },
    ],
  },
  {
    category: "Dimensions Available",
    items: [
      { label: "Slab Lengths", value: "36\" - 84\"" },
      { label: "Slab Widths", value: "12\" - 32\"" },
      { label: "Thickness Options", value: "1.5\", 2\", 2.5\", 3\"" },
    ],
  },
];

const TechnicalSpecs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="label-uppercase text-primary mb-4 block">
            Specifications
          </span>
          <h2 className="heading-display text-4xl md:text-5xl text-foreground">
            Technical Details
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {specs.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
              className="bg-card p-8 border border-border"
            >
              <h3 className="label-uppercase text-primary mb-6">
                {section.category}
              </h3>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-baseline pb-3 border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecs;