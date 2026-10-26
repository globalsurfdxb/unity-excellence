import Hero from "./sections/Hero";
import About from "./sections/About";
import Highlights from "./sections/Highlights";
import Services from "./sections/Services";
import { heroData, aboutData, highlightsData, servicesData } from "./data";

const Index = () => {
  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Highlights data={highlightsData} />
      <Services data={servicesData} />
    </>
  );
};

export default Index;
