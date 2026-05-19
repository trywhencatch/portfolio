import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCcw, Zap } from "lucide-react";

export function Quote() {
  const [quote, setQuote] = useState(
    '"Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs',
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchQuote = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/quote");
      const data = await res.json();
      if (data.quote) setQuote(data.quote);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="mb-32 flex flex-col items-center text-center max-w-3xl mx-auto px-4">
      <div className="mb-8">
        <Zap size={32} className="text-[#0ea5e9] opacity-40 mx-auto" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={quote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex flex-col items-center"
        >
          <p className="font-serif text-3xl md:text-4xl text-slate-900 mb-8 leading-tight italic">
            {quote.split(" — ")[0]}
          </p>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400 mb-10">
            — {quote.split(" — ")[1] || "Anonymous"}
          </span>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={fetchQuote}
        disabled={isRefreshing}
        className="flex items-center gap-2 border border-slate-200 px-6 py-3 text-[10px] uppercase font-mono tracking-widest text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        <RefreshCcw
          size={14}
          className={isRefreshing ? "animate-spin" : ""}
        />
        Refresh Insight
      </button>
    </section>
  );
}
