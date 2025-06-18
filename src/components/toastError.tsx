import { toast } from "sonner";

export function ToastError(message: string) {
  toast.error(message, {
    position: "top-center",
    icon: "❌",
  });
}
