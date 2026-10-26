import Image from "next/image";
import { excellenceData } from "../data";

type Props = {
  data: typeof excellenceData;
};

const Excellence = ({ data }: Props) => {
  return (
    <section className="bg-cream-background py-130">
      <div className="container flex flex-col lg:flex-row gap-80 lg:justify-between">
        <div>
          <h2 className="section-title whitespace-pre-line">{data.title}</h2>
          <p className="text-description mt-20 max-w-[47ch] text-secondary">
            {data.description}
          </p>
        </div>

        <ul className="grid gap-x-30 sm:grid-cols-2">
          {data.features.map((feature) => (
            <li key={feature.title} className="min-[1900px]:min-w-[408px]">
              <span className="block h-[10px] rounded-t-[10px] border-t border-primary/10" />
              <div className="flex items-center gap-30 pt-30 pb-60 pr-50">
                <Image
                  src={feature.icon}
                  alt=""
                  width={50}
                  height={50}
                  className="h-[50px] w-auto flex-shrink-0 pointer-events-none"
                />
                <span className="text-subtitle">{feature.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Excellence;
