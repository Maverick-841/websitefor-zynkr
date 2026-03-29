import { useState } from 'react';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import Benefits from "../components/Benefits";
import Courses from "../components/Courses";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { OnboardingFlow } from "../components/Onboarding/OnboardingFlow";

import { useLocation, useNavigate } from 'react-router-dom';

export const Home = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isEdit = searchParams.get('edit') === 'true';

  if (showOnboarding || isEdit) {
    return (
      <OnboardingFlow 
        isEditMode={isEdit}
        onComplete={(data) => {
          if (data) {
            localStorage.setItem("userProfile", JSON.stringify(data));
            window.dispatchEvent(new Event('profileUpdated'));
          }
          setShowOnboarding(false);
          if (isEdit) navigate('/profile'); // Redirect directly back to profile dashboard
        }} 
      />
    );
  }

  return (
    <main className="overflow-x-hidden min-h-screen flex flex-col pt-4">
      <Navbar onLoginClick={() => setShowOnboarding(true)} />
      <Hero onGetStarted={() => setShowOnboarding(true)} />
      <AboutUs />
      <Benefits />
      <Courses />
      <FAQ />
      <Footer />
    </main>
  );
}
