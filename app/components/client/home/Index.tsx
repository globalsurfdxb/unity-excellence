import Hero from "./sections/Hero";
import About from "./sections/About";
import Highlights from "./sections/Highlights";
import Services from "./sections/Services";
import Excellence from "./sections/Excellence";
import Survey from "./sections/Survey";
import News from "./sections/News";
import { heroData, aboutData, highlightsData, servicesData, excellenceData, surveyData, newsData } from "./data";

// card scroll: About waits pinned at the bottom of the screen under the hero, which slides up off it like a card;
// once the hero has cleared About the page scrolls on normally
const Index = () => {
  return (
    <>
      <Hero data={heroData} />
      <About data={aboutData} />
      <Highlights data={highlightsData} />
      <Services data={servicesData} />
      <Excellence data={excellenceData} />
      <Survey data={surveyData} />
      <News data={newsData} />
    </>
  );
};

export default Index;
