import Header from '@/components/ui/Header';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Canvas from '@/components/sections/Canvas';
import Features from '@/components/sections/Features';
import Team from '@/components/sections/Team';
import HowItWorks from '@/components/sections/HowItWorks';
import UseCases from '@/components/sections/UseCases';
import Value from '@/components/sections/Value';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import Trust from '@/components/sections/Trust';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Problem />
        <Canvas />
        <Team />
        <Features />
        <HowItWorks />
        <UseCases />
        <Value />
        <Pricing />
        <FAQ />
        <Trust />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
