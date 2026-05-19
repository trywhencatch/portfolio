import { ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="flex flex-col items-center justify-center pt-24 border-t border-slate-100">
      <button
        onClick={scrollToTop}
        className="flex flex-col items-center gap-4 group"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">
          Back to top
        </span>
        <div className="w-10 h-10 flex items-center justify-center border border-slate-200 text-[#0ea5e9] group-hover:bg-[#0ea5e9] group-hover:text-white transition-all">
          <ArrowUp size={18} />
        </div>
      </button>
    </footer>
  );
}
