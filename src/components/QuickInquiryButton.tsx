import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuickInquiryButtonProps {
  product?: { name: string };
}

const QuickInquiryButton = ({ product }: QuickInquiryButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("wood_inquiries").insert({
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        wood_item: product?.name || "General Inquiry",
        message: formData.message.trim(),
      });

      if (error) throw error;

      toast({
        title: "Inquiry sent!",
        description: "We will contact you within 24 hours.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly at +44 7852 862296.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Quick Inquiry Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-elevated flex items-center justify-center hover:bg-amber-dark transition-all duration-300"
            aria-label="Quick inquiry"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/20"
            />
            <Phone className="w-7 h-7 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background border border-border w-full max-w-md rounded-lg shadow-elevated"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h3 className="heading-elegant text-2xl text-foreground">
                    Get in Touch
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    24-hour response guaranteed
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary rounded-sm transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="label-uppercase text-xs text-foreground mb-2 block">
                    Name *
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
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground text-base disabled:opacity-50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="label-uppercase text-xs text-foreground mb-2 block">
                    Email *
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
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground text-base disabled:opacity-50"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="label-uppercase text-xs text-foreground mb-2 block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    maxLength={20}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground text-base disabled:opacity-50"
                    placeholder="+44..."
                  />
                </div>

                <div>
                  <label className="label-uppercase text-xs text-foreground mb-2 block">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 resize-none text-foreground text-base disabled:opacity-50"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full label-uppercase py-4 bg-charcoal text-cream hover:bg-charcoal/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 font-semibold text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Inquiry"
                  )}
                </button>

                {/* Call Option */}
                <div className="text-center border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Or call us directly:
                  </p>
                  <a
                    href="tel:+447852862296"
                    className="inline-flex items-center gap-2 text-primary hover:text-amber-dark transition-colors font-semibold"
                  >
                    <Phone className="w-4 h-4" />
                    +44 7852 862296
                  </a>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickInquiryButton;
