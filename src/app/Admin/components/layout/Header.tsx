"use client";

import React, { useState } from "react";
import { NavigationItem } from "../../types/navigation";
import { Search } from "lucide-react";

interface HeaderProps {
  activeView: string;
  navigationItems: NavigationItem[];
}

const Header: React.FC<HeaderProps> = ({  }) => {
  const [] = useState("");


  return (
    <header className="bg-white shadow-sm h-10% px-5 py-4">
        <div
                 className="flex items-center space-x-2 cursor-pointer"
               >
                 <div className="w-8 h-8 flex items-center justify-center bg-blue-400 rounded-[10px]">
                   <Search size={16} className="text-white" />
                 </div>
       
                 <span className="font-semibold text-lg text-blue-400">VFind</span>
               </div>


        
    </header>
  );
};

export default Header;