import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Hero } from "@/components/Hero/Hero";
import { Principles } from "@/components/Principles/Principles";
import { WorkRows } from "@/components/WorkRows/WorkRows";

export default function Home() {
  return (
    <>
      <Hero />
      <WorkRows />
      <Principles />
      <About />
      <Contact />
    </>
  );
}
