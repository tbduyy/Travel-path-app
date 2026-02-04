"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface ImageSlideshowProps {
    images: string[];
    alt: string;
    interval?: number; // Time in ms between transitions
    className?: string;
}

export default function ImageSlideshow({
    images,
    alt,
    interval = 3000,
    className = "",
}: ImageSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const validImages = images.filter(Boolean); // Ensure no empty strings
    const hasMultiple = validImages.length > 1;

    useEffect(() => {
        if (!hasMultiple) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validImages.length);
        }, interval);

        return () => clearInterval(timer);
    }, [hasMultiple, validImages.length, interval]);

    if (validImages.length === 0) {
        return (
            <div className={`relative bg-gray-200 ${className}`}>
                <Image
                    src="/placeholder.jpg"
                    alt={alt}
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }} // Soft fade
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src={validImages[currentIndex]}
                        alt={`${alt} - Image ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        priority={currentIndex === 0} // Prioritize first image
                    />
                </motion.div>
            </AnimatePresence>

            {/* Optional: Simple Indicator Dots if needed, but user asked for just fade */}
        </div>
    );
}
