// on xl screens the footer sits pinned underneath the page and is only revealed once the content scrolls off it.
// Its on-screen checks would otherwise hit-test every scroll frame of the whole page, so they ask this first:
// a marker at the end of the page content is watched, and until it reaches the screen the footer is fully covered.
let revealing = false;
let observer: IntersectionObserver | null = null;
const listeners = new Set<() => void>();

const watch = () => {
  if (observer) return true;
  const end = document.querySelector("[data-page-end]");
  if (!end) return false;
  observer = new IntersectionObserver(([entry]) => {
    const next = entry.isIntersecting || entry.boundingClientRect.top < 0;
    if (next === revealing) return;
    revealing = next;
    if (revealing) listeners.forEach((listener) => listener());
  });
  observer.observe(end);
  return true;
};

// no marker on the page: fall back to always checking
export const isFooterRevealing = () => !watch() || revealing;

// called each time the footer starts to show, e.g. on a short page where it is on screen without any scrolling
export const onFooterReveal = (listener: () => void) => {
  watch();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
