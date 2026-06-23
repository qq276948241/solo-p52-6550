import { useState, useMemo } from "react";
import { X, Minus, Plus, ShoppingCart, CheckCircle2 } from "lucide-react";
import type { Service } from "@/data/services";
import {
  DRINK_OPTION_GROUPS,
  type SelectedOptions,
  getDefaultOptions,
  getTotalPriceDelta,
} from "@/data/drinkOptions";
import { useBookingStore } from "@/store/useBookingStore";

interface BookingModalProps {
  service: Service | null;
  onClose: () => void;
}

export default function BookingModal({ service, onClose }: BookingModalProps) {
  const addToCart = useBookingStore((s) => s.addToCart);

  const [selected, setSelected] = useState<SelectedOptions>(() =>
    getDefaultOptions()
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const finalPrice = useMemo(() => {
    if (!service) return 0;
    const delta = getTotalPriceDelta(selected);
    return (service.price + delta) * quantity;
  }, [service, selected, quantity]);

  function handleChange(groupKey: string, value: string) {
    setSelected((prev) => ({ ...prev, [groupKey]: value }));
  }

  function handleAddToCart() {
    if (!service) return;
    const basePrice = service.price + getTotalPriceDelta(selected);
    addToCart({
      serviceId: service.id,
      serviceName: service.name,
      serviceIcon: service.icon,
      price: basePrice,
      options: { ...selected },
      quantity,
    });
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 900);
  }

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {addedToast && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]">
          <div className="bg-black/80 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-[toastIn_0.3s_ease-out]">
            <CheckCircle2 size={22} className="text-green-400" />
            <span className="font-medium">已加入购物车</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white rounded-t-[28px] shadow-2xl animate-[slideUp_0.35s_cubic-bezier(0.32,0.72,0,1)]">
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-muted flex items-center justify-center text-text-light hover:text-text transition-colors z-10"
          aria-label="关闭"
        >
          <X size={20} />
        </button>

        <div className="px-5 pb-5 pt-2 max-h-[82vh] overflow-y-auto hide-scrollbar">
          <div className="relative h-44 rounded-2xl overflow-hidden mb-5 -mx-1">
            <img
              src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20coffee%20latte%20art%20in%20ceramic%20cup%20with%20paw%20print%20foam%20art%2C%20warm%20cozy%20lighting%2C%20soft%20bokeh%20background%2C%20aesthetic%20food%20photography&image_size=square_hd"
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl drop-shadow">{service.icon}</span>
                <div>
                  <h2 className="text-white text-xl font-bold drop-shadow">
                    {service.name}
                  </h2>
                  <p className="text-white/80 text-xs">{service.description}</p>
                </div>
              </div>
            </div>
          </div>

          {DRINK_OPTION_GROUPS.map((group) => (
            <div key={group.key} className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text flex items-center gap-1.5">
                  <span className="w-1 h-4 rounded-full bg-primary" />
                  {group.title}
                </h3>
                {group.subtitle && (
                  <span className="text-xs text-text-light">{group.subtitle}</span>
                )}
              </div>

              {group.mode === "grid" ? (
                <div
                  className="grid gap-2.5"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(group.options.length, 3)}, minmax(0, 1fr))`,
                  }}
                >
                  {group.options.map((opt) => {
                    const active = selected[group.key] === opt.value;
                    const delta = opt.priceDelta ?? 0;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleChange(group.key, opt.value)}
                        className={`py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                          active
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-transparent bg-muted/60 text-text hover:bg-muted"
                        }`}
                      >
                        <div>{opt.label}</div>
                        {delta > 0 && (
                          <div
                            className={`text-[11px] mt-0.5 ${
                              active ? "text-primary" : "text-text-light"
                            }`}
                          >
                            +¥{delta}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1 pb-1">
                  {group.options.map((opt) => {
                    const active = selected[group.key] === opt.value;
                    const delta = opt.priceDelta ?? 0;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleChange(group.key, opt.value)}
                        className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "bg-muted/60 text-text hover:bg-muted"
                        }`}
                      >
                        {opt.label}
                        {delta > 0 && (
                          <span
                            className={`ml-1 text-[11px] ${
                              active ? "text-white/90" : "text-text-light"
                            }`}
                          >
                            +¥{delta}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text flex items-center gap-1.5">
                <span className="w-1 h-4 rounded-full bg-primary" />
                数量
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-full bg-muted/70 flex items-center justify-center text-text disabled:opacity-40 hover:bg-muted transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="font-semibold text-text text-lg w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md shadow-primary/30 hover:bg-primary-dark transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-muted px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-text-light">共 {quantity} 杯，合计</div>
              <div className="text-primary text-2xl font-bold">¥{finalPrice}</div>
            </div>
            <button
              onClick={handleAddToCart}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full"
            >
              <ShoppingCart size={18} />
              加入购物车
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -40%); } to { opacity: 1; transform: translate(-50%, -50%); } }
      `}</style>
    </div>
  );
}
