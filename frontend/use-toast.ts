import { toast } from 'sonner';

export function useToast() {
  return {
    toast: (message: string, options?: any) => {
      toast.success(message);
    },
  };
}
