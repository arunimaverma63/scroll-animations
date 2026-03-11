import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import carImg from "@/assets/McLaren 720S 2022 top view.png";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { id: "box1", num: "58%", text: "Increase in pick up point use", className: "bg-yellow-300 text-slate-900" },
  { id: "box2", num: "23%", text: "Decreased in customer phone calls", className: "bg-blue-400 text-slate-900" },
  { id: "box3", num: "27%", text: "Increase in pick up point use", className: "bg-slate-600 text-white" },
  { id: "box4", num: "40%", text: "Decreased in customer phone calls", className: "bg-orange-500 text-slate-900" },
];

const WELCOME_TEXT = "W E L C O M E I T Z F I Z Z".split(" ");

export default function ScrollCarAnimation() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const lettersRef = useRef([]);
  const boxRefs = useRef([]);
  const headlineRef = useRef(null);

  useEffect(() => {
    const car = carRef.current;
    const trail = trailRef.current;
    const letters = lettersRef.current;
    const section = sectionRef.current;
    const headline = headlineRef.current;

    const roadWidth = window.innerWidth;
    const carWidth = 150;
    const endX = roadWidth - carWidth;

    const ctx = gsap.context(() => {
      // Initial load animation for headline
      gsap.fromTo(headline, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power2.out"
        }
      );

      // Staggered animation for stats
      boxRefs.current.forEach((box, i) => {
        gsap.fromTo(box,
          { 
            opacity: 0, 
            y: 30,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: 0.5 + i * 0.2,
            ease: "back.out(1.7)"
          }
        );
      });

      // Car scroll animation
      gsap.to(car, {
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: trackRef.current,
        },
        x: endX,
        ease: "none",
        onUpdate() {
          const carX = gsap.getProperty(car, "x") + carWidth / 2;
          letters.forEach((letter, i) => {
            if (!letter) return;
            const letterRect = letter.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const relativeX = letterRect.left - sectionRect.left + letterRect.width / 2;
            letter.style.opacity = carX >= relativeX ? "1" : "0";
          });
          gsap.set(trail, { width: carX });
        },
      });

      // Stat boxes scroll animation
      const starts = [400, 600, 800, 1000];
      STATS.forEach((_, i) => {
        gsap.to(boxRefs.current[i], {
          scrollTrigger: {
            trigger: section,
            start: `top+=${starts[i]} top`,
            end: `top+=${starts[i] + 200} top`,
            scrub: 1,
          },
          opacity: 1,
          y: -20,
          scale: 1.05,
          ease: "power2.out"
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "200vh", backgroundColor: "#121212" }}>
      {/* Sticky track */}
      <div
        ref={trackRef}
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-slate-300"
      >
        {/* Hero Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {/* Headline */}
          <div
            ref={headlineRef}
            className="mb-8 text-center font-bold text-slate-900"
            style={{
              fontSize: "clamp(3rem, 8vw, 8rem)",
              letterSpacing: "0.2em",
              opacity: 0,
              transform: "translateY(50px) scale(0.9)"
            }}
          >
            {WELCOME_TEXT.map((char, i) => (
              <span
                key={i}
                ref={(el) => (lettersRef.current[i] = el)}
                className="inline-block opacity-0"
                style={{ margin: "0 0.1em" }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap items-center justify-center gap-8 w-full max-w-5xl px-8">
            {STATS.map((box, i) => (
              <div
                key={box.id}
                ref={(el) => (boxRefs.current[i] = el)}
                className={`${box.className} rounded-2xl p-8 text-center min-w-[200px] shadow-2xl transition-transform duration-300 opacity-0`}
                style={{
                  transform: "translateY(30px) scale(0.8)",
                }}
              >
                <div className="text-5xl font-bold mb-2">
                  {box.num}
                </div>
                <div className="text-base font-medium">{box.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Road */}
        <div
          id="road"
          className="absolute bottom-[10%] w-screen h-48 bg-slate-900 overflow-hidden"
        >
          {/* Car */}
          <img
            ref={carRef}
            src={carImg}
            alt="car"
            className="absolute top-0 left-0 h-48 z-10"
          />

          {/* Trail */}
          <div
            ref={trailRef}
            className="absolute top-0 left-0 h-48 z-0"
            style={{
              background: "linear-gradient(90deg, #45db7d 0%, #2ecc71 100%)",
              width: 0,
              boxShadow: "0 0 20px rgba(69, 219, 125, 0.5)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
