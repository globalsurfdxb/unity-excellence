import Image from "next/image";
import { surveyData } from "../data";
import CommonButton from "@/app/components/common/CommonButton";

type Props = {
  data: typeof surveyData;
};

const Survey = ({ data }: Props) => {
  return (
    <section className="grid lg:min-h-[calc(50vw*668/960)] lg:grid-cols-2">
      <div className="relative z-10 aspect-[960/668] overflow-hidden lg:aspect-auto lg:rounded-r-[10px]">
        <Image src={data.image} alt={data.imageAlt} fill className="object-cover" />
        <div className="absolute inset-0 bg-linear-[238.59deg] from-primary/0 from-[22.02%] to-primary/60 to-100%" />
      </div>

      <div className="flex flex-col justify-center lg:-ml-[15px] bg-linear-[255.44deg] from-primary from-[56.21%] to-primary-light to-[154.81%] pl-20 py-100 text-white lg:pl-120">
        <h2 className="hero-title whitespace-pre-line">{data.title}</h2>
        <p className="text-description mt-20 max-w-[40ch] text-white/70">{data.description}</p>
        <CommonButton label={data.button.label} href={data.button.href} className="mt-40" />
      </div>
    </section>
  );
};

export default Survey;
