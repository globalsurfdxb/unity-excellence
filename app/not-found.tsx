import type { Metadata } from "next";
import NotFoundView from "@/app/components/common/NotFoundView";

export const metadata: Metadata = {
  title: "Page not found | Unity Excellence",
};

const NotFound = () => {
  return <NotFoundView />;
};

export default NotFound;
