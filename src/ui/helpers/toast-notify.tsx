import toast from "react-hot-toast";

type NotifyParams = {
  type: "success" | "error";
  message: string;
  description?: string;
  duration?: number;
};

export function notify({
  type,
  message,
  description,
  duration = 5000,
}: NotifyParams) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible
            ? "animate-in fade-in slide-in-from-right-5"
            : "animate-out fade-out slide-out-to-right-5"
        } max-w-md w-full border-l-4 ${
          type === "success" ? "border-(--success)" : "border-(--error)"
        } bg-(--card-background) shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-black/5 overflow-hidden`}
      >
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="shrink-0 pt-0.5">
              {type === "success" ? (
                // <CheckCircle className="h-10 w-10 text-(--success)" />
                <>✔️</>
              ) : (
                // <XCircle className="h-10 w-10 text-(--error)" />
                <>❌</>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-(--foreground) uppercase tracking-wide">
                {type === "success" ? "Sucesso!" : "Ocorreu um erro"}
              </p>
              <p className="mt-1 text-sm opacity-90 text-(--foreground)">
                {message}
              </p>
              {description && (
                <p className="mt-1 text-xs opacity-60 italic text-(--foreground)">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex border-l border-(--foreground)/10">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-(--accent) hover:opacity-70 focus:outline-none"
          >
            {/* <X size={20} /> */}
            <>✖️</>
          </button>
        </div>
      </div>
    ),
    { duration }
  );
}
