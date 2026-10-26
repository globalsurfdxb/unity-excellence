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
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[10px]">
      <div className="relative aspect-[407/234] rounded-b-[10px] overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="flex min-h-[240px] flex-1 flex-col justify-between gap-40 bg-cream-background p-30 transition-colors duration-400 group-hover:bg-primary 3xl:min-h-[300px] rounded-t-[10px]">
        <h3 className="text-subtitle transition-colors duration-400 group-hover:text-white">{title}</h3>
        <div className="flex items-center justify-between gap-20 text-description-3">
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
