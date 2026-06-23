import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl animate-[slideUp_0.25s_ease-out]">
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
            <AlertTriangle size={32} className="text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-text">{title}</h3>
          <p className="text-sm text-text-light mt-2 text-center">{message}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-outline flex-1 py-2.5">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary flex-1 py-2.5 bg-red-500 hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
