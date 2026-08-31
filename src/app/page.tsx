import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import Stats from "@/components/stats";
import Services from "@/components/services";
import Process from "@/components/process";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <Marquee />
        <Stats />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
