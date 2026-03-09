import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import carImg from "@/assets/car-top-view.png";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { id: "box1", num: "58%", text: "Increase in pick up point use", bg: "#def54f", color: "#111", position: { top: "5%", right: "30%" } },
  { id: "box2", num: "23%", text: "Decreased in customer phone calls", bg: "#6ac9ff", color: "#111", position: { bottom: "5%", right: "35%" } },
  { id: "box3", num: "27%", text: "Increase in pick up point use", bg: "#333", color: "#fff", position: { top: "5%", right: "10%" } },
  { id: "box4", num: "40%", text: "Decreased in customer phone calls", bg: "#fa7328", color: "#111", position: { bottom: "5%", right: "12.5%" } },
];

const WELCOME_TEXT = "WELCOME ITZFIZZ".split("");

export default function ScrollCarAnimation() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const lettersRef = useRef([]);
  const boxRefs = useRef([]);

  useEffect(() => {
    const car = carRef.current;
    const trail = trailRef.current;
    const letters = lettersRef.current;
    const section = sectionRef.current;

    const roadWidth = window.innerWidth;
    const carWidth = 150;
    const endX = roadWidth - carWidth;

    // Get letter positions after mount
    const letterOffsets = letters.map((l) => l?.offsetLeft ?? 0);
    const valueAdd = section.querySelector(".value-add");
    const valueRect = valueAdd.getBoundingClientRect();

    const ctx = gsap.context(() => {
      // Car scroll animation
      gsap.to(car, {
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: trackRef.current,
        },
        x: endX,
        ease: "none",
        onUpdate() {
          const carX = gsap.getProperty(car, "x") + carWidth / 2;
          letters.forEach((letter, i) => {
            if (!letter) return;
            const letterX = valueRect.left + letterOffsets[i];
            letter.style.opacity = carX >= letterX ? "1" : "0";
          });
          gsap.set(trail, { width: carX });
        },
      });

      // Stat boxes
      const starts = [400, 600, 800, 1000];
      STATS.forEach((_, i) => {
        gsap.to(boxRefs.current[i], {
          scrollTrigger: {
            trigger: section,
            start: `top+=${starts[i]} top`,
            end: `top+=${starts[i] + 200} top`,
            scrub: true,
          },
          opacity: 1,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} style={{ height: "200vh", background: "#121212", position: "relative" }}>
      {/* Sticky track */}
      <div
        ref={trackRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#d1d1d1",
          overflow: "hidden",
        }}
      >
        {/* Road */}
        <div
          id="road"
          style={{
            width: "100vw",
            height: "200px",
            backgroundColor: "#1e1e1e",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Car */}
          <img
            ref={carRef}
            src={carImg}
            alt="car"
            style={{
              height: "200px",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
            }}
          />

          {/* Trail */}
          <div
            ref={trailRef}
            style={{
              height: "200px",
              background: "#45db7d",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              width: 0,
            }}
          />

          {/* Welcome text */}
          <div
            className="value-add"
            style={{
              top: "30%",
              fontSize: "8rem",
              fontWeight: "bold",
              position: "absolute",
              left: "5%",
              zIndex: 5,
              display: "flex",
              gap: "0.3rem",
            }}
          >
            {WELCOME_TEXT.map((char, i) => (
              <span
                key={i}
                ref={(el) => (lettersRef.current[i] = el)}
                style={{ color: "#111", opacity: 0 }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        {/* Stat boxes */}
        {STATS.map((box, i) => (
          <div
            key={box.id}
            ref={(el) => (boxRefs.current[i] = el)}
            style={{
              opacity: 0,
              padding: "30px",
              borderRadius: "10px",
              margin: "1rem",
              position: "absolute",
              zIndex: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column",
              gap: "5px",
              background: box.bg,
              color: box.color,
              fontSize: "18px",
              ...box.position,
            }}
          >
            <span style={{ fontSize: "58px", fontWeight: 600 }}>{box.num}</span>
            {box.text}
          </div>
        ))}
      </div>
    </div>
  );
}
