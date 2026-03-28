import { useState } from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Benefits from "./components/Benefits";
import Courses from "./components/Courses";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { OnboardingFlow } from "./components/Onboarding/OnboardingFlow";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
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

export default App;
