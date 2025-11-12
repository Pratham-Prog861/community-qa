import { Hero } from "../components/Hero";
import { FeatureGrid } from "../components/FeatureGrid";
import { StatsBar } from "../components/StatsBar";
import { HowItWorks } from "../components/HowItWorks";
import { Testimonials } from "../components/Testimonials";
import { CallToAction } from "../components/CallToAction";
import { FeaturedQuestions } from "../components/FeaturedQuestions";
import { CommunityHighlights } from "../components/CommunityHighlights";
import { TrustSection } from "../components/TrustSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <StatsBar />
      <FeatureGrid />
      <FeaturedQuestions />
      <CommunityHighlights />
      <HowItWorks />
      <TrustSection />
      <Testimonials />
      <CallToAction />
    </div>
  );
}

