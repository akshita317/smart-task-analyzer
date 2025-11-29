import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  return {
    toast: (options: string | ToastOptions) => {
      if (typeof options === 'string') {
        sonnerToast.success(options);
      } else {
        const message = options.title
          ? `${options.title}${options.description ? ': ' + options.description : ''}`
          : options.description || '';
        
        if (options.variant === 'destructive') {
          sonnerToast.error(message);
        } else {
          sonnerToast.success(message);
        }
      }
    },
  };
}
