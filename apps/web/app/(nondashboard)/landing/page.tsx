import { Hero } from "@/app/(nondashboard)/landing/components/hero";
import { FeatureCards } from "@/app/(nondashboard)/landing/components/feature-cards";
import { Screenshots } from "@/app/(nondashboard)/landing/components/screenshots";
import { CTA } from "@/app/(nondashboard)/landing/components/cta";

export default function Landing() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <Screenshots />
      <CTA />
    </>
  );
}
