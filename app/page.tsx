"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Play, ArrowRight, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import "../app/pages.css";
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isTextHover, setIsTextHover] = useState(false);
  const [cursorColor, setCursorColor] = useState<string>("#ffffff");
  const [cursorSize, setCursorSize] = useState<number>(82);
  const [blobScaleX, setBlobScaleX] = useState<number>(1);
  const [blobScaleY, setBlobScaleY] = useState<number>(1);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerSrc, setPlayerSrc] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [videoMuted, setVideoMuted] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (hoveredWork !== null) {
      setCursorColor("#ff9500");
      setCursorSize(120);
    }
  }, [hoveredWork]);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
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
          Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1) - 0.5;
        const ny =
          Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1) - 0.5;
        const ax = Math.abs(nx);
        const ay = Math.abs(ny);
        setBlobScaleX(1 + ax * 0.35);
        setBlobScaleY(Math.max(0.85, 1 - ax * 0.25));
      } else {
        setCursorColor("#ffffff");
        setCursorSize(82);
        setIsTextHover(false);
        setBlobScaleX(1);
        setBlobScaleY(1);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
        "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop",
    },
  ];

  const services = [
    { title: "Commercials", desc: "Powerful storytelling that drives results" },
    { title: "Branded Content", desc: "Authentic narratives for your brand" },
    { title: "Animation", desc: "Dynamic motion and visual effects" },
    { title: "Documentaries", desc: "Real stories that inspire change" },
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

  const isBlobActive = isTextHover || hoveredWork !== null;
  const variants = {
    default: {
      x: cursorPosition.x - cursorSize / 2,
      y: cursorPosition.y - cursorSize / 2,
      width: cursorSize,
      height: cursorSize,
      borderRadius: "50%",
      scaleX: 1,
      scaleY: 1,
    },
    text: {
      x: cursorPosition.x - cursorSize / 2,
      y: cursorPosition.y - cursorSize / 2,
      width: cursorSize,
      height: cursorSize,
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
          backgroundColor: cursorColor,
          pointerEvents: hoveredWork !== null ? "auto" : "none",
          mixBlendMode: hoveredWork !== null ? "normal" : "difference",
        }}
        onClick={() => {
          if (hoveredWork !== null) {
            const item = workItems.find((w) => w.id === hoveredWork);
            if (item?.image && item.image.endsWith(".mp4")) {
              setPlayerSrc(item.image);
              setIsPlayerOpen(true);
            }
          }
        }}
      >
        {hoveredWork !== null && (
          <Play
            size={Math.round(cursorSize * 0.38)}
            style={{ color: cursorColor === "#ffffff" ? "#000000" : "#ffffff" }}
          />
        )}
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
          <div className="text-5xl font-bold tracking-tight">LOGO</div>

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
          <div className="flex items-end h-fit pt-5">
            <h1 className=" lg:text-7xl text-5xl font-bold leading-tight mb-8 pt-24 w-full">
              An agency for
              <br />
              all things <span className="text-[#ff9500]"> video </span>
            </h1>
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
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12">
            We create compelling visual stories that captivate audiences and
            drive meaningful results for your brand.
          </p>
          {/* <button className="group bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2">
            View Our Work
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </button> */}
        </div>
      </section>

      {/* Featured Work */}
      <section id="work" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-5xl font-bold">Featured Work</h2>
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

          <div className="flex gap-2 overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {workItems.map((item) => {
              const isVideo = item.image.endsWith(".mp4");
              const isPlaying = playingVideoId === item.id;
              const isMuted = videoMuted[item.id] !== false; // Default to muted

              const handleVideoClick = () => {
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
                  className="relative"
                  onMouseEnter={() => {setHoveredWork(item.id); console.log('changed')}}
                  onMouseLeave={() => setHoveredWork(null)}
                >
                  {true ? (
                    <>
                      <video
                        ref={(el) => {
                          videoRefs.current[item.id] = el;
                        }}
                        controls
                        className="min-w-[80vh] h-[500px] object-cover cursor-pointer bg-black"
                        playsInline
                        muted={isMuted}
                        onClick={handleVideoClick}
                        onEnded={() => setPlayingVideoId(null)}
                        onLoadedMetadata={(e) => {
                          // Ensure video shows first frame
                          const video = e.currentTarget;
                          video.currentTime = 0.1;
                        }}
                      >
                        <source src={item.image} type="video/mp4" />
                      </video>
                      {/* Speaker Icon - appears when video is playing */}
                      {isPlaying && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }}
                          transition={{ type: "spring", damping: 20, stiffness: 300 }}
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
                    </>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="min-w-[80vh] h-[500px] object-cover"
                    />
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 transition-opacity duration-300 ${
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
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play size={24} fill="white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-gray-400 text-sm tracking-widest">
            OUR PROCESS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Video production
            <br />
            should be <span className="text-[#ff9500]"> easy </span>
          </h2>

          <p className="text-xl text-gray-400 mb-16 max-w-3xl">
            We prioritize flexibility, streamlined processes, and creative that
            positively impacts your business. From commercials to animation,
            documentaries to branded content, we've got you covered.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="group border border-gray-800 rounded-lg p-8 hover:bg-zinc-900 transition-all cursor-pointer hover:border-gray-600"
              >
                <h3 className="text-2xl font-bold mb-3 group-hover:text-gray-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400">{service.desc}</p>
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-gray-400 text-sm tracking-widest">
            YOUR OBJECTIVES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            We hear you
            <br />
            loud & clear
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mb-12">
            Muddled messaging leads to uninspired, underperforming videos. We'll
            work with you to clarify your story, then help you push it in
            unexpected directions. Whether you need strategy first or you're
            ready to cut footage, we'll take you from sticky note to final.mp4.
          </p>
          <button className="border border-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all">
            Learn More About Us
          </button>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Featured Posts</h2>
            <a
              href="#"
              className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              View blog <ChevronRight size={20} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <div key={idx} className="group cursor-pointer">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Let's work together!
          </h2>
          <a
            href="mailto:hello@visionary.studio"
            className="text-2xl md:text-3xl text-gray-400 hover:text-white transition-colors inline-block mb-12"
          >
            hello@visionary.studio
          </a>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition-all">
              Start a Project
            </button>
            <button className="border border-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all">
              View Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">VISIONARY</div>
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
            <p>© 2026 Visionary Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
     </div>
       );
};

export default Home;
