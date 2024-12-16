

import { PieChartComposition } from "@/components/charts/pie-chart";
import CoinsTable from "@/components/coins_list/CoinsTable";
import { HeroTitle } from "@/components/HeroTitle";
import MainPageHeader from "@/modules/main_page/MainPageHeader";
import { FlipWords } from "@/components/ui/flip-words";
import { Coin } from "@/types/coins";
import Image from "next/image";
import { useState } from "react";



export default function Home() {
  return (
    <div className="w-full">
      <MainPageHeader />
      <CoinsTable />
    </div>
  );
}
