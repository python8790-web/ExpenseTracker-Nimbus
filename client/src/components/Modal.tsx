import type { ReactNode } from "react";
import { IconClose } from "./Icons";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-nimbus-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="glass glass-panel relative z-10 w-full max-w-md p-6 sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-mist transition hover:bg-white/10 hover:text-ink"
            aria-label="Close"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
