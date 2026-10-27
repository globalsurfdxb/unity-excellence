import Image from "next/image";
import { excellenceData } from "../data";
import SectionTitle from "@/app/components/common/SectionTitle";
import EdgeLine from "@/app/components/common/EdgeLine";

type Props = {
  data: typeof excellenceData;
};

const Excellence = ({ data }: Props) => {
  return (
    <section className="bg-cream-background py-130">
      <div className="container flex flex-col lg:flex-row gap-80 lg:justify-between">
        <div>
          <SectionTitle text={data.title} className="section-title" />
          <p className="text-description mt-20 max-w-[47ch] text-secondary">
            {data.description}
          </p>
        </div>

        <ul className="grid gap-x-30 sm:grid-cols-2">
          {data.features.map((feature, i) => (
            <li key={feature.title} className="min-[1900px]:min-w-[408px]">
              <EdgeLine delay={i * 0.12} />
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
