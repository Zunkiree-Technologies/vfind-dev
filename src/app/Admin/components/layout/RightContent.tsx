"use client";

import React from "react";
import Header from "./Header";
import ContentRouter from "../ContentRouter";
import {
  LayoutDashboard, Eye, Package, Layers,
 
} from "lucide-react";
import { NavigationItem } from "../../types/navigation";

interface RightContentProps {
  activeView: string;
}

const navItems: NavigationItem[] = [
 { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "nurses", label: "Nurses", icon: Package },
  { id: "employers", label: "Employers", icon: Eye },
  { id: "connections", label: "Connections", icon: Layers },
];

const RightContent: React.FC<RightContentProps> = ({ activeView }) => (
  <div className="flex flex-col flex-1 h-full">
    <Header activeView={activeView} navigationItems={navItems} />
    <main className="flex-1 overflow-auto">
      <ContentRouter activeView={activeView} />
    </main>
    
  </div>
);

export default RightContent;
