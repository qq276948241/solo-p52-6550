import { CheckCircle2, X } from "lucide-react";
import type { Booking } from "@/store/useBookingStore";
import { getPetTypeLabel, getPetTypeIcon } from "@/data/services";

interface BookingModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export default function BookingModal({ booking, onClose }: BookingModalProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-light hover:text-text transition-colors"
          aria-label="关闭"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-text">预约成功</h2>
          <p className="text-sm text-text-light mt-1">我们已收到您的预约</p>
        </div>

        <div className="space-y-3 bg-muted/50 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-text-light text-sm">订单编号</span>
            <span className="font-mono text-text text-sm font-medium">
              {booking.id}
            </span>
          </div>
          <div className="h-px bg-muted" />
          <div className="flex justify-between items-center">
            <span className="text-text-light text-sm">服务项目</span>
            <span className="text-text font-medium">{booking.serviceName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-light text-sm">预约日期</span>
            <span className="text-text font-medium">{booking.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-light text-sm">时间段</span>
            <span className="text-text font-medium">{booking.timeSlot}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-light text-sm">宠物类型</span>
            <span className="text-text font-medium">
              {getPetTypeIcon(booking.petType)} {getPetTypeLabel(booking.petType)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-light text-sm">联系电话</span>
            <span className="text-text font-medium">{booking.phone}</span>
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full mt-6">
          我知道了
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
