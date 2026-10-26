import Hero from "./sections/Hero";
import About from "./sections/About";
import Highlights from "./sections/Highlights";
import Services from "./sections/Services";
import Excellence from "./sections/Excellence";
import Survey from "./sections/Survey";
import { heroData, aboutData, highlightsData, servicesData, excellenceData, surveyData } from "./data";

const Index = () => {
  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Highlights data={highlightsData} />
      <Services data={servicesData} />
      <Excellence data={excellenceData} />
      <Survey data={surveyData} />
    </>
  );
};

export default Index;
