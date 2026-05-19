import { motion } from "motion/react";

interface Project {
  id: string;
  title: string;
  tags: string[];
  year: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Neural Architecture",
    tags: ["Next.js", "TypeScript", "WebGL"],
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Interface Protocol",
    tags: ["React", "Node.js", "PostgreSQL"],
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Spatial Systems",
    tags: ["Three.js", "Tailwind", "Framer Motion"],
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1551732998-9573f695fdbb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Decentralized Hub",
    tags: ["Solidity", "Ethers.js", "GraphQL"],
    year: "2022",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  },
];

export function Projects() {
  return (
    <section className="mb-32">
      <div className="border-b border-slate-100 pb-4 mb-12">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">
          Selected Works
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {PROJECTS.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <div className="aspect-[4/3] overflow-hidden bg-slate-100 mb-6 relative">
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-mono text-xl font-bold text-slate-900 mb-2 truncate">
                  {project.title}
                </h3>
                <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 flex gap-4">
                  {project.tags.join(" • ")}
                </div>
              </div>
              <div className="font-mono text-sm text-slate-300">
                {project.year}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
