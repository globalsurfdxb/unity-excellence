import Image from "next/image";
import Link from "next/link";

type Props = {
  image: string;
  title: string;
  category: string;
  date: string;
  href: string;
};

const NewsCard = ({ image, title, category, date, href }: Props) => {
  return (
    <Link href={href} data-news="card" className="group flex h-full flex-col overflow-hidden rounded-[10px]">
      <div data-news="media" className="relative aspect-[407/234] overflow-hidden rounded-b-[10px] [clip-path:inset(var(--clip,0%)_0_0_0)]">
        <div data-news="zoom" className="absolute inset-0">
          <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
        </div>
      </div>

      <div className="relative isolate flex min-h-[240px] flex-1 flex-col justify-between gap-40 overflow-hidden rounded-t-[10px] bg-cream-background p-30 3xl:min-h-[300px]">
        {/* navy fill drops from the top with a curved edge that flattens as it lands */}
        <span
          aria-hidden
          className="absolute -inset-x-[15%] top-0 -z-10 h-[130%] -translate-y-full rounded-[0_0_50%_50%/0_0_35%_35%] bg-primary transition-[translate,border-radius] duration-[400ms] ease-linear group-hover:translate-y-0 group-hover:rounded-none"
        />
        <h3 data-news="content" className="text-subtitle transition-colors duration-300 group-hover:text-white group-hover:delay-75">{title}</h3>
        <div data-news="content" className="flex items-center justify-between gap-20 text-description-3">
          <span className="rounded-full border border-border-color px-[10px] py-[10px] max-h-[41px] text-secondary transition-colors duration-300 group-hover:border-white/40 group-hover:text-white group-hover:delay-200">
            {category}
          </span>
          <span className="text-secondary transition-colors duration-300 group-hover:text-white group-hover:delay-200">{date}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
