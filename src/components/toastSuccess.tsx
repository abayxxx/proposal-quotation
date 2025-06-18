import { toast } from "sonner";

export function ToastSuccess(message: string) {
  toast.success(message, {
    position: "top-center",
    icon: "✅",
  });
}
