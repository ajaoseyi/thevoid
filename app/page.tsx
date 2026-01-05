"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Play,
  Pause,
  ArrowRight,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import "../app/pages.css";
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const [isTextHover, setIsTextHover] = useState(false);
  const [cursorColor, setCursorColor] = useState<string>("#ffffff");
  const [cursorSize, setCursorSize] = useState<number>(42);
  const [blobScaleX, setBlobScaleX] = useState<number>(1);
  const [blobScaleY, setBlobScaleY] = useState<number>(1);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerSrc, setPlayerSrc] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [videoMuted, setVideoMuted] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const workScrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [playingServiceId, setPlayingServiceId] = useState<number | null>(null);
  const servicesVideoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>(
    {}
  );

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 600, damping: 40 });
  const springY = useSpring(rawY, { stiffness: 600, damping: 40 });
  const effectiveCursorSize = hoveredWork !== null ? 120 : cursorSize;
  const effectiveCursorColor = hoveredWork !== null ? "#ff9500" : cursorColor;
  const sizeRef = useRef(cursorSize);
  useEffect(() => {
    sizeRef.current = effectiveCursorSize;
  }, [effectiveCursorSize]);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const run = () => {
        springX.set(e.clientX - sizeRef.current / 2);
        springY.set(e.clientY - sizeRef.current / 2);
        const target = e.target as HTMLElement | null;
        const textEl = target?.closest(
          "p, h1, h2, h3, h4, h5, h6, a, span, li"
        ) as HTMLElement | null;
        if (textEl) {
          const color = getComputedStyle(textEl).color;
          const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
          if (m) {
            const r = parseInt(m[1], 10);
            const g = parseInt(m[2], 10);
            const b = parseInt(m[3], 10);
            const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            setCursorColor(luminance > 0.6 ? "#000000" : "#ffffff");
          } else {
            setCursorColor("#ffffff");
          }
          setCursorSize(120);
          setIsTextHover(true);
          const rect = textEl.getBoundingClientRect();
          const nx =
            Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1) -
            0.5;
          const ax = Math.abs(nx);
          setBlobScaleX(1 + ax * 0.35);
          setBlobScaleY(Math.max(0.85, 1 - ax * 0.25));
        } else {
          setCursorColor("#ffffff");
          setCursorSize(42);
          setIsTextHover(false);
          setBlobScaleX(1);
          setBlobScaleY(1);
        }
      };
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(run);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [springX, springY]);

  const workItems = [
    {
      id: 1,
      title: "Brand Revolution",
      category: "Commercial",
      image:
        "https://ik.imagekit.io/gx2xyzf36/AQNW_BxPs9MswAIz_SJ13h40hybHYhmFoiXESrVDeYvfxQZ-ZXZtUfP0aiYEmzkcuqO8kRzfRU32yTNflSGi1rN_HLLVHNYS0lgYo_E.mp4?updatedAt=1767362097626",
    },
    {
      id: 2,
      title: "Future Forward",
      category: "Branded Content",
      image:
        "https://ik.imagekit.io/gx2xyzf36/wedding-void.mp4?updatedAt=1767362102048",
    },
    {
      id: 3,
      title: "Urban Stories",
      category: "Documentary",
      image:
        "https://ik.imagekit.io/gx2xyzf36/lavenu-void.mp4?updatedAt=1767362080444",
    },
    {
      id: 4,
      title: "Motion Design",
      category: "Animation",
      image:
        "https://ik.imagekit.io/gx2xyzf36/lemonade.mp4?updatedAt=1767362071398",
    },
  ];

  const services = [
    {
      title: "Commercials",
      video:
        "https://ik.imagekit.io/gx2xyzf36/AQNW_BxPs9MswAIz_SJ13h40hybHYhmFoiXESrVDeYvfxQZ-ZXZtUfP0aiYEmzkcuqO8kRzfRU32yTNflSGi1rN_HLLVHNYS0lgYo_E.mp4?updatedAt=1767362097626",
      desc: "Powerful storytelling that drives results",
    },
    {
      title: "Branded Content",
      video:
        "https://ik.imagekit.io/gx2xyzf36/AQNW_BxPs9MswAIz_SJ13h40hybHYhmFoiXESrVDeYvfxQZ-ZXZtUfP0aiYEmzkcuqO8kRzfRU32yTNflSGi1rN_HLLVHNYS0lgYo_E.mp4?updatedAt=1767362097626",
      desc: "Authentic narratives for your brand",
    },
    {
      title: "Animation",
      video:
        "https://ik.imagekit.io/gx2xyzf36/AQNW_BxPs9MswAIz_SJ13h40hybHYhmFoiXESrVDeYvfxQZ-ZXZtUfP0aiYEmzkcuqO8kRzfRU32yTNflSGi1rN_HLLVHNYS0lgYo_E.mp4?updatedAt=1767362097626",
      desc: "Dynamic motion and visual effects",
    },
    {
      title: "Documentaries",
      video:
        "https://ik.imagekit.io/gx2xyzf36/AQNW_BxPs9MswAIz_SJ13h40hybHYhmFoiXESrVDeYvfxQZ-ZXZtUfP0aiYEmzkcuqO8kRzfRU32yTNflSGi1rN_HLLVHNYS0lgYo_E.mp4?updatedAt=1767362097626",
      desc: "Real stories that inspire change",
    },
  ];

  const blogPosts = [
    {
      title: "The Future of Video Marketing in 2026",
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop",
    },
    {
      title: "Behind the Scenes: Our Latest Campaign",
      image:
        "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop",
    },
    {
      title: "Crafting Stories That Resonate",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=400&fit=crop",
    },
  ];
  const Typewriter = ({
    text,
    duration = 1.5,
    startDelay = 0,
    className,
  }: {
    text: string;
    duration?: number;
    startDelay?: number;
    className?: string;
  }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let intervalId: number | null = null;
      const total = text.length;
      const interval = Math.max((duration * 1000) / Math.max(total, 1), 20);
      const timeoutId = window.setTimeout(() => {
        intervalId = window.setInterval(() => {
          setCount((c) => {
            const next = c + 1;
            if (next >= total) {
              if (intervalId) {
                window.clearInterval(intervalId);
              }
            }
            return next;
          });
        }, interval);
      }, startDelay * 1000);
      return () => {
        if (intervalId) {
          window.clearInterval(intervalId);
        }
        window.clearTimeout(timeoutId);
      };
    }, [text, duration, startDelay]);
    return <span className={className}>{text.slice(0, count)}</span>;
  };

  const isBlobActive = isTextHover || hoveredWork !== null;
  const variants = {
    default: {
      width: effectiveCursorSize,
      height: effectiveCursorSize,
      borderRadius: "50%",
      scaleX: 1,
      scaleY: 1,
    },
    text: {
      width: effectiveCursorSize,
      height: effectiveCursorSize,
      borderRadius: "60% 40% 55% 45% / 40% 60% 45% 55%",
      scaleX: blobScaleX,
      scaleY: blobScaleY,
    },
  } as const;

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <motion.div
        animate={isBlobActive ? "text" : "default"}
        variants={variants}
        transition={{ type: "spring", bounce: 0.25, duration: 0.3 }}
        className="cursor blob"
        style={{
          x: springX,
          y: springY,
          backgroundColor: "#ff9500",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence>
          {hoveredWork !== null &&
            workItems
              .find((i) => i.id === hoveredWork)
              ?.image.includes(".mp4") && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                {playingVideoId === hoveredWork ? (
                  <Pause size={32} fill="white" className="text-white" />
                ) : (
                  <Play size={32} fill="white" className="text-white ml-1" />
                )}
              </motion.div>
            )}
        </AnimatePresence>
      </motion.div>
      {isPlayerOpen && playerSrc && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[90vw] max-w-4xl">
            <video
              src={playerSrc}
              controls
              autoPlay
              playsInline
              className="w-full h-auto rounded-lg"
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsPlayerOpen(false)}
                className="bg-white text-black px-6 py-2 rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/95 backdrop-blur-sm py-4" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">LOGO</div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#work" className="hover:text-gray-400 transition-colors">
              Work
            </a>
            <a
              href="#services"
              className="hover:text-gray-400 transition-colors"
            >
              Services
            </a>
            <a href="#about" className="hover:text-gray-400 transition-colors">
              About
            </a>
            <a href="#blog" className="hover:text-gray-400 transition-colors">
              Blog
            </a>
            <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-all">
              Contact
            </button>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-gray-800">
            <nav className="flex flex-col p-6 gap-4">
              <a
                href="#work"
                className="text-xl hover:text-gray-400 transition-colors"
              >
                Work
              </a>
              <a
                href="#services"
                className="text-xl hover:text-gray-400 transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-xl hover:text-gray-400 transition-colors"
              >
                About
              </a>
              <a
                href="#blog"
                className="text-xl hover:text-gray-400 transition-colors"
              >
                Blog
              </a>
              <button className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-all mt-2">
                Contact
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className=" pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end h-fit pt-5 gap-12 md:gap-88">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className=" lg:text-7xl text-5xl font-bold leading-tight mb-2 pt-24 w-full"
              >
                THE VOID
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className=" lg:text-3xl text-2xl font-medium leading-tight  w-full"
              >
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Typewriter text="An agency for all things " duration={2} />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 2 }}
                  className="text-[#ff9500]"
                >
                  <Typewriter text="video" duration={1} startDelay={2} />
                </motion.span>
              </motion.h1>
            </div>
            <motion.div
              className="w-16 h-16"
              style={{
                backgroundColor: "#ff9500",
                borderRadius: "25% 75% 75% 25% / 25% 25% 75% 75%",
              }}
              animate={{
                borderRadius: [
                  "25% 75% 75% 25% / 25% 25% 75% 75%",
                  "75% 25% 25% 75% / 75% 75% 25% 25%",
                  "20% 80% 60% 40% / 40% 60% 80% 20%",
                  "80% 20% 40% 60% / 60% 40% 20% 80%",
                  "45% 55% 30% 70% / 70% 30% 55% 45%",
                  "25% 75% 75% 25% / 25% 25% 75% 75%",
                ],
                scale: [1, 1.3, 0.75, 1.25, 0.85, 1],
                rotate: [0, 120, 240, 360],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section id="work" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="relative inline-block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1, ease: "easeOut" }}
                className=" text-gray-400 text-lg tracking-widest"
              >
                FEATURED WORK
              </motion.div>
              <motion.div
                className="absolute bottom-[-8px] left-0 h-[2px] bg-[#ff9500]"
                initial={{ width: "50%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ originX: 0 }}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="flex gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory scroll-smooth"
            ref={workScrollRef}
          >
            {workItems.map((item) => {
              const isVideo = item.image.includes(".mp4");
              const isPlaying = playingVideoId === item.id;
              const isMuted = videoMuted[item.id] !== false; // Default to muted

              const handleVideoClick = (e?: React.MouseEvent) => {
                e?.stopPropagation();
                if (!isVideo) return;
                const video = videoRefs.current[item.id];
                if (!video) return;

                if (isPlaying) {
                  video.pause();
                  setPlayingVideoId(null);
                } else {
                  // Pause all other videos
                  Object.values(videoRefs.current).forEach((v) => {
                    if (v && v !== video) {
                      v.pause();
                    }
                  });
                  video.play();
                  setPlayingVideoId(item.id);
                  // Snap the playing item to the left edge of the scroll container
                  // Use a microtask to ensure layout reflects size changes before scrolling
                  setTimeout(() => {
                    const container = workScrollRef.current;
                    const itemEl = itemRefs.current[item.id];
                    if (container && itemEl) {
                      container.scrollTo({
                        left: itemEl.offsetLeft,
                        behavior: "smooth",
                      });
                    }
                  }, 0);
                }
              };

              const handleMuteToggle = (e: React.MouseEvent) => {
                e.stopPropagation();
                const video = videoRefs.current[item.id];
                if (!video) return;

                const newMutedState = !isMuted;
                video.muted = newMutedState;
                setVideoMuted((prev) => ({
                  ...prev,
                  [item.id]: newMutedState,
                }));
              };

              return (
                <div
                  key={item.id}
                  className="relative group snap-start snap-always flex-shrink-0"
                  onMouseEnter={() => setHoveredWork(item.id)}
                  onMouseLeave={() => setHoveredWork(null)}
                  onClick={handleVideoClick}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                >
                  {true ? (
                    <>
                      <video
                        ref={(el) => {
                          videoRefs.current[item.id] = el;
                        }}
                        className={`min-w-[100vw] h-[500px] object-cover cursor-pointer bg-black transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                          isPlaying ? "md:min-w-[97vw]" : "md:min-w-[80vh]"
                        }`}
                        playsInline
                        muted={isMuted}
                        onEnded={() => setPlayingVideoId(null)}
                      >
                        <source src={item.image} type="video/mp4" />
                      </video>
                      {/* Speaker Icon - appears when video is playing */}
                      <AnimatePresence>
                        {isPlaying && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -10 }}
                            transition={{
                              type: "spring",
                              damping: 20,
                              stiffness: 300,
                            }}
                            onClick={handleMuteToggle}
                            className="absolute top-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-white transition-all hover:bg-black/90 hover:scale-110 hover:border-white/50 shadow-lg"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? (
                              <VolumeX size={20} />
                            ) : (
                              <Volume2 size={20} />
                            )}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="min-w-[80vh] h-[500px] object-cover"
                    />
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 transition-opacity duration-300 pointer-events-none ${
                      hoveredWork === item.id && !isPlaying
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <div>
                      <div className="text-sm text-gray-300 mb-2">
                        {item.category}
                      </div>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                    </div>
                    {!isPlaying && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play size={24} fill="white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-zinc-950 ">
        <div className="max-w-7xl mx-auto ">
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, ease: "easeOut" }}
              className=" text-gray-400 text-lg tracking-widest"
            >
              OUR PROCESS
            </motion.div>
            <motion.div
              className="absolute bottom-[-8px] left-0 h-[2px] bg-[#ff9500]"
              initial={{ width: "50%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ originX: 0 }}
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mb-16"
          >
            Video production
            <br />
            should be <span className="text-[#ff9500]"> easy </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-xl text-gray-400 mb-16 max-w-3xl"
          >
            We prioritize flexibility, streamlined processes, and creative that
            positively impacts your business. From commercials to animation,
            documentaries to branded content, we&#39;ve got you covered.
          </motion.p>
          <div className="relative inline-block mb-8 md:mt-24 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, ease: "easeOut" }}
              className=" text-gray-400 text-lg tracking-widest "
            >
              WHAT WE DO ?
            </motion.div>
            <motion.div
              className="absolute bottom-[-8px] left-0 h-[2px] bg-[#ff9500]"
              initial={{ width: "50%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ originX: 0 }}
            />
          </div>
          <div className="flex gap-[2px] overflow-x-scroll scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {services.map((service, idx) => {
              const isPlaying = playingServiceId === idx;
              const handleEnter = () => {
                setHoveredService(idx);
                const current = servicesVideoRefs.current[idx];
                if (!current) return;
                Object.values(servicesVideoRefs.current).forEach((v) => {
                  if (v && v !== current) v.pause();
                });
                current.muted = true;
                current.play();
                setPlayingServiceId(idx);
              };
              const handleLeave = () => {
                setHoveredService(null);
                const current = servicesVideoRefs.current[idx];
                if (current) current.pause();
                setPlayingServiceId(null);
              };
              return (
                <div
                  key={idx}
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                  className="relative group w-[80vw] md:w-[300px] h-[90vh] overflow-hidden flex-shrink-0"
                >
                  <video
                    ref={(el) => {
                      servicesVideoRefs.current[idx] = el;
                    }}
                    playsInline
                    muted
                    className="relative z-0 w-full h-full object-cover"
                  >
                    <source src={service.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 z-10 bg-black/60 transition-opacity duration-300 flex items-center justify-center">
                    <h3 className=" font-medium text-gray-300 group-hover:text-white transform transition-transform duration-300 ease-in-out group-hover:scale-105">
                      {service.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 text-gray-400 text-sm tracking-widest"
          >
            YOUR OBJECTIVES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            We hear you
            <br />
            <span className="text-[#ff9500]"> loud & clear </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-xl text-gray-400 max-w-3xl mb-12"
          >
            Muddled messaging leads to uninspired, underperforming videos.
            We&#39;ll work with you to clarify your story, then help you push it
            in unexpected directions. Whether you need strategy first or
            you&#39;re ready to cut footage, we&#39;ll take you from sticky note
            to final.mp4.
          </motion.p>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="relative inline-block ">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 1, ease: "easeOut" }}
                className=" text-gray-400 text-lg tracking-widest "
              >
                ARTICLES
              </motion.div>
              <motion.div
                className="absolute bottom-[-8px] left-0 h-[2px] bg-[#ff9500]"
                initial={{ width: "50%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ originX: 0 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{
                  duration: 1,
                  delay: 0.2 + idx * 0.1,
                  ease: "easeOut",
                }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/2] overflow-hidden rounded-lg mb-4 bg-gray-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold group-hover:text-gray-300 transition-colors">
                  {post.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-8"
          >
            Let&#39;s work together!
          </motion.h2>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            href="mailto:hello@visionary.studio"
            className="text-2xl md:text-3xl text-gray-400 hover:text-white transition-colors inline-block mb-12"
          >
            hello@thevoid.studio
          </motion.a>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition-all">
              Start a Project
            </button>
            <button className="border border-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all">
              View Portfolio
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl text-[#303EF7] font-bold mb-4">
                THE VOID
              </div>
              <p className="text-gray-400">
                Creating visual stories that matter.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Commercials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Animation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentaries
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2026 The Void Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
