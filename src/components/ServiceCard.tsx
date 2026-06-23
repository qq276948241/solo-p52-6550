import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/booking/${service.id}`)}
      className="card-base hover:shadow-card-hover cursor-pointer p-5 flex items-center gap-4 active:scale-[0.98]"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-4xl shrink-0">
        {service.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-text">{service.name}</h3>
        <p className="text-sm text-text-light mt-1 line-clamp-1">
          {service.description}
        </p>
        <div className="flex items-center gap-1 mt-2 text-text-light text-sm">
          <Clock size={14} className="text-primary" />
          <span>约 {service.duration} 分钟</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-primary text-2xl font-bold">¥{service.price}</span>
        <div className="text-xs text-text-light mt-0.5">起</div>
      </div>
    </div>
  );
}
