import { Download } from "lucide-react";
import { toast } from "sonner";

interface ResultSectionProps {
  resultImage: string;
  onReset: () => void;
}

const ResultSection = ({ resultImage, onReset }: ResultSectionProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `Bhabin_Gemoy_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Berhasil disimpan! Jangan lupa dishare ke grup WA ya Dan!");
  };

  const handleReset = () => {
    if (confirm("Beneran mau dihapus? Sayang loh hasilnya...")) {
      onReset();
    }
  };

  return (
    <div className="mt-10 border-t-4 border-dashed border-primary/10 pt-8">
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 bg-accent text-accent-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase z-10 shadow-lg rotate-[-5deg]">
          Hasilnya Cakep Dan!
        </div>
        <img
          src={resultImage}
          alt="Hasil AI"
          className="max-w-full h-auto block mx-auto rounded-3xl border-[6px] border-card shadow-2xl"
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={handleDownload}
          className="w-full bg-success hover:bg-success/90 text-success-foreground font-bold py-5 rounded-2xl text-sm uppercase shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <Download className="w-6 h-6" strokeWidth={2.5} />
          Simpan ke Galeri HP
        </button>
        <button
          onClick={handleReset}
          className="w-full bg-muted text-muted-foreground font-bold py-4 rounded-2xl text-[11px] uppercase active:bg-muted/80 transition-all"
        >
          Hapus & Ulang Dari Awal
        </button>
      </div>
    </div>
  );
};

export default ResultSection;
