"use client";

import React from "react";
import Dashboard from "./views/Dashboard";
import Nurses from "./views/Nurses";
import Employers from "./views/Employers";
import Connections from "./views/Connections";

interface ContentRouterProps {
  activeView: string;
}

const ContentRouter: React.FC<ContentRouterProps> = ({ activeView }) => {
  switch (activeView) {
    case "dashboard":
      return <Dashboard />;

    case "employers":
      return <Employers />;

    case "nurses":
      return <Nurses />;

    case "connections":
      return <Connections />;

    default:
      return (
        <div className="p-8 bg-gray-50 min-h-full">
          <h2 className="text-xl text-gray-500">Select a view from the menu</h2>
        </div>
      );
  }
};

export default ContentRouter;
