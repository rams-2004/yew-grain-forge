import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  dimensions: string;
  grade: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const InquiryModal = ({ isOpen, onClose, product }: InquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    setIsSubmitting(true);
    
    try {
      // Build wood_item string with product details
      const woodItemDetails = `${product.name} (${product.category}) - ${product.dimensions} - ${product.grade} Grade - £${product.price.toLocaleString()}`;
      
      const { error } = await supabase
        .from('wood_inquiries')
        .insert({
          customer_name: formData.name.trim(),
          customer_email: formData.email.trim(),
          wood_item: woodItemDetails,
          message: formData.message.trim() + (formData.phone ? `\n\nPhone: ${formData.phone}` : ''),
        });
      
      if (error) throw error;
      
      toast({
        title: "Inquiry sent!",
        description: "We will contact you regarding the Lake District Yew shortly.",
      });
      
      setFormData({ name: "", email: "", phone: "", message: "" });
      onClose();
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
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/60 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background z-50 shadow-elevated max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="heading-elegant text-xl text-foreground">
                  Inquire About This Piece
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary transition-colors duration-300"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Product Summary */}
            <div className="p-6 bg-secondary/30 border-b border-border">
              <h3 className="heading-elegant text-lg text-foreground mb-2">
                {product.name}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="label-uppercase text-muted-foreground">
                  {product.category}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{product.dimensions}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary font-medium">
                  £{product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
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
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground disabled:opacity-50"
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
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="label-uppercase text-xs text-foreground mb-2 block">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  maxLength={20}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground disabled:opacity-50"
                />
              </div>

              <div>
                <label className="label-uppercase text-xs text-foreground mb-2 block">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={2000}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 resize-none text-foreground disabled:opacity-50"
                  placeholder="Tell us about your project or ask any questions about this piece..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full label-uppercase py-4 bg-primary text-primary-foreground hover:bg-amber-dark transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Inquiry
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Your inquiry will be sent directly to our team.
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;
