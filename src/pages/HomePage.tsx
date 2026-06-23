import { useState } from "react";
import { Scissors, PawPrint } from "lucide-react";
import { SERVICES, type Service } from "@/data/services";
import ServiceCard from "@/components/ServiceCard";
import BookingModal from "@/components/BookingModal";

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=warm%20cozy%20pet%20grooming%20shop%20interior%20with%20adorable%20golden%20retriever%20puppy%20getting%20bath%2C%20soft%20orange%20lighting%2C%20professional%20grooming%20tools%2C%20cute%20pet%20accessories%2C%20photorealistic&image_size=landscape_16_9"
          alt="宠物美容店"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <PawPrint size={20} className="text-white" />
            <span className="text-white/90 text-sm">专业宠物美容</span>
          </div>
          <h1 className="text-white text-2xl font-bold leading-tight">
            让爱宠焕然一新
          </h1>
          <p className="text-white/90 text-sm mt-1">
            专业洗护 · 精致造型 · 贴心服务
          </p>
        </div>
      </div>

      <div className="px-4 py-5 -mt-2 relative z-10">
        <div className="card-base p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scissors size={22} className="text-primary" />
            </div>
            <div>
              <div className="font-semibold text-text">今日特惠</div>
              <div className="text-xs text-text-light mt-0.5">
                首次下单立减20元
              </div>
            </div>
          </div>
          <span className="bg-primary text-white text-xs px-3 py-1.5 rounded-full font-medium">
            立即选购
          </span>
        </div>

        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-text">服务项目</h2>
          <span className="text-xs text-text-light">点击卡片选规格</span>
        </div>

        <div className="space-y-4">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => setSelectedService(service)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-text-light text-xs">
            🐾 营业时间：09:00 - 21:00
          </p>
        </div>
      </div>

      <BookingModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
}
