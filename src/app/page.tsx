import { BenefitsSection } from "../../components/benefits-section";
import { FeaturedCompanies } from "../../components/FeaturedCompanies";
import FeaturedJobs from "../../components/FeaturedJobs";
import Footer from "../../components/footer-section";
import { HeroSection } from "../../components/hero-section";
import { HowItWorksSection } from "../../components/how-it-works-section";
import Navbar from "../../components/navbar";
import { TestimonialsSection } from "../../components/testimonials-sections";
import "./globals.css";


export default function Home() {
  return (
    <main className="min-h-screen ">
      <Navbar />

     <header>
        <HeroSection />
      </header> 

     <section aria-label="Early access signup">
        <FeaturedCompanies />
      </section>

      <section aria-label="How our process works">
        <HowItWorksSection />
      </section>

      <section aria-label="Benefits and features">
        <BenefitsSection />
      </section>

      <section aria-label="Feature jobs">
        <FeaturedJobs />
      </section>

      <section aria-label="Success stories and testimonials">
        <TestimonialsSection />
      </section>

    <div className="bg-[#1F3C88] ">
           <Footer />
         </div>

    </main>
  );
}