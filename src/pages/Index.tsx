import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import OptionButton from "@/components/OptionButton";
import DropZone from "@/components/DropZone";
import LoadingState from "@/components/LoadingState";
import ResultSection from "@/components/ResultSection";
import CustomModal from "@/components/CustomModal";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";

const SCENES = [
  { value: "halaman rumah warga asri", label: "Halaman Warga" },
  { value: "teras rumah warga desa", label: "Teras Santai" },
  { value: "ruang tamu warga", label: "Namu di Dalam" },
  { value: "pos kamling desa", label: "Ngopi di Pos" },
  { value: "sawah padi hijau", label: "Cek Sawah" },
  { value: "kantor desa", label: "Apel Balai Desa" },
  { value: "warung kopi sederhana", label: "Warung Kopi" },
  { value: "masjid atau mushola", label: "Tempat Ibadah" },
  { value: "lapangan sepak bola desa", label: "Lapangan Desa" },
  { value: "pasar tradisional ramai", label: "Pasar Rakyat" },
];

const COLORS = [
  { value: "red", label: "Merah" },
  { value: "blue", label: "Biru" },
  { value: "green", label: "Hijau" },
  { value: "white", label: "Putih" },
  { value: "yellow", label: "Kuning" },
  { value: "black", label: "Hitam" },
  { value: "orange", label: "Oranye" },
  { value: "purple", label: "Ungu" },
  { value: "brown", label: "Cokelat" },
  { value: "pink", label: "Pink" },
];

const Index = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState("halaman rumah warga asri");
  const [selectedColor, setSelectedColor] = useState("red");
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleGenerate = async () => {
    if (!imagePreview) {
      showModal("Izin Dan, fotonya belum diupload. Masa mau generate foto kosong? Hehe..");
      return;
    }

    setIsLoading(true);
    setResultImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-bhabin', {
        body: {
          imageBase64: imagePreview,
          scene: selectedScene,
          color: selectedColor
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        showModal("Lapor! Terjadi gangguan: " + error.message);
        return;
      }

      if (data.error) {
        showModal(data.error);
        return;
      }

      if (data.success && data.image) {
        setResultImage(data.image);
        toast.success("Foto berhasil dibuat!");
      } else {
        showModal("Waduh, servernya lagi malu-malu. Coba lagi ya!");
      }
    } catch (err: any) {
      console.error("Error:", err);
      showModal("Lapor! Terjadi gangguan: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setResultImage(null);
    setSelectedScene("halaman rumah warga asri");
    setSelectedColor("red");
  };

  return (
    <div className="min-h-screen font-fredoka" onContextMenu={(e) => e.preventDefault()}>
      <div className="max-w-xl mx-auto py-8 px-5">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 shadow-md">
            Siap Melayani & Mengayomi
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-1 tracking-tight">
            BHABIN <span className="text-accent italic">GEMOY!</span>
          </h1>
          <p className="text-muted-foreground font-medium text-xs">V2.5 - Teman Curhat & Foto Warga</p>
        </header>

        {/* Main Card */}
        <div className="bg-card gemoy-card p-6 md:p-10 border-b-8 border-accent relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary rounded-full opacity-50"></div>

          {/* 1. Upload Section */}
          <div className="mb-8 relative z-10">
            <label className="flex items-center gap-2 text-sm font-bold mb-3 text-primary uppercase">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-[10px]">1</span>
              Cekrek Dulu Foto Komandannya!
            </label>
            <DropZone imagePreview={imagePreview} onImageSelect={setImagePreview} />
          </div>

          {/* 2. Scene Section */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-bold mb-4 text-primary uppercase">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-[10px]">2</span>
              Mau Sambang Kemana Nih?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SCENES.map((scene) => (
                <OptionButton
                  key={scene.value}
                  label={scene.label}
                  value={scene.value}
                  isActive={selectedScene === scene.value}
                  onClick={setSelectedScene}
                />
              ))}
            </div>
          </div>

          {/* 3. Color Section */}
          <div className="mb-10">
            <label className="flex items-center gap-2 text-sm font-bold mb-4 text-primary uppercase">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-[10px]">3</span>
              Warganya Pakai Baju Apa?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {COLORS.map((color) => (
                <OptionButton
                  key={color.value}
                  label={color.label}
                  value={color.value}
                  isActive={selectedColor === color.value}
                  onClick={setSelectedColor}
                  className="p-3 text-[10px]"
                />
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            {!isLoading && (
              <button
                onClick={handleGenerate}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-[25px] shadow-xl uppercase text-base transition-all active:scale-95 tracking-widest mb-2 flex items-center justify-center gap-3"
              >
                <span>SULAP JADI FOTO KEGIATAN!</span>
                <Zap className="w-6 h-6" strokeWidth={2.5} />
              </button>
            )}

            {isLoading && <LoadingState />}
          </div>

          {/* Result Section */}
          {resultImage && <ResultSection resultImage={resultImage} onReset={handleReset} />}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-card px-4 py-1 rounded-full shadow-sm border border-border">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">POWERED BY GIBIKEY STUDIO</p>
          </div>
          <p className="text-[9px] text-muted-foreground font-bold tracking-[0.2em] uppercase">KONTAK WA 08529883350</p>
        </div>
      </div>

      {/* Modal */}
      <CustomModal isOpen={modalOpen} message={modalMessage} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Index;
