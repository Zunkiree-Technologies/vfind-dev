"use client";

import React from "react";
import Navigation from "../navigation/Navigation";
import {
  
  Eye,
  Layers,
  LayoutDashboard,
  Package,

} from "lucide-react";

import { NavigationItem } from "../../types/navigation";

interface LeftSidebarProps {
  activeView: string;
  onViewChange: (id: string) => void;
}

const navItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "nurses", label: "Nurses", icon: Package },
  { id: "employers", label: "Employers", icon: Eye },
  { id: "connections", label: "Connections", icon: Layers },

];


const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeView, onViewChange }) => (
  <Navigation activeView={activeView} onViewChange={onViewChange} items={navItems} />
);

export default LeftSidebar;
