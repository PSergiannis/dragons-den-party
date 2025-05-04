"use client";

import Image from "next/image";

export default function MenuTab() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src="/DragonsDenMenu.png"
          alt="Dragons Den Menu"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
