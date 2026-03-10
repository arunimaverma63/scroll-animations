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

const WELCOME_TEXT = "W E L C O M E   I T Z F I Z Z".split(" ");

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
        {/* Hero Content Container */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10
        }}>
          {/* Headline */}
          <div
            ref={headlineRef}
            style={{
              fontSize: "clamp(3rem, 8vw, 8rem)",
              fontWeight: "bold",
              color: "#111",
              textAlign: "center",
              marginBottom: "2rem",
              letterSpacing: "0.2em",
              opacity: 0,
              transform: "translateY(50px) scale(0.9)"
            }}
          >
            {WELCOME_TEXT.map((char, i) => (
              <span
                key={i}
                ref={(el) => (lettersRef.current[i] = el)}
                style={{ 
                  display: "inline-block",
                  opacity: 0,
                  margin: "0 0.1em"
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Statistics */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
            maxWidth: "1200px",
            width: "100%",
            padding: "0 2rem"
          }}>
            {STATS.map((box, i) => (
              <div
                key={box.id}
                ref={(el) => (boxRefs.current[i] = el)}
                style={{
                  opacity: 0,
                  padding: "2rem",
                  borderRadius: "1rem",
                  background: box.bg,
                  color: box.color,
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  textAlign: "center",
                  minWidth: "200px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  transform: "translateY(30px) scale(0.8)",
                  transition: "transform 0.3s ease"
                }}
              >
                <div style={{ 
                  fontSize: "3rem", 
                  fontWeight: "700",
                  marginBottom: "0.5rem"
                }}>
                  {box.num}
                </div>
                <div>{box.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Road */}
        <div
          id="road"
          style={{
            width: "100vw",
            height: "200px",
            backgroundColor: "#1e1e1e",
            position: "absolute",
            bottom: "10%",
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
              background: "linear-gradient(90deg, #45db7d 0%, #2ecc71 100%)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              width: 0,
              boxShadow: "0 0 20px rgba(69, 219, 125, 0.5)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
