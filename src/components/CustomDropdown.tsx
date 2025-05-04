"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Option {
  id: number;
  name: string;
  imagePath?: string;
  dragon_name?: string;
  ingredients?: string;
}

interface CustomDropdownProps {
  options: Option[];
  placeholder: string;
  onChange: (id: number) => void;
  className?: string;
}

export default function CustomDropdown({
  options,
  placeholder,
  onChange,
  className = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option.id);
  };

  // Determine if this is a cocktail option (has ingredients)
  const isCocktail = (option: Option): boolean => {
    return Boolean(option.ingredients);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="cursor-pointer flex items-center justify-between w-full px-4 py-2 text-left bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <div className="flex items-center">
            {selectedOption.imagePath && (
              <div className="mr-2 flex-shrink-0">
                <Image
                  src={`/images/${selectedOption.imagePath}`}
                  alt={selectedOption.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            )}
            <div className="flex flex-col">
              <span>{selectedOption.name}</span>
              {isCocktail(selectedOption) && selectedOption.ingredients && (
                <span className="text-xs text-gray-300 truncate max-w-[200px]">
                  {selectedOption.ingredients}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-white/70">{placeholder}</span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#232323] border border-white/20 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-pink-500 hover:text-white transition-colors"
              onClick={() => handleSelect(option)}
            >
              {option.imagePath && (
                <div className="mr-2 flex-shrink-0">
                  <Image
                    src={`/images/${option.imagePath}`}
                    alt={option.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span>{option.name}</span>
                {isCocktail(option) && option.ingredients && (
                  <span className="text-xs text-gray-300 truncate max-w-[200px]">
                    {option.ingredients}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
