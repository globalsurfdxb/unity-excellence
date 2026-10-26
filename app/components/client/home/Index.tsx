import Hero from "./sections/Hero";
import About from "./sections/About";
import Highlights from "./sections/Highlights";
import Services from "./sections/Services";
import Excellence from "./sections/Excellence";
import { heroData, aboutData, highlightsData, servicesData, excellenceData } from "./data";

const Index = () => {
  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Highlights data={highlightsData} />
      <Services data={servicesData} />
      <Excellence data={excellenceData} />
    </>
  );
};

export default Index;
