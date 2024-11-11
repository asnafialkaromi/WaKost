import React from "react";
import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import SuggestSection from "../components/SuggestSection";
import FeatureSection from "../components/FeatureSection";
import ContactUsSection from "../components/ContactUsSection";
import Footer from "../components/Footer";
import RecomendationSection from "../components/RecomendationSection";

function LandingPage() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <SuggestSection />
      <FeatureSection />
      <RecomendationSection />
      <ContactUsSection />
      <Footer />
    </>
  );
}

export default LandingPage;
