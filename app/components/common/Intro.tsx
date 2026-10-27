"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { introLogo } from "./introLogo";
import { cueIntro } from "./introCue";

// how far the mark pieces start from their resting place, as a multiple of their distance from the mark's centre
const SPREAD = 1.4;
// how much larger each mark piece starts before shrinking to its real size
const GROW = 1.9;
// the mark starts turned back by this much and unwinds as the pieces close in
const TURN = -90;

// full-screen brand intro: mark pieces fade in enlarged, spread apart and turned back, then shrink together as the mark unwinds, wordmark letters follow one by one,
// logo fades out, then the overlay dissolves into the hero: header logo, then the header's two ends, then the hero title and button
const Intro = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  // scrolling comes back once the overlay has gone, while the hero entrance is still finishing
  const [unlocked, setUnlocked] = useState(false);
  const lenis = useLenis();

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
        .to(letters, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: (i) => letterDelays[i] }, 0.9)
        .to('[data-intro="logo"]', { opacity: 0, duration: 0.6, ease: "power2.in" }, ">+0.4")
        .addLabel("reveal")
        // let clicks and the hero title's on-screen check pass through while it fades
        .set(root, { pointerEvents: "none" }, "reveal")
        .to(root, { opacity: 0, duration: 1, ease: "power2.inOut" }, "reveal")
        .call(() => setUnlocked(true), [], "reveal+=1");

      // header and hero are only touched from the reveal on, behind the still-opaque overlay:
      // styling them at mount would race hydration and trip a server/client mismatch
      if (hero) tl.fromTo(hero, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power3.out", immediateRender: false, clearProps: "transform" }, "reveal");
      if (heroShape) {
        tl.set(heroShape, { opacity: 0, y: 60 }, "reveal")
          .to(heroShape, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", clearProps: "opacity,transform" }, "reveal+=0.3");
      }
      if (headerLogo) {
        tl.set(headerLogo, { opacity: 0, y: -16 }, "reveal")
          .to(headerLogo, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "opacity,transform" }, "reveal+=0.35");
      }
      if (ends.length) {
        tl.set(ends, { opacity: 0, x: (_, el: HTMLElement) => (el.getBoundingClientRect().left < window.innerWidth / 2 ? -30 : 30) }, "reveal")
          .to(ends, { x: 0, duration: 1.4, ease: "elastic.out(1.1, 0.6)", clearProps: "transform" }, "reveal+=0.7")
          .to(ends, { opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "opacity" }, "reveal+=0.7");
      }
      tl.call(cueIntro, [], "reveal+=1");
      if (heroButton) {
        tl.set(heroButton, { opacity: 0, y: 50 }, "reveal")
          .to(heroButton, { y: 0, duration: 1.4, ease: "elastic.out(1.1, 0.6)", clearProps: "transform" }, "reveal+=1.3")
          .to(heroButton, { opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "opacity" }, "reveal+=1.3");
      }
    }, root);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-linear-[255.44deg] from-primary from-[56.21%] to-primary-light to-[154.81%]"
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
  );
};

export default Intro;
