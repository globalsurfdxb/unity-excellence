"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { introLogo } from "./introLogo";
import { cueIntro } from "./introCue";

// how far the mark pieces start from their resting place, as a multiple of their distance from the mark's centre
const SPREAD = 1.4;
// how much larger each mark piece starts before shrinking to its real size
const GROW = 1.9;
// the mark starts turned back by this much and unwinds as the pieces close in
const TURN = -90;
// routes where the overlay hands over with panels instead of dissolving: a white panel rises over the logo,
// then the hero rises after it and covers it
const WIPE_ROUTES = ["/v2"];
// the hero sets off this long after the white panel, so a strip of white opens between them and closes as the hero catches up
const WIPE_LAG = 0.4;

gsap.registerPlugin(CustomEase);
// a slow start, a quick middle and a long soft landing
const wipeEase = CustomEase.create("intro-wipe", "M0,0 C0.5,0 0.05,1 1,1");

// full-screen brand intro: mark pieces fade in enlarged, spread apart and turned back, then shrink together as the mark unwinds, wordmark letters follow one by one,
// logo fades out, then the overlay dissolves into the hero (or, on WIPE_ROUTES, the white panel and the hero rise over it in turn):
// header logo, then the header's two ends, then the hero title and button
const Intro = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  // scrolling comes back once the overlay has gone, while the hero entrance is still finishing
  const [unlocked, setUnlocked] = useState(false);
  const lenis = useLenis();
  const wipe = WIPE_ROUTES.includes(usePathname());

  // no scrolling while the intro plays; lenis can arrive a render after mount
  const locked = !unlocked && !done;
  useEffect(() => {
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
  }, [lenis, locked]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finish = () => setDone(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cueIntro();
      finish();
      return;
    }

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const pieces = gsap.utils.toArray<SVGPathElement>('[data-intro="piece"]');
      const mark = root.querySelector('[data-intro="mark"]') as SVGGElement;
      const box = mark.getBBox();
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;

      gsap.set(mark, { rotation: TURN, svgOrigin: `${cx} ${cy}` });
      pieces.forEach((piece) => {
        const b = piece.getBBox();
        gsap.set(piece, { x: (b.x + b.width / 2 - cx) * SPREAD, y: (b.y + b.height / 2 - cy) * SPREAD, scale: GROW, transformOrigin: "50% 50%", opacity: 0 });
      });

      // letters in reading order: line by line, left to right
      const letters = gsap.utils.toArray<SVGPathElement>('[data-intro="letter"]')
        .map((el) => ({ el, b: el.getBBox() }))
        .sort((p, q) => Math.round(p.b.y) - Math.round(q.b.y) || p.b.x - q.b.x)
        .map(({ el }) => el);
      gsap.set(letters, { y: 6, opacity: 0 });

      // the small tagline below the wordmark has the most letters, so it runs through them faster
      const taglineTop = Math.max(...letters.map((el) => el.getBBox().y)) - 1;
      const letterDelays: number[] = [];
      letters.reduce((at, el) => {
        letterDelays.push(at);
        return at + (el.getBBox().y >= taglineTop ? 0.01 : 0.03);
      }, 0);

      const hero = document.querySelector('[data-intro="hero"]');
      const heroShape = document.querySelector('[data-intro="hero-shape"]');
      const headerLogo = document.querySelector('[data-intro="header-logo"]');
      // the header's two ends slide in from their own side
      // queried from the document: selectors inside this context are scoped to the overlay
      const ends = [...document.querySelectorAll<HTMLElement>('[data-intro="header-end"]')];
      const heroButton = document.querySelector('[data-intro="hero-button"]');

      const tl = gsap.timeline({ delay: 0.2, onComplete: finish });
      tl.to(pieces, { opacity: 1, duration: 0.45, ease: "power2.out", stagger: { each: 0.025, from: "random" } }, 0)
        .to(pieces, { x: 0, y: 0, scale: 1, duration: 1.6, ease: "power2.inOut" }, 0.4)
        .to(mark, { rotation: 0, duration: 1.6, ease: "power2.inOut" }, 0.4)
        .to(letters, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: (i) => letterDelays[i] }, 0.9);

      if (wipe) {
        const panel = root.querySelector('[data-intro="panel"]');
        const heroSection = hero?.closest("section");
        // the hero rises from below the screen; the overlay is cut off at the hero's top edge so the hero shows through
        const edge = { top: 100 };
        const place = () => {
          gsap.set(heroSection ?? [], { y: `${edge.top}vh` });
          gsap.set(root, { clipPath: `inset(0 0 ${100 - edge.top}% 0)` });
        };
        tl.addLabel("wipe", ">+0.3")
          .set(root, { pointerEvents: "none" }, "wipe")
          .call(place, [], "wipe")
          .to(panel, { y: 0, duration: 1.45, ease: wipeEase }, "wipe")
          .to(edge, { top: 0, duration: 1.45, ease: wipeEase, onUpdate: place }, `wipe+=${WIPE_LAG}`)
          .set(heroSection ?? [], { clearProps: "transform" })
          // the header and the hero's contents come in as the hero nears the top
          .addLabel("reveal", `wipe+=${WIPE_LAG + 0.8}`)
          .call(() => setUnlocked(true), [], `wipe+=${WIPE_LAG + 1.45}`);
      } else {
        tl.to('[data-intro="logo"]', { opacity: 0, duration: 0.5, ease: "power2.in" }, ">+0.1")
          .addLabel("reveal")
          // let clicks and the hero title's on-screen check pass through while it fades
          .set(root, { pointerEvents: "none" }, "reveal")
          .to(root, { opacity: 0, duration: 1, ease: "power2.inOut" }, "reveal")
          .call(() => setUnlocked(true), [], "reveal+=1");
      }

      // header and hero are only touched from the reveal on, behind the still-opaque overlay:
      // styling them at mount would race hydration and trip a server/client mismatch.
      // the wipe uncovers the top of the screen before the reveal, so there they're hidden as it starts
      const hide = wipe ? "wipe" : "reveal";
      // the panel hand-over already brings the hero in, so the image only zooms out after the dissolve
      if (hero && !wipe) tl.fromTo(hero, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power3.out", immediateRender: false, clearProps: "transform" }, "reveal");
      if (heroShape) {
        tl.set(heroShape, { opacity: 0, y: 60 }, hide)
          .to(heroShape, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", clearProps: "opacity,transform" }, "reveal+=0.3");
      }
      if (headerLogo) {
        // after the wipe the logo waits for the hero to settle at the top before coming down
        tl.set(headerLogo, { opacity: 0, y: -16 }, hide)
          .to(headerLogo, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "opacity,transform" }, wipe ? `wipe+=${WIPE_LAG + 1.45}` : "reveal+=0.35");
      }
      if (ends.length) {
        tl.set(ends, { opacity: 0, x: (_, el: HTMLElement) => (el.getBoundingClientRect().left < window.innerWidth / 2 ? -30 : 30) }, hide)
          .to(ends, { x: 0, duration: 1.4, ease: "elastic.out(1.1, 0.6)", clearProps: "transform" }, "reveal+=0.7")
          .to(ends, { opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "opacity" }, "reveal+=0.7");
      }
      // V2's title rises line by line just after the hero sets off, so it lands with it
      tl.call(cueIntro, [], wipe ? `wipe+=${WIPE_LAG + 0.65}` : "reveal+=1");
      if (heroButton) {
        // after the wipe the button follows the title's lines up instead of waiting for the reveal to finish
        const buttonAt = wipe ? `wipe+=${WIPE_LAG + 1.2}` : "reveal+=1.3";
        tl.set(heroButton, { opacity: 0, y: 50 }, hide)
          .to(heroButton, { y: 0, duration: 1.4, ease: "elastic.out(1.1, 0.6)", clearProps: "transform" }, buttonAt)
          .to(heroButton, { opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "opacity" }, buttonAt);
      }
    }, root);

    return () => ctx.revert();
  }, [wipe]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      <div
        className="absolute inset-0 flex items-center justify-center bg-linear-[255.44deg] from-primary from-[56.21%] to-primary-light to-[154.81%]"
      >
        <svg data-intro="logo" viewBox={introLogo.viewBox} fill="white" className="w-[150px] overflow-visible lg:w-[200px]">
          <g data-intro="mark">
            {introLogo.mark.map((d) => (
              <path key={d} d={d} data-intro="piece" opacity={0} />
            ))}
          </g>
          <g>
            {introLogo.text.map((d) => (
              <path key={d} d={d} data-intro="letter" opacity={0} />
            ))}
          </g>
        </svg>
      </div>
      {/* starts just below the screen; positioned through transform so gsap takes it over */}
      {wipe && (
        <div
          data-intro="panel"
          style={{ transform: "translateY(100vh)" }}
          className="absolute inset-0 bg-white"
        />
      )}
    </div>
  );
};

export default Intro;
