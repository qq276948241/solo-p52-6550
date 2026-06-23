import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock } from "lucide-react";
import { SERVICES } from "@/data/services";
import BookingModal from "@/components/BookingModal";

export default function BookingPage() {
  const { serviceId = "" } = useParams();
  const navigate = useNavigate();

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId),
    [serviceId]
  );

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-light">服务不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-white border-b border-muted px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors"
          aria-label="返回"
        >
          <ChevronLeft size={24} className="text-text" />
        </button>
        <h1 className="flex-1 text-center font-semibold text-text pr-8">
          商品详情
        </h1>
      </header>

      <div className="px-4 py-5">
        <div className="relative h-64 rounded-3xl overflow-hidden mb-5">
          <img
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20coffee%20latte%20art%20in%20ceramic%20cup%20with%20paw%20print%20foam%20art%2C%20warm%20cozy%20lighting%2C%20soft%20bokeh%20background%2C%20aesthetic%20food%20photography&image_size=square_hd"
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl drop-shadow">{service.icon}</span>
            </div>
            <h2 className="text-white text-2xl font-bold drop-shadow">
              {service.name}
            </h2>
            <p className="text-white/85 text-sm mt-1">{service.description}</p>
          </div>
        </div>

        <div className="card-base p-5 mb-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-primary text-3xl font-bold">¥{service.price}</div>
              <div className="text-xs text-text-light mt-1">起</div>
            </div>
            <div className="flex items-center gap-1 text-text-light text-sm">
              <Clock size={14} className="text-primary" />
              <span>约 {service.duration} 分钟</span>
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-text-light text-sm">点击下方按钮选择规格并加入购物车</p>
        </div>
      </div>

      <BookingModal service={service} onClose={() => navigate(-1)} />
    </div>
  );
}
