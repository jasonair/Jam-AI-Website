import Hero from '@/components/sections/Hero';
import Value from '@/components/sections/Value';
import HowItWorks from '@/components/sections/HowItWorks';
import Team from '@/components/sections/Team';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import Trust from '@/components/sections/Trust';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Value />
      <HowItWorks />
      <Team />
      <Pricing />
      <FAQ />
      <Trust />
      <CTA />
      <Footer />
    </main>
  );
}
