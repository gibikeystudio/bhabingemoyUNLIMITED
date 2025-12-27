import { cn } from "@/lib/utils";

interface OptionButtonProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: (value: string) => void;
  className?: string;
}

const OptionButton = ({ label, value, isActive, onClick, className }: OptionButtonProps) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "option-btn rounded-2xl py-4 px-2 text-[11px] font-bold uppercase text-center leading-tight",
        isActive && "active",
        className
      )}
    >
      {label}
    </button>
  );
};

export default OptionButton;
