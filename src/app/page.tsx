import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { StatsBand, MarqueeBand } from "@/components/site/stats";
import { Portfolio } from "@/components/site/portfolio";
import { Services } from "@/components/site/services";
import { About } from "@/components/site/about";
import { Testimonials } from "@/components/site/testimonials";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { Chatbot } from "@/components/site/chatbot";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsBand />
        <MarqueeBand />
        <Portfolio />
        <Services />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
