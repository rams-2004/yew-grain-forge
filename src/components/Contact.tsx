import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const PHONE = "+44 7852 862296";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('wood_inquiries')
        .insert({
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim(),
          wood_item: 'Wholesale Inquiry' + (formData.company ? ` - ${formData.company}` : ''),
          message: formData.message.trim(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Inquiry sent!",
        description: "We will contact you regarding the Lake District Yew shortly.",
      });
      
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <p className="body-refined text-muted-foreground mb-6">
              For bulk orders, custom milling, or trade partnerships, please
              complete the form below.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-sm">
                <span className="label-uppercase text-xs font-semibold">✓ 24-hour Response Guarantee</span>
              </div>
              <a
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-2 text-primary hover:text-amber-dark transition-colors font-semibold"
              >
                📞 {PHONE}
              </a>
            </div>
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
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground disabled:opacity-50"
                />
              </div>
              <div>
                <label className="label-uppercase text-xs text-foreground mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="label-uppercase text-xs text-foreground mb-2 block">
                Company (Optional)
              </label>
              <input
                type="text"
                maxLength={100}
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground disabled:opacity-50"
              />
            </div>

            <div>
              <label className="label-uppercase text-xs text-foreground mb-2 block">
                Message
              </label>
              <textarea
                required
                rows={5}
                maxLength={2000}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 resize-none text-foreground disabled:opacity-50"
                placeholder="Tell us about your project or requirements..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full label-uppercase py-4 bg-charcoal text-cream hover:bg-charcoal/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit Inquiry"
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
