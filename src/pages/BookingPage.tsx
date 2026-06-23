import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Phone,
  CheckCircle,
} from "lucide-react";
import { SERVICES, TIME_SLOTS, PET_TYPES, type PetType } from "@/data/services";
import { useBookingStore, type Booking } from "@/store/useBookingStore";
import BookingModal from "@/components/BookingModal";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getWeekday(date: Date): string {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return "周" + weekdays[date.getDay()];
}

function getNext7Days(): { date: Date; label: string; weekday: string }[] {
  const result = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push({
      date: d,
      label: String(d.getDate()),
      weekday: i === 0 ? "今天" : i === 1 ? "明天" : getWeekday(d),
    });
  }
  return result;
}

export default function BookingPage() {
  const { serviceId = "" } = useParams();
  const navigate = useNavigate();
  const addBooking = useBookingStore((s) => s.addBooking);

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId),
    [serviceId]
  );

  const days = useMemo(() => getNext7Days(), []);

  const [selectedDate, setSelectedDate] = useState<string>(formatDate(days[0].date));
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [petType, setPetType] = useState<PetType | "">("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  const isFormValid =
    selectedDate &&
    selectedTime &&
    petType &&
    /^1[3-9]\d{9}$/.test(phone);

  function handlePhoneChange(v: string) {
    const val = v.replace(/\D/g, "").slice(0, 11);
    setPhone(val);
    if (val && !/^1[3-9]\d{9}$/.test(val)) {
      setPhoneError("请输入正确的手机号");
    } else {
      setPhoneError("");
    }
  }

  function handleSubmit() {
    if (!isFormValid || !service) return;
    const booking = addBooking({
      serviceId: service.id,
      serviceName: service.name,
      date: selectedDate,
      timeSlot: selectedTime,
      petType: petType as PetType,
      phone,
    });
    setSuccessBooking(booking);
  }

  function handleModalClose() {
    setSuccessBooking(null);
    navigate("/my-bookings");
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-light">服务不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-white border-b border-muted px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors"
          aria-label="返回"
        >
          <ChevronLeft size={24} className="text-text" />
        </button>
        <h1 className="flex-1 text-center font-semibold text-text pr-8">
          预约服务
        </h1>
      </header>

      <div className="px-4 py-5">
        <div className="card-base p-4 mb-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-3xl shrink-0">
            {service.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-text">{service.name}</div>
            <div className="text-sm text-text-light mt-0.5">
              {service.description}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-primary text-xl font-bold">¥{service.price}</div>
            <div className="text-xs text-text-light">约{service.duration}分钟</div>
          </div>
        </div>

        <div className="card-base p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-primary" />
            <h3 className="font-semibold text-text">选择日期</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1">
            {days.map((d) => {
              const dateStr = formatDate(d.date);
              const isActive = selectedDate === dateStr;
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-muted/60 text-text hover:bg-muted"
                  }`}
                >
                  <span className={`text-xs ${isActive ? "text-white/80" : "text-text-light"}`}>
                    {d.weekday}
                  </span>
                  <span className="text-lg font-semibold mt-0.5">{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-base p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-primary" />
            <h3 className="font-semibold text-text">选择时间段</h3>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const isActive = selectedTime === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-muted/60 text-text hover:bg-muted"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-base p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-primary" />
            <h3 className="font-semibold text-text">宠物类型</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PET_TYPES.map((pt) => {
              const isActive = petType === pt.value;
              return (
                <button
                  key={pt.value}
                  onClick={() => setPetType(pt.value)}
                  className={`flex flex-col items-center py-3.5 rounded-2xl transition-all duration-200 border-2 ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/60 hover:bg-muted"
                  }`}
                >
                  <span className="text-2xl mb-1">{pt.icon}</span>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-primary" : "text-text"
                    }`}
                  >
                    {pt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-base p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone size={18} className="text-primary" />
            <h3 className="font-semibold text-text">联系电话</h3>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="请输入11位手机号"
            className="w-full px-4 py-3 rounded-xl bg-muted/60 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white transition-all"
          />
          {phoneError && (
            <p className="text-red-500 text-xs mt-2 ml-1">{phoneError}</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-muted px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="max-w-[480px] mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-text-light">合计金额</div>
            <div className="text-primary text-xl font-bold">¥{service.price}</div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="btn-primary px-8"
          >
            提交预约
          </button>
        </div>
      </div>

      <BookingModal booking={successBooking} onClose={handleModalClose} />
    </div>
  );
}
