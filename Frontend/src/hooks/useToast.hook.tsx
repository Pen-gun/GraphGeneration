import { create } from 'zustand';
import type { Toast, ToastType } from '../types/types.ts';

interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (message, type, duration = 3000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const toast: Toast = { id, message, type, duration };

        set((state) => ({
            toasts: [...state.toasts, toast]
        }));

        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id)
                }));
            }, duration);
        }
    },
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
    }))
}));

export const useToast = () => {
    const { addToast } = useToastStore();

    return {
        success: (message: string, duration?: number) => addToast(message, 'success', duration),
        error: (message: string, duration?: number) => addToast(message, 'error', duration),
        info: (message: string, duration?: number) => addToast(message, 'info', duration),
        warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
    };
};
