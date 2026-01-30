import toast from "react-hot-toast";
import { NotificationToast } from "@/src/web/components";

type NotifyParams = {
  type: "success" | "error";
  message: string;
  description?: string;
  duration?: number;
};

export function useNotify() {
  const notify = ({
    type,
    message,
    description,
    duration = 5000,
  }: NotifyParams) => {
    toast.custom(
      (t) => (
        <NotificationToast
          visible={t.visible}
          type={type}
          message={message}
          description={description}
          onClose={() => toast.dismiss(t.id)}
        />
      ),
      { duration },
    );
  };

  return { notify };
}
