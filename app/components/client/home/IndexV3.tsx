import HeroV2 from "./sections/HeroV2";
import AboutV3 from "./sections/AboutV3";
import Highlights from "./sections/Highlights";
import Services from "./sections/Services";
import Excellence from "./sections/Excellence";
import Survey from "./sections/Survey";
import News from "./sections/News";
import HeroCover from "./HeroCover";
import { heroData, aboutData, highlightsData, servicesData, excellenceData, surveyData, newsData } from "./data";

// card scroll with About at its natural height: the white cover hides the sections below it until scrolling starts
const IndexV3 = () => {
  return (
    <>
      <HeroV2 data={heroData} />
      <div className="-mt-[calc(100svh-19px)]">
        <div className="sticky top-0">
          <HeroCover />
          <AboutV3 data={aboutData} />
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

export default IndexV3;
