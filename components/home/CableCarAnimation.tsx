'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CableCarAnimation = () => {
    // Configuration for the animation
    const duration = 15; // Time for one cabin to cross
    const numberOfCabins = 3;
    const delayBetweenCabins = duration / numberOfCabins;

    // Define the path exactly once to ensure visual line and motion path match perfectly
    // M -200,105: Start off-screen left, Y=105
    // Q 680,280: Control point at center X=680, Y=280 (pulling down)
    // 1560,105: End off-screen right, Y=105
    const pathDefinition = "M -200,105 Q 680,280 1560,105";

    return (
        <div className="relative w-full max-w-[1360px] mx-auto h-[450px] overflow-hidden z-0 pointer-events-none">
            {/* The Cable/Wire (SVG drawn) */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <path
                    d={pathDefinition}
                    fill="transparent"
                    stroke="rgba(0,0,0,0.3)" // Semi-transparent black like a real cable
                    strokeWidth="2"
                // Optional: dashed line if desired, but solid is more realistic for cable car
                />
            </svg>

            {/* The Cabins */}
            {[...Array(numberOfCabins)].map((_, index) => (
                <motion.div
                    key={index}
                    className="absolute left-0 top-0"
                    style={{
                        offsetPath: `path('${pathDefinition}')`, // Use exact same constant string
                        offsetRotate: "0deg",
                        offsetAnchor: "50% 16%",
                    }}
                    initial={{ offsetDistance: "0%" }}
                    animate={{
                        offsetDistance: "100%"
                    }}
                    transition={{
                        duration: duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * delayBetweenCabins,
                    }}
                >
                    <Image
                        src="https://cwlovgpnraogycqfbwvx.supabase.co/storage/v1/object/public/home-page/assets/home/TRAVEL%20PATH%20(1)%202.png"
                        alt="Cable Car Cabin"
                        width={220}
                        height={220}
                        className="object-contain"
                    />
                </motion.div>
            ))}
        </div>
    );

};

export default CableCarAnimation;
