import { FeaturedCompanies } from "../../components/FeaturedCompanies";
import FeaturedJobs from "../../components/FeaturedJobs";
import Footer from "../../components/footer-section";
import { HeroSection } from "../../components/hero-section";
import { HowItWorksSection } from "../../components/how-it-works-section";
import Navbar from "../../components/navbar";
import { TestimonialsSection } from "../../components/testimonials-sections";
import { InternationalNursesSection } from "../../components/international-nurses-section";
import { WhyVfindSection } from "../../components/why-vfind-section";
import { FaqSection } from "../../components/faq-section";
import { FinalCtaSection } from "../../components/final-cta-section";
import "./globals.css";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero - Get Discovered messaging */}
      <header>
        <HeroSection />
      </header>

      {/* Why VFind - 4 benefit cards */}
      <section aria-label="Why nurses choose VFind">
        <WhyVfindSection />
      </section>

      {/* How It Works - 3 step discovery process */}
      <section aria-label="How our process works">
        <HowItWorksSection />
      </section>

      {/* Featured Companies - Social proof */}
      <section aria-label="Featured employers">
        <FeaturedCompanies />
      </section>

      {/* International Nurses - Visa sponsorship callout */}
      <section aria-label="International nurses">
        <InternationalNursesSection />
      </section>

      {/* Testimonials - Hidden for now */}
      {/* <section aria-label="Success stories and testimonials">
        <TestimonialsSection />
      </section> */}

      {/* Featured Jobs - Hidden for now */}
      {/* <section aria-label="Featured jobs">
        <FeaturedJobs />
      </section> */}

      {/* FAQ - Signup objection handling */}
      <section aria-label="Frequently asked questions">
        <FaqSection />
      </section>

      {/* Final CTA - Strong conversion push */}
      <section aria-label="Create your profile">
        <FinalCtaSection />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
