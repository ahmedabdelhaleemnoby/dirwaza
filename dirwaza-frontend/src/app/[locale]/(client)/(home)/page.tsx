import HeroSection from "@/components/home/Hero";
import ServicesSection from "@/components/home/Services";
import FAQSection from "@/components/home/FAQ";
import AboutSection from "@/components/home/About";

export default function Home() {
  return (
    <div className="text-primary-dark">
      {/* Hero Section */}
      <section className="bg-white ">
        <HeroSection />
      </section>

      {/* Services Section */}
      <div className="section-padding ">
        <ServicesSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* About Section */}
        <AboutSection />

     
      </div>
    </div>
  );
}
