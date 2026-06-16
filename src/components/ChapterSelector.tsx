/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CHAPTERS } from "../data";
import { Chapter } from "../types";
import { BookOpen, CheckCircle, Code, HelpCircle, Layers, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface ChapterSelectorProps {
  activeChapterId: number;
  onSelectChapter: (chapter: Chapter) => void;
  completedChapters: number[];
}

export default function ChapterSelector({
  activeChapterId,
  onSelectChapter,
  completedChapters,
}: ChapterSelectorProps) {
  // Map index to visual icons
  const getChapterIcon = (id: number) => {
    switch (id) {
      case 1: return <Layers className="w-4 h-4 text-emerald-400" id={`icon-ch-${id}`} />;
      case 2: return <BookOpen className="w-4 h-4 text-blue-400" id={`icon-ch-${id}`} />;
      case 3: return <HelpCircle className="w-4 h-4 text-amber-400" id={`icon-ch-${id}`} />;
      case 4: return <Code className="w-4 h-4 text-cyan-400" id={`icon-ch-${id}`} />;
      case 5: return <ShieldCheck className="w-4 h-4 text-indigo-400" id={`icon-ch-${id}`} />;
      default: return <BookOpen className="w-4 h-4 text-purple-400" id={`icon-ch-${id}`} />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-3" id="chapter-selector-container">
      {/* Desktop Heading */}
      <div className="hidden md:flex items-center justify-between pb-2 border-b border-slate-800" id="chapter-header">
        <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase font-mono">
          Learning Modules
        </h2>
        <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full">
          {completedChapters.length} / 10 Done
        </span>
      </div>

      {/* Mobile Horizontal Carousel */}
      <div className="flex md:hidden overflow-x-auto pb-2 gap-2 scrollbar-none snap-x" id="mobile-carousel">
        {CHAPTERS.map((chapter) => {
          const isActive = chapter.id === activeChapterId;
          const isDone = completedChapters.includes(chapter.id);

          return (
            <button
              key={chapter.id}
              id={`mobile-btn-chapter-${chapter.id}`}
              onClick={() => onSelectChapter(chapter)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all snap-start border ${
                isActive
                  ? "bg-sky-500/10 border-sky-400 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                  : isDone
                  ? "bg-emerald-950/20 border-emerald-800/60 text-emerald-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-400"
              }`}
            >
              <span className="flex items-center justify-center">
                {isDone ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : getChapterIcon(chapter.id)}
              </span>
              <span>{chapter.title}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Menu */}
      <div className="hidden md:flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1" id="desktop-catalog">
        {CHAPTERS.map((chapter) => {
          const isActive = chapter.id === activeChapterId;
          const isDone = completedChapters.includes(chapter.id);

          return (
            <motion.button
              whileHover={{ x: 3 }}
              transition={{ duration: 0.15 }}
              key={chapter.id}
              id={`desktop-btn-chapter-${chapter.id}`}
              onClick={() => onSelectChapter(chapter)}
              className={`w-full text-left flex items-start justify-between p-3 rounded-xl border transition-all ${
                isActive
                  ? "bg-slate-800/70 border-sky-500 text-white shadow-md shadow-sky-950/20"
                  : isDone
                  ? "bg-slate-900/40 border-emerald-900/60 text-slate-300 hover:bg-slate-800/30"
                  : "bg-slate-950/20 border-slate-800/80 text-slate-400 hover:bg-slate-800/30 hover:text-slate-200"
              }`}
            >
              <div className="flex gap-3 items-start">
                <span className="mt-0.5 p-1 bg-slate-950 rounded-lg flex items-center justify-center shrink-0">
                  {isDone ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : getChapterIcon(chapter.id)}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-500 font-medium">#{chapter.id}</span>
                    <h3 className="font-medium text-xs text-slate-100">{chapter.title}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {chapter.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-1 mt-1">
                <span className={`text-[8px] px-1 py-0.5 rounded font-mono ${
                  chapter.difficulty === "Beginner"
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900"
                    : "bg-indigo-950/80 text-indigo-400 border border-indigo-900"
                }`}>
                  {chapter.difficulty}
                </span>
                <ChevronRight className={`w-3 h-3 transition-transform ${isActive ? "text-sky-400 translate-x-0.5" : "text-slate-600"}`} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
