"use client";

import Image from "next/image";

export default function MenuTab() {
  return (
    <div className="flex justify-center items-center h-full w-full py-4">
      <div className="relative">
        <Image
          src="/images/DragonsDenMenu.png"
          alt="Dragons Den Menu"
          width={800}
          height={1100}
          priority
          className="mx-auto"
        />
      </div>
    </div>
  );
}
