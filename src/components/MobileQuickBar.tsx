/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ChevronRight, Percent, Quote, Type } from "lucide-react";

interface MobileQuickBarProps {
  onInsertText: (text: string) => void;
}

interface ShortcutItem {
  label: string;
  insertValue: string;
  type: "symbol" | "indent" | "keyword" | "template";
}

export default function MobileQuickBar({ onInsertText }: MobileQuickBarProps) {
  const shortcuts: ShortcutItem[] = [
    { label: "Tab ⇥", insertValue: "    ", type: "indent" },
    { label: "print()", insertValue: "print()", type: "template" },
    { label: "input()", insertValue: "input()", type: "template" },
    { label: ":", insertValue: ":", type: "symbol" },
    { label: '"', insertValue: '""', type: "symbol" },
    { label: "'", insertValue: "''", type: "symbol" },
    { label: "( )", insertValue: "()", type: "symbol" },
    { label: "[ ]", insertValue: "[]", type: "symbol" },
    { label: "{ }", insertValue: "{}", type: "symbol" },
    { label: "=", insertValue: " = ", type: "symbol" },
    { label: "+", insertValue: " + ", type: "symbol" },
    { label: "-", insertValue: " - ", type: "symbol" },
    { label: "*", insertValue: " * ", type: "symbol" },
    { label: "/", insertValue: " / ", type: "symbol" },
    { label: "f-str", insertValue: 'f""', type: "template" },
    { label: "if", insertValue: "if \nelif\nelse", type: "keyword" },
    { label: "for", insertValue: "for i in range():", type: "keyword" },
    { label: "while", insertValue: "while :", type: "keyword" },
    { label: "def", insertValue: "def func():", type: "keyword" },
    { label: "import", insertValue: "import ", type: "keyword" },
  ];

  const getColorClass = (type: ShortcutItem["type"]) => {
    switch (type) {
      case "indent":
        return "bg-sky-500/15 border-sky-500/40 text-sky-300 hover:bg-sky-500/25";
      case "template":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25";
      case "symbol":
        return "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700";
      case "keyword":
      default:
        return "bg-purple-500/15 border-purple-500/40 text-purple-300 hover:bg-purple-500/25";
    }
  };

  return (
    <div id="mobile-quickbar-shortcuts" className="w-full flex flex-col gap-1.5 bg-slate-900 border border-slate-800/80 p-3 rounded-xl">
      <div className="flex items-center justify-between pb-1" id="quickbar-label">
        <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider uppercase flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
          Mobile Touch Keyboard helper
        </span>
        <span className="text-[9px] text-slate-500">Tap to insert at cursor</span>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-1.5 scrollbar-thin scrollbar-thumb-slate-800" id="quickbar-scroll">
        {shortcuts.map((shortcut, idx) => (
          <button
            key={idx}
            onClick={() => onInsertText(shortcut.insertValue)}
            id={`shortcut-btn-${idx}`}
            className={`flex-shrink-0 px-2.5 py-1 text-xs rounded-lg font-mono border transition-all cursor-pointer select-none active:scale-95 ${getColorClass(
              shortcut.type
            )}`}
          >
            {shortcut.label}
          </button>
        ))}
      </div>
    </div>
  );
}
