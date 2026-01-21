import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with product details
    const subject = encodeURIComponent(`Inquiry: ${product?.name}`);
    const body = encodeURIComponent(
      `Product Details:\n` +
      `- Name: ${product?.name}\n` +
      `- Category: ${product?.category}\n` +
      `- Dimensions: ${product?.dimensions}\n` +
      `- Grade: ${product?.grade}\n` +
      `- Price: £${product?.price?.toLocaleString()}\n\n` +
      `Customer Details:\n` +
      `- Name: ${formData.name}\n` +
      `- Email: ${formData.email}\n` +
      `- Phone: ${formData.phone || 'Not provided'}\n\n` +
      `Message:\n${formData.message}`
    );
    
    window.location.href = `mailto:hello@yewandgrain.co.uk?subject=${subject}&body=${body}`;
    
    toast({
      title: "Email client opened",
      description: "Please send the email to complete your inquiry.",
    });
    
    setFormData({ name: "", email: "", phone: "", message: "" });
    onClose();
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground"
                  />
                </div>
                <div>
                  <label className="label-uppercase text-xs text-foreground mb-2 block">
                    Email *
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
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 text-foreground"
                />
              </div>

              <div>
                <label className="label-uppercase text-xs text-foreground mb-2 block">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors duration-300 resize-none text-foreground"
                  placeholder="Tell us about your project or ask any questions about this piece..."
                />
              </div>

              <button
                type="submit"
                className="w-full label-uppercase py-4 bg-primary text-primary-foreground hover:bg-amber-dark transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Inquiry
              </button>

              <p className="text-xs text-muted-foreground text-center">
                This will open your email client with the inquiry details pre-filled.
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InquiryModal;
