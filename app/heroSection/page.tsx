// components/VideoHero.jsx
"use client";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useStore } from "../../store";

const VIDEO_URLS = [
  "https://ik.imagekit.io/gx2xyzf36/wedding-void.mp4",
  "https://ik.imagekit.io/gx2xyzf36/AQNW_BxPs9MswAIz_SJ13h40hybHYhmFoiXESrVDeYvfxQZ-ZXZtUfP0aiYEmzkcuqO8kRzfRU32yTNflSGi1rN_HLLVHNYS0lgYo_E.mp4",
];

export default function HeroSection() {
  const videoRef = useRef<any>(null);
  const { isMuted, toggleMuted } = useStore();

  // Handle mute logic for browser autoplay policies
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <section className="relative h-[calc(100vh-5rem)] w-full overflow-hidden bg-black snap-start snap-always">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        src={VIDEO_URLS[0]} // Using the Wedding Void as the hero
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter"
        >
          VOID MEDIA
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl font-light uppercase tracking-[0.3em]"
        >
          Visual Storytelling • Sound Experience
        </motion.p>
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-10 left-10 z-20 flex items-center gap-6">
        <button
          onClick={toggleMuted}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:bg-white/20"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="h-[1px] w-24 bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="h-full bg-white"
          />
        </div>
      </div>
    </section>
  );
}
