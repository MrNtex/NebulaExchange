import React from "react";
import { FlipWords } from "./ui/flip-words";

export function HeroTitle() {
  const words = ["faster", "better", "safer", "modern"];
 
  return (
    <div className="justify-normal items-center px-4">
      <div className="text-6xl font-extralight mx-auto text-neutral-600 dark:text-neutral-400">
        Trade
        <FlipWords className="text-white" words={words} duration={1000}/> <br />
        with <span className="bg-gradient-to-r from-violet-700 via-indigo-400 to-cyan-300 inline-block text-transparent bg-clip-text">Nebula Exchange</span>
      </div>
    </div>
  );
}