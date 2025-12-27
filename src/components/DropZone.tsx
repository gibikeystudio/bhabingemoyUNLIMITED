import { useRef } from "react";
import { Camera } from "lucide-react";

interface DropZoneProps {
  imagePreview: string | null;
  onImageSelect: (base64: string) => void;
}

const DropZone = ({ imagePreview, onImageSelect }: DropZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={handleClick}
      className="border-4 border-dashed border-primary/20 rounded-[30px] p-8 text-center bg-secondary/20 cursor-pointer active:scale-95 transition-all hover:bg-secondary"
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {imagePreview ? (
        <div>
          <img
            src={imagePreview}
            alt="Pratinjau"
            className="max-h-60 mx-auto rounded-[20px] shadow-xl mb-4 border-4 border-card"
          />
          <p className="text-[12px] text-primary font-bold bg-card inline-block px-4 py-1 rounded-full shadow-sm">
            Bukan yang ini? Ganti Foto
          </p>
        </div>
      ) : (
        <div>
          <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-accent/20">
            <Camera className="h-8 w-8 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <p className="text-foreground font-bold text-sm">Ketuk buat ambil foto</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">
            Pastikan ganteng/cantik maksimal!
          </p>
        </div>
      )}
    </div>
  );
};

export default DropZone;
