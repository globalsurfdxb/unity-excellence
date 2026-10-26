import Image from "next/image";
import { aboutData } from "../data";
import CommonButton from "@/app/components/common/CommonButton";

type Props = {
  data: typeof aboutData;
};

const About = ({ data }: Props) => {
  const [topRow, bottomRow] = [
    data.images.slice(0, 2),
    data.images.slice(2, 4),
  ];

  return (
    <section className="py-130">
      <div className="container relative">
        <div className="relative">
          <div className="flex justify-between px-80">
            {topRow.map((image) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={150}
                height={150}
                className="size-[100px] rounded-[10px] object-cover xl:size-150"
              />
            ))}
          </div>
          <div className="mt-60 flex justify-between">
            {bottomRow.map((image) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={150}
                height={150}
                className="size-[100px] rounded-2.5 object-cover xl:size-150"
              />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[85px] bg-linear-to-b from-background/0 to-background xl:h-[calc(var(--space-150)*0.85)] opacity-70" />
        </div>

        <div className="mt-60 flex flex-col items-center text-center lg:absolute lg:inset-0 lg:mt-0">
          <h2 className="section-title max-w-[30ch] bg-linear-[var(--gradient-angle)] from-primary from-[21.05%] to-primary-light to-[84.98%] animate-gradient-wave bg-clip-text text-transparent">
            {data.title}
          </h2>
          <p className="text-description mt-20 mb-40 max-w-[48ch] text-secondary">
            {data.description}
          </p>
          <CommonButton
            label={data.button.label}
            href={data.button.href}
            variant="dark"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
