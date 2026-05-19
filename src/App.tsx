import { Header } from "./components/Header";
import { Projects } from "./components/Projects";
import { Quote } from "./components/Quote";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen px-6 py-12 pt-[128px] md:px-12 lg:px-24">
      <Header />
      <Projects />
      <Quote />
      <Footer />
    </div>
  );
}
