interface CustomModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const CustomModal = ({ isOpen, message, onClose }: CustomModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-foreground/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div 
        className="bg-card p-8 rounded-[40px] shadow-2xl w-full max-w-xs text-center border-b-8 border-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-4">📢</div>
        <p className="text-card-foreground font-bold mb-6 text-sm leading-relaxed">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-xs uppercase shadow-lg active:scale-95 transition-all"
        >
          Siap, Dimengerti!
        </button>
      </div>
    </div>
  );
};

export default CustomModal;
