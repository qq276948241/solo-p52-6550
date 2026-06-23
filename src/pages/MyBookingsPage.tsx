import { useState } from "react";
import { CalendarDays, Clock, Phone, PawPrint } from "lucide-react";
import { useBookingStore, type Booking } from "@/store/useBookingStore";
import { getPetTypeLabel, getPetTypeIcon } from "@/data/services";
import ConfirmDialog from "@/components/ConfirmDialog";

function formatStatus(status: Booking["status"]) {
  if (status === "pending") {
    return { label: "待服务", className: "bg-green-50 text-green-600" };
  }
  return { label: "已取消", className: "bg-gray-100 text-text-light" };
}

export default function MyBookingsPage() {
  const { bookings, cancelBooking } = useBookingStore();
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  function handleConfirmCancel() {
    if (cancelTarget) {
      cancelBooking(cancelTarget);
      setCancelTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-white border-b border-muted px-4 py-3.5">
        <h1 className="text-center font-semibold text-text text-lg">我的预约</h1>
      </header>

      <div className="px-4 py-5">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarDays size={36} className="text-text-light" />
            </div>
            <p className="text-text-light text-sm mb-1">暂无预约记录</p>
            <p className="text-text-light text-xs">快去首页预约服务吧～</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = formatStatus(booking.status);
              return (
                <div key={booking.id} className="card-base p-4 overflow-hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getPetTypeIcon(booking.petType)}</span>
                      <div>
                        <div className="font-semibold text-text">
                          {booking.serviceName}
                        </div>
                        <div className="text-[11px] text-text-light font-mono mt-0.5">
                          {booking.id}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 pl-1">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays size={14} className="text-primary shrink-0" />
                      <span className="text-text">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-primary shrink-0" />
                      <span className="text-text">{booking.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PawPrint size={14} className="text-primary shrink-0" />
                      <span className="text-text">
                        {getPetTypeLabel(booking.petType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-primary shrink-0" />
                      <span className="text-text font-mono">{booking.phone}</span>
                    </div>
                  </div>

                  {booking.status === "pending" && (
                    <div className="flex justify-end mt-4 pt-3 border-t border-muted">
                      <button
                        onClick={() => setCancelTarget(booking.id)}
                        className="px-4 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        取消预约
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!cancelTarget}
        title="确认取消预约？"
        message="取消后此预约将失效，如需再次预约请重新下单。"
        confirmText="确认取消"
        cancelText="再想想"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}
