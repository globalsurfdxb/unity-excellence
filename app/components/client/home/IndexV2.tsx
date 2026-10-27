import HeroV2 from "./sections/HeroV2";
import AboutV2 from "./sections/AboutV2";
import Highlights from "./sections/Highlights";
import Services from "./sections/Services";
import Excellence from "./sections/Excellence";
import Survey from "./sections/Survey";
import News from "./sections/News";
import { heroData, aboutData, highlightsData, servicesData, excellenceData, surveyData, newsData } from "./data";

// card scroll: the hero lifts off like a card over the rest of the page, pinned underneath it
const IndexV2 = () => {
  return (
    <>
      <HeroV2 data={heroData} />
      <div className="-mt-[calc(100svh-19px)]">
        <div className="sticky top-0">
          <AboutV2 data={aboutData} />
          <Highlights data={highlightsData} />
          <Services data={servicesData} />
          <Excellence data={excellenceData} />
          <Survey data={surveyData} />
          <News data={newsData} />
        </div>
        <div aria-hidden="true" className="h-[calc(130svh-19px)]" />
      </div>
    </>
  );
};

export default IndexV2;
