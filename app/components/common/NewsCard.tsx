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

      <div className="flex min-h-[240px] flex-1 flex-col justify-between gap-40 bg-cream-background p-30 transition-colors duration-400 group-hover:bg-primary 3xl:min-h-[300px] rounded-t-[10px]">
        <h3 data-news="content" className="text-subtitle transition-colors duration-400 group-hover:text-white">{title}</h3>
        <div data-news="content" className="flex items-center justify-between gap-20 text-description-3">
          <span className="rounded-full border border-border-color px-[10px] py-[10px] max-h-[41px] text-secondary transition-colors duration-400 group-hover:border-white/40 group-hover:text-white">
            {category}
          </span>
          <span className="text-secondary transition-colors duration-400 group-hover:text-white">{date}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
