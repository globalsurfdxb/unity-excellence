import Hero from "./sections/Hero";
import About from "./sections/About";
import Highlights from "./sections/Highlights";
import Services from "./sections/Services";
import Excellence from "./sections/Excellence";
import Survey from "./sections/Survey";
import News from "./sections/News";
import HeroCover from "./HeroCover";
import { heroData, aboutData, highlightsData, servicesData, excellenceData, surveyData, newsData } from "./data";

const Index = () => {
  return (
    <>
      <Hero data={heroData} />
      <div className="-mt-[calc(100svh-19px)]">
        <div className="sticky top-0">
          <HeroCover />
          <About data={aboutData} />
          <Highlights data={highlightsData} />
          <Services data={servicesData} />
          <Excellence data={excellenceData} />
          <Survey data={surveyData} />
          <News data={newsData} />
        </div>
        <div aria-hidden="true" className="h-[calc(120svh-19px)]" />
      </div>
    </>
  );
};

export default Index;
