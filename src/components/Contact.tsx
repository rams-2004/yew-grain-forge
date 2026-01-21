import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry submitted",
      description: "We'll be in touch within 24 hours.",
    });
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  return (
    <section id="contact" className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6" ref={ref}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="label-uppercase text-primary mb-4 block">
              Get in Touch
            </span>
            <h2 className="heading-display text-4xl md:text-5xl text-foreground mb-6">
              Wholesale Inquiries
            </h2>
            <p className="body-refined text-muted-foreground">
              For bulk orders, custom milling, or trade partnerships, please
              complete the form below.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label-uppercase text-xs text-foreground mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground"
                />
              </div>
              <div>
                <label className="label-uppercase text-xs text-foreground mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="label-uppercase text-xs text-foreground mb-2 block">
                Company (Optional)
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground"
              />
            </div>

            <div>
              <label className="label-uppercase text-xs text-foreground mb-2 block">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 resize-none text-foreground"
                placeholder="Tell us about your project or requirements..."
              />
            </div>

            <button
              type="submit"
              className="w-full label-uppercase py-4 bg-charcoal text-cream hover:bg-charcoal/90 transition-colors duration-300"
            >
              Submit Inquiry
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;