import { User, Phone, MapPin, Clock } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 bg-white border-b border-muted px-4 py-3.5">
        <h1 className="text-center font-semibold text-text text-lg">我的</h1>
      </header>

      <div className="px-4 py-5">
        <div className="card-base p-5 mb-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold text-text">宠物主人</div>
            <div className="text-sm text-text-light mt-0.5">爱宠人士</div>
          </div>
        </div>

        <div className="card-base overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-muted">
            <Clock size={18} className="text-primary" />
            <span className="flex-1 text-text">营业时间</span>
            <span className="text-text-light text-sm">09:00 - 21:00</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-muted">
            <Phone size={18} className="text-primary" />
            <span className="flex-1 text-text">联系电话</span>
            <span className="text-text-light text-sm font-mono">400-888-8888</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <MapPin size={18} className="text-primary" />
            <span className="flex-1 text-text">门店地址</span>
            <span className="text-text-light text-sm">萌宠街88号</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-text-light text-xs">
            🐾 用心呵护每一只爱宠
          </p>
          <p className="text-text-light text-xs mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
