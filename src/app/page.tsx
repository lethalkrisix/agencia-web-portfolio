import Nav from "@/components/nav";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <section id="servicios" className="min-h-[40svh]" />
        <section id="proceso" className="min-h-[40svh]" />
        <section id="contacto" className="min-h-[40svh]" />
      </main>
    </>
  );
}
