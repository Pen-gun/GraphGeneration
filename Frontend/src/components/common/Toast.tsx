import React from 'react';
import { useToastStore } from '../../hooks/useToast.hook.tsx';
import type { Toast } from '../../types/types.ts';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToastStore();

    const icons: Record<Toast['type'], React.ReactElement> = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
    };

    const colors: Record<Toast['type'], string> = {
        success: 'bg-green-500/20 border-green-500/50 text-green-400',
        error: 'bg-red-500/20 border-red-500/50 text-red-400',
        info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
        warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    };

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
            {toasts.map((toast: Toast) => (
                <div
                    key={toast.id}
                    className={`${colors[toast.type]} backdrop-blur-lg border rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-slide-in`}
                >
                    <div className="flex-shrink-0 mt-0.5">
                        {icons[toast.type]}
                    </div>
                    <p className="flex-1 text-white text-sm font-medium">
                        {toast.message}
                    </p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
