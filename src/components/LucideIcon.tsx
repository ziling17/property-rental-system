/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import * as Icons from "lucide-react";

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number | string;
  key?: React.Key;
}

export default function LucideIcon({ name, className = "", size = 20 }: LucideIconProps) {
  // Map some custom material-like strings to exact Lucide icon names if they don't match directly
  const iconMap: Record<string, string> = {
    Bath: "Bath",
    StandaloneSoakingTub: "Bath",
    ShowerHead: "ShowerHead",
    Wind: "Wind",
    Sparkles: "Sparkles",
    Flame: "Flame",
    Disc: "Disc",
    WashingMachine: "WashingMachine",
    SquareDot: "SquareDot",
    Layers: "Layers",
    Moon: "Moon",
    FolderHeart: "FolderHeart",
    BedDouble: "BedDouble",
    Tv: "Tv",
    Speaker: "Speaker",
    Tv2: "Monitor",
    Gamepad2: "Gamepad",
    BookOpen: "BookOpen",
    Snowflake: "Snowflake",
    Fan: "Wind",
    ShieldAlert: "ShieldAlert",
    Wifi: "Wifi",
    Laptop: "Laptop",
    Lightbulb: "Lightbulb",
    Zap: "Zap",
    Printer: "Printer",
    Sliders: "Sliders",
    ChefHat: "ChefHat",
    Coffee: "Coffee",
    Microwave: "Microwave",
    FolderOpen: "Folder",
    GlassWater: "GlassWater",
    Salad: "Utensils",
    Palmtree: "Trees",
    UserCheck: "UserCheck",
    Car: "Car",
    Leaf: "Leaf",
    Waves: "Waves",
    ArrowUpDown: "ArrowUpDown",
    SmokeFree: "AlertCircle",
    FlameKindling: "Flame",
    CookingPot: "UtensilsCrossed",
    Verified: "CheckCircle2",
    Favorite: "Heart",
    LocationOn: "MapPin",
    Map: "MapPin",
    Superhost: "Award",
    Stars: "Star",
    Sanitizer: "Droplets",
    TaskAlt: "CheckSquare",
    ChatBubbleOutline: "MessageSquare",
    Key: "Key",
    Explore: "Compass",
    Sell: "Tag",
    Shield: "ShieldCheck",
  };

  const resolvedName = iconMap[name] || name;
  const IconComponent = (Icons as any)[resolvedName];

  if (!IconComponent) {
    // Return a generic fallback icon if key not found
    const Fallback = Icons.HelpCircle;
    return <Fallback className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
