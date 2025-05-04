"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaCocktail, FaChartBar, FaUtensils } from "react-icons/fa";
import VoteTab from "@/components/VoteTab";
import StatsTab from "@/components/StatsTab";
import MenuTab from "@/components/MenuTab";

export default function Home() {
  const [activeTab, setActiveTab] = useState("vote");

  const tabs = [
    { id: "vote", label: "Vote", icon: FaCocktail },
    { id: "stats", label: "Stats", icon: FaChartBar },
    { id: "menu", label: "Menu", icon: FaUtensils },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Dragons Den Party</h1>

      <div className="flex justify-center mb-8">
        <div className="flex space-x-4 bg-white/10 rounded-lg p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-pink-500 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "vote" && <VoteTab />}
        {activeTab === "stats" && <StatsTab />}
        {activeTab === "menu" && <MenuTab />}
      </motion.div>
    </main>
  );
}
