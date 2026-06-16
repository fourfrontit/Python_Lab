/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Chapter, ConsoleLine, SavedSnippet } from "./types";
import { CHAPTERS } from "./data";
import ChapterSelector from "./components/ChapterSelector";
import InputQueueManager from "./components/InputQueueManager";
import ConsoleOutput from "./components/ConsoleOutput";
import MobileQuickBar from "./components/MobileQuickBar";
import SavedSnippets from "./components/SavedSnippets";

import {
  Play,
  RotateCcw,
  BookOpen,
  Award,
  Smartphone,
  ChevronRight,
  Sparkles,
  Layers,
  Menu,
  X,
  Plus,
  Trash2,
  FileCode,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Pyodide Core state
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoadingPyodide, setIsLoadingPyodide] = useState<boolean>(true);

  // Layout navigation
  const [activeChapter, setActiveChapter] = useState<Chapter>(CHAPTERS[0]);
  const [code, setCode] = useState<string>(CHAPTERS[0].code);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Play input stream state
  const [inputQueue, setInputQueue] = useState<string[]>(["HeroPlayer", "Warrior", "5"]);

  // Console terminal states
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [copiedConsole, setCopiedConsole] = useState<boolean>(false);

  // Local backups list
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);

  // Editor states
  const [isEditorGlow, setIsEditorGlow] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Callback refs to handle React closures inside Pyodide WebAssembly
  const onStdoutRef = useRef<(text: string) => void>(() => {});
  const onStderrRef = useRef<(text: string) => void>(() => {});

  // Load Saved Progress and local backups on initial mount
  useEffect(() => {
    const storedCompleted = localStorage.getItem("python_playground_completed");
    if (storedCompleted) {
      try {
        setCompletedChapters(JSON.parse(storedCompleted));
      } catch (e) {
        console.error(e);
      }
    }

    const storedSnippets = localStorage.getItem("python_playground_snippets");
    if (storedSnippets) {
      try {
        setSavedSnippets(JSON.parse(storedSnippets));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Set up local state references for logging streams
  useEffect(() => {
    onStdoutRef.current = (text: string) => {
      setConsoleLines((prev) => [
        ...prev,
        {
          text,
          type: "stdout",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    onStderrRef.current = (text: string) => {
      setConsoleLines((prev) => [
        ...prev,
        {
          text,
          type: "stderr",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setHasErrors(true);
    };
  }, []);

  // Initialize Pyodide on WebAssembly loading hook
  useEffect(() => {
    const initPyodideRuntime = async () => {
      if (typeof (window as any).loadPyodide !== "undefined") {
        try {
          const py = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
            stdout: (text: string) => {
              if (onStdoutRef.current) onStdoutRef.current(text);
            },
            stderr: (text: string) => {
              if (onStderrRef.current) onStderrRef.current(text);
            },
          });

          // Bind our interactive API integrations to global state so python code can query them
          (window as any).on_input_prompt_trigger = (prompt: string) => {
            setConsoleLines((prev) => [
              ...prev,
              {
                text: prompt,
                type: "input_prompt",
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          };

          (window as any).on_input_request = () => {
            let fetchedVal = "";
            setInputQueue((prevQueue) => {
              if (prevQueue.length > 0) {
                fetchedVal = prevQueue[0];
                return prevQueue.slice(1);
              }
              // empty queue fallback
              fetchedVal = "DefaultInput";
              return prevQueue;
            });
            return fetchedVal;
          };

          (window as any).on_input_echo_trigger = (val: string) => {
            setConsoleLines((prev) => [
              ...prev,
              {
                text: `[Input read: "${val}"]`,
                type: "input_echo",
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          };

          // Override Python standard input mechanism utilizing JavaScript integrations
          const customInputScript = `
import builtins
import js

def custom_input(prompt=""):
    if prompt:
        js.on_input_prompt_trigger(prompt)
    else:
        js.on_input_prompt_trigger("input() requested: ")
    val = js.on_input_request()
    js.on_input_echo_trigger(val)
    return val

builtins.input = custom_input
`;
          await py.runPythonAsync(customInputScript);

          setPyodide(py);
          setIsLoadingPyodide(false);
          setConsoleLines([
            {
              text: "Success: WebAssembly core initialized with Python 3.12.1",
              type: "system",
              timestamp: new Date().toLocaleTimeString(),
            },
            {
              text: "Ready: Standard input and output bridges constructed. Happy learning! 🐍",
              type: "system",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        } catch (err: any) {
          console.error(err);
          setConsoleLines([
            {
              text: `Critical: Pyodide compilation failed. Details: ${err.message}`,
              type: "stderr",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
          setIsLoadingPyodide(false);
        }
      } else {
        // Poll for script existence recursively if script load lags slightly behind DOM
        setTimeout(initPyodideRuntime, 250);
      }
    };

    initPyodideRuntime();
  }, []);

  // Update selected modules
  const handleSelectChapter = (chapter: Chapter) => {
    setActiveChapter(chapter);
    setCode(chapter.code);
    setIsMobileMenuOpen(false);

    // Provide default inputs based on active chapter roles
    if (chapter.id === 3) {
      setInputQueue(["Murloc", "Alchemy", "8"]);
    } else {
      setInputQueue(["Alice", "CodeGeek", "20"]);
    }
  };

  // Re-run original code block
  const handleResetCode = () => {
    setCode(activeChapter.code);
    setConsoleLines((prev) => [
      ...prev,
      {
        text: `[Editor code reset to default ${activeChapter.title} template]`,
        type: "system",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Run the current editor code using WASM
  const handleRunPython = async () => {
    if (!pyodide || isExecuting) return;

    setIsExecuting(true);
    setHasErrors(false);
    setConsoleLines([]);
    const startTime = performance.now();

    try {
      // Clear values and print a clean trace line
      await pyodide.runPythonAsync(code);

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setExecutionTime(duration);

      // Auto-mark module as completed if there were no errors encountered during execution
      if (!completedChapters.includes(activeChapter.id)) {
        const updated = [...completedChapters, activeChapter.id];
        setCompletedChapters(updated);
        localStorage.setItem("python_playground_completed", JSON.stringify(updated));
      }
    } catch (err: any) {
      console.error(err);
      setConsoleLines((prev) => [
        ...prev,
        {
          text: `Python execution trace failed:\n${err.message}`,
          type: "stderr",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setHasErrors(true);
      setExecutionTime(null);
    } finally {
      setIsExecuting(false);
    }
  };

  // Clear console window contents
  const handleClearConsole = () => {
    setConsoleLines([]);
    setExecutionTime(null);
    setHasErrors(false);
  };

  // Copy full terminal streams to local clipboard
  const handleCopyConsole = () => {
    const texts = consoleLines.map((line) => `[${line.timestamp}] ${line.text}`).join("\n");
    navigator.clipboard.writeText(texts);
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2000);
  };

  // Shortcut key insert handler
  const handleInsertText = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const originalText = code;
    const updated = originalText.substring(0, start) + textToInsert + originalText.substring(end);

    setCode(updated);

    // Refocus cursor
    setTimeout(() => {
      textarea.focus();
      const newPos = start + textToInsert.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 40);
  };

  // Save customized code backups locally
  const handleSaveSnippet = (title: string) => {
    const newSnippet: SavedSnippet = {
      id: crypto.randomUUID(),
      title,
      code,
      chapterId: activeChapter.id,
      timestamp: new Date().toISOString(),
    };

    const updated = [newSnippet, ...savedSnippets];
    setSavedSnippets(updated);
    localStorage.setItem("python_playground_snippets", JSON.stringify(updated));

    setConsoleLines((prev) => [
      ...prev,
      {
        text: `Success: Snippet project "${title}" was saved successfully!`,
        type: "system",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Load a snippet backup from local storage
  const handleLoadSnippet = (snippet: SavedSnippet) => {
    setCode(snippet.code);
    if (snippet.chapterId) {
      const match = CHAPTERS.find((c) => c.id === snippet.chapterId);
      if (match) setActiveChapter(match);
    }

    setConsoleLines((prev) => [
      ...prev,
      {
        text: `Loaded saved backup file: "${snippet.title}"`,
        type: "system",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Delete storage snippets
  const handleDeleteSnippet = (id: string) => {
    const updated = savedSnippets.filter((item) => item.id !== id);
    setSavedSnippets(updated);
    localStorage.setItem("python_playground_snippets", JSON.stringify(updated));
  };

  // Reset entire dashboard achievements progress
  const handleResetAllProgress = () => {
    if (confirm("Are you sure you want to reset your accomplishments progress?")) {
      setCompletedChapters([]);
      localStorage.removeItem("python_playground_completed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 overflow-x-hidden" id="applet-viewport">
      {/* 🚀 Header bar */}
      <header className="sticky top-0 bg-[#0f1524]/90 backdrop-blur border-b border-slate-800/80 z-40 px-4 py-3 md:px-6" id="applet-navbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 md:hidden hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
              id="hamburguer-menu-btn"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-950/20 shrink-0">
                <span className="font-mono font-bold text-base text-white">py</span>
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
                  Python Playground
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-1.5 py-0.2 rounded-full leading-none">
                    WebAssembly
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Static compilation training editor suitable for GitHub Pages hosting
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Gamified progress indicator */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1" id="nav-badge-box">
              <Award className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-bold text-amber-200">
                  {completedChapters.length} / 10 Completed
                </span>
                <span className="text-[8px] text-slate-500 font-mono">
                  {Math.round((completedChapters.length / 10) * 100)}% progress
                </span>
              </div>
            </div>

            <span className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mobile-responsive UI is Live</span>
            </span>
          </div>
        </div>
      </header>

      {/* 🧭 Mobile Chapter Drawer overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#0d1220] border-r border-slate-800 p-5 z-50 flex flex-col gap-4 md:hidden"
              id="mobile-drawer"
            >
              <div className="flex items-center justify-between" id="drawer-head">
                <h2 className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">
                  Learning Content
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress stats */}
              <div className="p-3 bg-slate-950/80 border border-slate-800/85 rounded-xl text-center">
                <p className="text-xs text-slate-400">Chapters Accomplished</p>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {completedChapters.length} / 10
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${(completedChapters.length / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Selector Menu inside Drawer */}
              <div className="flex-1 overflow-y-auto">
                <ChapterSelector
                  activeChapterId={activeChapter.id}
                  onSelectChapter={handleSelectChapter}
                  completedChapters={completedChapters}
                />
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={handleResetAllProgress}
                  className="w-full text-center text-[10px] text-slate-500 hover:text-rose-400 transition-colors font-mono uppercase tracking-wider py-1 cursor-pointer"
                >
                  Reset achievements
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🛠️ Main responsive Grid content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5" id="main-grid-container">
        {/* Left Side: Learn & Syllabus Panel (cols: 12 -> lg: 4) */}
        <section className="col-span-1 lg:col-span-4 flex flex-col gap-4" id="syllabus-module-pane">
          {/* Quick instructions indicator for smartphone users */}
          <div className="block md:hidden bg-slate-900/50 border border-slate-800/80 p-2.5 rounded-xl text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Tap on modules below to load tutorial examples!</span>
            </p>
          </div>

          <div className="bg-[#0f1524] border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-4" id="chapters-nav-card">
            <ChapterSelector
              activeChapterId={activeChapter.id}
              onSelectChapter={handleSelectChapter}
              completedChapters={completedChapters}
            />
          </div>

          {/* Educational Concept of the Active Module */}
          <div className="bg-[#0f1524] border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-3" id="concept-explanation-card">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800" id="topic-intro-block">
              <div className="w-6 h-6 rounded bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">
                {activeChapter.id}
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider tracking-tight font-mono">
                  Module Description ({activeChapter.difficulty})
                </h2>
                <h3 className="text-xs text-sky-300 font-medium">
                  {activeChapter.title} Statement
                </h3>
              </div>
            </div>

            <div className="text-xs leading-relaxed text-slate-300 flex flex-col gap-2.5" id="concept-text">
              <p>{activeChapter.conceptBrief}</p>

              {/* Tasks / Instructions checklist */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mt-1" id="module-challenges">
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-2">
                  Hands-on tasks to try:
                </span>
                <ul className="flex flex-col gap-2">
                  {activeChapter.instructions.map((inst, index) => (
                    <li key={index} className="flex gap-2 text-[11px] text-slate-300">
                      <span className="text-sky-500 font-bold font-mono">✓</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expected Output indicator */}
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg" id="expected-output-spec">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">
                  Expected Output Preview:
                </span>
                <pre className="text-[10px] font-mono text-slate-400 mt-1 whitespace-pre-wrap leading-tight bg-slate-950/40 p-2 rounded border border-slate-800/40">
                  {activeChapter.expectedOutputSnippet}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Center/Right: Python Editor, inputs queue, backups and shell terminal outputs (cols: 12 -> lg: 8) */}
        <section className="col-span-1 lg:col-span-8 flex flex-col gap-4" id="coding-workspace-pane">
          {/* Dynamic compiling indicators */}
          {isLoadingPyodide && (
            <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-300 text-xs font-medium animate-pulse flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
              <span>We are preparing Python in your browser. This takes a few seconds...</span>
            </div>
          )}

          {/* 💻 Code Editor Container Card */}
          <div
            id="code-editor-card"
            className={`bg-[#0f1524] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
              isEditorGlow
                ? "border-sky-500 shadow-[0_0_24px_rgba(56,189,248,0.15)] bg-slate-900/40"
                : "border-slate-800/90"
            }`}
          >
            {/* Top Editor controls bar */}
            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2 shrink-0" id="editor-control-row">
              <div className="flex items-center gap-2">
                <FileCode className="text-sky-400 w-4 h-4" />
                <span className="text-xs font-mono font-medium text-slate-200">
                  main.py
                </span>
                {completedChapters.includes(activeChapter.id) && (
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Completed</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetCode}
                  id="reset-template-code-btn"
                  className="p-1 px-2.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/80 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all flex items-center gap-1 cursor-pointer"
                  title="Restore original code block"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Code</span>
                </button>

                <button
                  onClick={handleRunPython}
                  id="run-python-code-btn"
                  disabled={isLoadingPyodide || isExecuting}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                    isLoadingPyodide
                      ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      : isExecuting
                      ? "bg-amber-500 text-slate-950 font-bold shadow-amber-950/20"
                      : "bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-sky-950/20"
                  }`}
                >
                  {isExecuting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Custom styled text Editor body */}
            <div className="relative flex-1 min-h-[220px] md:min-h-[270px] flex font-mono bg-slate-950/80" id="editor-viewport">
              {/* Lines number side panel */}
              <div className="w-10 text-right pr-2 py-4 text-slate-600 border-r border-slate-800/60 select-none text-[11px] leading-relaxed select-none" id="line-numbers-col">
                {code.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable TextArea element */}
              <textarea
                ref={textareaRef}
                id="interactive-python-editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onFocus={() => setIsEditorGlow(true)}
                onBlur={() => setIsEditorGlow(false)}
                className="flex-1 bg-transparent border-0 text-slate-200 px-4 py-4 text-[11px] leading-relaxed font-mono focus:outline-none focus:ring-0 resize-none min-h-full overflow-y-auto selection:bg-slate-800"
                placeholder="Write your Python scripts here..."
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            {/* Shortcuts Touch keyboard utilities panel for phone coders */}
            <div className="shrink-0" id="mobile-dock-shortcuts">
              <MobileQuickBar onInsertText={handleInsertText} />
            </div>
          </div>

          {/* Lower layout panels: Inputs queue manager and backups manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="lower-workspace-managers">
            <InputQueueManager inputQueue={inputQueue} setInputQueue={setInputQueue} />
            <SavedSnippets
              snippets={savedSnippets}
              onSaveSnippet={handleSaveSnippet}
              onLoadSnippet={handleLoadSnippet}
              onDeleteSnippet={handleDeleteSnippet}
              activeCode={code}
            />
          </div>

          {/* Visual Python execution outcome logs terminal */}
          <div className="flex-1 min-h-[300px]" id="visual-terminal-terminal">
            <ConsoleOutput
              consoleLines={consoleLines}
              onClearConsole={handleClearConsole}
              isLoadingPyodide={isLoadingPyodide}
              executionTime={executionTime}
              hasErrors={hasErrors}
              copiedConsole={copiedConsole}
              onCopyConsole={handleCopyConsole}
            />
          </div>
        </section>
      </main>

      {/* 🚀 Subtle footer block */}
      <footer className="mt-auto px-4 py-6 border-t border-slate-900 bg-[#070b13] text-center shrink-0" id="applet-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-600 gap-3">
          <p>
            Python Playground is built entirely with client-side WebAssembly. No inputs are sent to remote servers.
          </p>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-emerald-500/80 font-medium">✓ iPhone Compatible</span>
            <span>•</span>
            <span className="text-emerald-500/80 font-medium">✓ Android Compatible</span>
            <span>•</span>
            <span className="text-emerald-500/80 font-medium">✓ GitHub Pages Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
