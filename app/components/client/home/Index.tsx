import Hero from "./sections/Hero";
import About from "./sections/About";
import Highlights from "./sections/Highlights";
import { heroData, aboutData, highlightsData } from "./data";

const Index = () => {
  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Highlights data={highlightsData} />
    </>
  );
};

export default Index;
