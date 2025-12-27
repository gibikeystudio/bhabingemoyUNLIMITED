const LoadingState = () => {
  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="loader mb-4"></div>
      <p className="text-accent font-bold text-sm animate-bounce">
        LAGI PROSES... JANGAN DITINGGAL PAS LAGI SAYANG-SAYANGNYA!
      </p>
      <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">
        AI Lagi Menggambar Keakraban Anda...
      </p>
    </div>
  );
};

export default LoadingState;
