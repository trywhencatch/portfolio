import { motion } from "motion/react";
import { HoverModal } from "./HoverModal";
import { GitHubCalendar } from "react-github-calendar";

export function Header() {
  return (
    <header className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-6xl italic font-bold text-[#0ea5e9] md:text-8xl mb-8 tracking-tight"
        >
          Prasan
        </motion.h1>
        <div className="font-mono text-sm uppercase tracking-widest text-slate-500 mb-2">
          Expertise
        </div>
        <div className="font-mono text-base text-slate-900 flex flex-wrap gap-x-6 gap-y-2 mb-8">
          <span>React</span>
          <span>Node.js</span>
          <span>Tailwind CSS</span>
          <span>TypeScript</span>
        </div>
        <p className="font-mono text-lg text-slate-600 max-w-2xl leading-relaxed mb-6">
          I'm a software engineer based out of Gurgaon, India, currently a SDE
          at{" "}
          <HoverModal
            content={
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-900 font-mono uppercase tracking-widest text-xs">Internshala</span>
                <span className="text-slate-500 text-xs mt-1">A leading internship and online training platform in India.</span>
              </div>
            }
          >
            <span className="text-[#0ea5e9] cursor-help underline decoration-dashed underline-offset-4 hover:bg-[#0ea5e9]/10 px-1 rounded transition-colors">
              Internshala
            </span>
          </HoverModal>
          , and experimenting with my skills. I love the craft
          behind making user interfaces look nice, feel great to use and
          making them blazing fast.
        </p>

        <p className="font-mono text-lg text-slate-600 max-w-2xl leading-relaxed">
          Reach out to me at{" "}
          <a
            href="https://twitter.com/prasanmishra"
            target="_blank"
            rel="noreferrer"
            className="text-slate-900 font-bold hover:text-[#0ea5e9] transition-colors"
          >
            Twitter
          </a>{" "}
          and check my work at{" "}
          <HoverModal
            content={
              <div className="p-2">
                <div className="font-bold text-slate-900 font-mono uppercase tracking-widest text-xs mb-4">
                  GitHub Contributions
                </div>
                <GitHubCalendar
                  username="prasan-mishra"
                  colorScheme="light"
                  fontSize={12}
                  blockSize={10}
                  blockMargin={3}
                />
              </div>
            }
          >
            <span className="text-[#0ea5e9] cursor-help underline decoration-dashed underline-offset-4 hover:bg-[#0ea5e9]/10 px-1 rounded transition-colors">
              GitHub
            </span>
          </HoverModal>
          .
        </p>
      </div>
    </header>
  );
}
