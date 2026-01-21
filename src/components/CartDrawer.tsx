import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, total, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/60 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-elevated"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="heading-elegant text-2xl text-foreground">
                  Your Cart
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary transition-colors duration-300"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="body-refined text-muted-foreground">
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4"
                      >
                        <div className="w-20 h-20 bg-muted overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="heading-elegant text-lg text-foreground truncate">
                            {item.name}
                          </h3>
                          <span className="label-uppercase text-xs text-muted-foreground">
                            {item.category}
                          </span>
                          <p className="text-foreground font-medium mt-1">
                            £{item.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-destructive/10 transition-colors duration-300 self-start"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="label-uppercase text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="heading-elegant text-2xl text-foreground">
                      £{total().toLocaleString()}
                    </span>
                  </div>
                  <button className="w-full label-uppercase py-4 bg-primary text-primary-foreground hover:bg-amber-dark transition-colors duration-300">
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full label-uppercase py-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;