"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export default function Logo({ className, showText = true }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center gap-2", className)}>
            {/* Logo SVG */}
            <svg width="32" height="32" viewBox="0 0 867 867" fill="none" xmlns="http://www.w3.org/2000/svg">
                <title>better-ratelimit</title>
                <rect x="0.5" y="0.5" width="866" height="866" fill="#F8FDFE" stroke="black" />
                <g filter="url(#filter0_ng_62_23)">
                    <path d="M677.44 255.924V135.5C677.44 121.162 671.745 107.411 661.606 97.272C651.467 87.1334 637.716 81.4375 623.378 81.4375H244.94C230.602 81.4375 216.851 87.1334 206.712 97.272C196.574 107.411 190.878 121.162 190.878 135.5V257.141C190.896 265.53 192.858 273.802 196.61 281.306C200.362 288.81 205.802 295.342 212.503 300.391L374.184 421.643C381.651 427.243 381.651 438.444 374.184 444.044L212.503 565.297C205.802 570.345 200.362 576.878 196.61 584.382C192.858 591.886 190.896 600.157 190.878 608.547V730.187C190.878 744.526 196.574 758.277 206.712 768.415C216.851 778.554 230.602 784.25 244.94 784.25H623.378C637.716 784.25 651.467 778.554 661.606 768.415C671.745 758.277 677.44 744.526 677.44 730.187V609.763C677.419 601.411 675.471 593.176 671.75 585.699C668.029 578.221 662.634 571.702 655.984 566.648L493.769 444.011C486.36 438.41 486.36 427.278 493.769 421.676L655.984 299.039C662.64 293.99 668.039 287.473 671.761 279.994C675.482 272.515 677.426 264.278 677.44 255.924ZM570.618 569.866C581.324 577.966 575.596 595.031 562.171 595.031H304.952C291.498 595.031 285.789 577.903 296.553 569.831L425.723 472.96C430.718 469.214 437.59 469.228 442.569 472.995L570.618 569.866ZM258.94 730.187C251.208 730.187 244.94 723.919 244.94 716.187V663.094C244.94 655.362 251.208 649.094 258.94 649.094H609.378C617.11 649.094 623.378 655.362 623.378 663.094V716.187C623.378 723.919 617.11 730.187 609.378 730.187H258.94ZM623.378 248.96C623.378 253.346 621.322 257.479 617.824 260.126L442.569 392.693C437.59 396.46 430.718 396.474 425.723 392.728L250.54 261.341C247.015 258.697 244.94 254.547 244.94 250.141V149.5C244.94 141.768 251.208 135.5 258.94 135.5H609.378C617.11 135.5 623.378 141.768 623.378 149.5V248.96Z" fill="black" />
                </g>
                <defs>
                    <filter id="filter0_ng_62_23" x="186.878" y="77.4375" width="494.562" height="710.812" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feTurbulence type="fractalNoise" baseFrequency="1.0869565010070801 1.0869565010070801" stitchTiles="stitch" numOctaves="3" result="noise" seed="8699" />
                        <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                        <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                            <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " />
                        </feComponentTransfer>
                        <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
                        <feFlood flood-color="rgba(0, 0, 0, 0.25)" result="color1Flood" />
                        <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                        <feMerge result="effect1_noise_62_23">
                            <feMergeNode in="shape" />
                            <feMergeNode in="color1" />
                        </feMerge>
                        <feTurbulence type="fractalNoise" baseFrequency="2 2" numOctaves="3" seed="9623" />
                        <feDisplacementMap in="effect1_noise_62_23" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                        <feMerge result="effect2_texture_62_23">
                            <feMergeNode in="displacedImage" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>



            {/* Text */}
            {showText && (
                <span className="font-bold text-xl tracking-tight">
                    better-ratelimit
                </span>
            )}
        </Link>
    );
}

// Dark mode version
export function LogoDark({ className, showText = true }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center gap-2", className)}>
            {/* Logo SVG */}
            <svg width="32" height="32" viewBox="0 0 867 867" fill="none" xmlns="http://www.w3.org/2000/svg">
                <title>better-ratelimit</title>
                <rect x="0.5" y="0.5" width="866" height="866" fill="#F8FDFE" stroke="black" />
                <g filter="url(#filter0_ng_62_23)">
                    <path d="M677.44 255.924V135.5C677.44 121.162 671.745 107.411 661.606 97.272C651.467 87.1334 637.716 81.4375 623.378 81.4375H244.94C230.602 81.4375 216.851 87.1334 206.712 97.272C196.574 107.411 190.878 121.162 190.878 135.5V257.141C190.896 265.53 192.858 273.802 196.61 281.306C200.362 288.81 205.802 295.342 212.503 300.391L374.184 421.643C381.651 427.243 381.651 438.444 374.184 444.044L212.503 565.297C205.802 570.345 200.362 576.878 196.61 584.382C192.858 591.886 190.896 600.157 190.878 608.547V730.187C190.878 744.526 196.574 758.277 206.712 768.415C216.851 778.554 230.602 784.25 244.94 784.25H623.378C637.716 784.25 651.467 778.554 661.606 768.415C671.745 758.277 677.44 744.526 677.44 730.187V609.763C677.419 601.411 675.471 593.176 671.75 585.699C668.029 578.221 662.634 571.702 655.984 566.648L493.769 444.011C486.36 438.41 486.36 427.278 493.769 421.676L655.984 299.039C662.64 293.99 668.039 287.473 671.761 279.994C675.482 272.515 677.426 264.278 677.44 255.924ZM570.618 569.866C581.324 577.966 575.596 595.031 562.171 595.031H304.952C291.498 595.031 285.789 577.903 296.553 569.831L425.723 472.96C430.718 469.214 437.59 469.228 442.569 472.995L570.618 569.866ZM258.94 730.187C251.208 730.187 244.94 723.919 244.94 716.187V663.094C244.94 655.362 251.208 649.094 258.94 649.094H609.378C617.11 649.094 623.378 655.362 623.378 663.094V716.187C623.378 723.919 617.11 730.187 609.378 730.187H258.94ZM623.378 248.96C623.378 253.346 621.322 257.479 617.824 260.126L442.569 392.693C437.59 396.46 430.718 396.474 425.723 392.728L250.54 261.341C247.015 258.697 244.94 254.547 244.94 250.141V149.5C244.94 141.768 251.208 135.5 258.94 135.5H609.378C617.11 135.5 623.378 141.768 623.378 149.5V248.96Z" fill="black" />
                </g>
                <defs>
                    <filter id="filter0_ng_62_23" x="186.878" y="77.4375" width="494.562" height="710.812" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feTurbulence type="fractalNoise" baseFrequency="1.0869565010070801 1.0869565010070801" stitchTiles="stitch" numOctaves="3" result="noise" seed="8699" />
                        <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                        <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                            <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " />
                        </feComponentTransfer>
                        <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
                        <feFlood flood-color="rgba(0, 0, 0, 0.25)" result="color1Flood" />
                        <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                        <feMerge result="effect1_noise_62_23">
                            <feMergeNode in="shape" />
                            <feMergeNode in="color1" />
                        </feMerge>
                        <feTurbulence type="fractalNoise" baseFrequency="2 2" numOctaves="3" seed="9623" />
                        <feDisplacementMap in="effect1_noise_62_23" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                        <feMerge result="effect2_texture_62_23">
                            <feMergeNode in="displacedImage" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>


            {/* Text */}
            {showText && (
                <span className="font-bold text-xl tracking-tight">
                    better-ratelimit
                </span>
            )}
        </Link>
    );
} 