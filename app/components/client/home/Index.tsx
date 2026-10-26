import Hero from "./sections/Hero";
import About from "./sections/About";
import { heroData, aboutData } from "./data";

const Index = () => {
  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
    </>
  );
};

export default Index;
