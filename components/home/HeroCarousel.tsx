"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Slide {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  bgColor?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image:
      "https://cdn.fcglcdn.com/brainbees/banners/mktng_nonapps_base_11@11_hp_1february261769774507093.jpg",
  },
  {
    id: 2,
    image: "https://cdn.fcglcdn.com/brainbees/banners/desktop1769838274969.jpg",
  },
  {
    id: 3,
    image: "https://cdn.fcglcdn.com/brainbees/banners/dp1767777235863.jpg",
  },
  {
    id: 4,
    image:
      "https://cdn.fcglcdn.com/brainbees/banners/hp_mktg_p01_flash_10_big_desktop1768809063876.jpg",
  },
  {
    id: 5,
    image: "https://cdn.fcglcdn.com/brainbees/banners/994x3991769856886560.jpg",
  },
  {
    id: 6,
    image:
      "https://cdn.fcglcdn.com/brainbees/banners/hp_mktg_p01_prim_flat5045_desktop1769687675273.jpg",
  },
  {
    id: 7,
    image:
      "https://cdn.fcglcdn.com/brainbees/banners/mktng_nonapps_base_mes_hp_1february261769776490856.jpg",
  },
  {
    id: 8,
    image:
      "https://cdn.fcglcdn.com/brainbees/banners/hp_default_roi_3001261769691933771.jpg",
  },
  {
    id: 9,
    image:
      "https://cdn.fcglcdn.com/brainbees/banners/hp_desktop_default_health_and_safety_0102261769856489068.jpg",
  },
  {
    id: 10,
    image:
      "https://cdn.fcglcdn.com/brainbees/banners/hp_mktg_p12_footwear_desktop1763641018861.jpg",
  },
  {
    id: 11,
    image:
      "https://cdn.fcglcdn.com/brainbees/banners/beautyone_wpc_hp1766569035300.jpg",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-soft-xl">
      {/* Slides Container */}
      <div className="relative h-[200px] sm:h-[280px] md:h-[380px] lg:h-[450px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            }`}
          >
            <div className="h-full w-full relative">
              <Image
                src={slide.image}
                alt={slide.title || `Slide ${slide.id}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-orange-500 rounded-2xl flex items-center justify-center shadow-soft-lg transition-all hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-gray-900 group-hover:text-white transition-colors" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-orange-500 rounded-2xl flex items-center justify-center shadow-soft-lg transition-all hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-gray-900 group-hover:text-white transition-colors" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentSlide
                ? "w-12 h-3 bg-gradient-to-r from-secondary-500 to-pink-500 shadow-soft"
                : "w-3 h-3 bg-white/70 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
