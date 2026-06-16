/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from "react";
import { ConsoleLine } from "../types";
import { Copy, Terminal, Trash2, CheckCircle2, AlertTriangle, Clock, RefreshCw } from "lucide-react";

interface ConsoleOutputProps {
  consoleLines: ConsoleLine[];
  onClearConsole: () => void;
  isLoadingPyodide: boolean;
  executionTime: number | null;
  hasErrors: boolean;
  copiedConsole: boolean;
  onCopyConsole: () => void;
}

export default function ConsoleOutput({
  consoleLines,
  onClearConsole,
  isLoadingPyodide,
  executionTime,
  hasErrors,
  copiedConsole,
  onCopyConsole,
}: ConsoleOutputProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal to latest lines
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLines, isLoadingPyodide]);

  const getLineStyles = (type: ConsoleLine["type"]) => {
    switch (type) {
      case "stderr":
        return "text-red-400 bg-red-950/20 px-1 border-l-2 border-red-500 font-medium";
      case "system":
        return "text-sky-400/90 font-mono italic";
      case "input_prompt":
        return "text-amber-400 font-semibold";
      case "input_echo":
        return "text-amber-200 underline underline-offset-4 decoration-dotted";
      case "stdout":
      default:
        return "text-slate-100";
    }
  };

  return (
    <div id="output-console-panel" className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full min-h-[300px]">
      {/* Console Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/90 shrink-0" id="console-head">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" id="terminal-heading-icon" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
            Output Console
          </span>
        </div>

        <div className="flex items-center gap-2">
          {executionTime !== null && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono" id="exec-time-lbl">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{executionTime}ms</span>
            </div>
          )}

          {consoleLines.length > 0 && (
            <>
              <button
                onClick={onCopyConsole}
                className="p-1 px-2 rounded hover:bg-slate-800 text-[10px] text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 font-mono cursor-pointer"
                id="copy-terminal-btn"
                title="Copy full output history"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedConsole ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={onClearConsole}
                className="p-1 px-2 rounded hover:bg-slate-800 text-[10px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 font-mono cursor-pointer"
                id="clear-terminal-btn"
                title="Clear current lines"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Console lines screen */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed flex flex-col gap-1 select-text scrollbar-thin scrollbar-thumb-slate-800" id="console-lines-viewport">
        {isLoadingPyodide ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-8" id="pyodide-load-overlay">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
            <div className="text-center">
              <p className="text-xs text-sky-300 font-medium animate-pulse">Initializing Python WASM Core...</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Downloading system libraries securely for offline browser execution</p>
            </div>
          </div>
        ) : consoleLines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-slate-600 gap-2" id="console-empty-prompt">
            <span className="text-[20px]">⏳</span>
            <p className="text-xs text-slate-500 font-mono italic">Playground Ready. Write code and tap "Run Code" above!</p>
          </div>
        ) : (
          consoleLines.map((line, idx) => (
            <div key={idx} id={`cons-ln-${idx}`} className={`group flex items-start justify-between py-0.5 border-b border-white/[0.01] hover:bg-white/[0.02] rounded px-1`}>
              <p className={`whitespace-pre-wrap break-all ${getLineStyles(line.type)} flex-1`}>
                {line.text}
              </p>
              <span className="text-[8px] text-slate-700 select-none group-hover:opacity-100 md:opacity-0 transition-opacity whitespace-nowrap pl-2 pt-0.5">
                {line.timestamp}
              </span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer status info bar */}
      <div className="px-4 py-1.5 border-t border-slate-800 bg-slate-900/90 text-[10px] text-slate-500 font-mono flex items-center justify-between shrink-0" id="console-foot">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
          <span>WASM Runner Live</span>
        </div>

        {consoleLines.length > 0 && (
          <div id="status-verdict">
            {hasErrors ? (
              <span className="text-red-400 flex items-center gap-1 text-[9px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>CODE ERROR FOUND</span>
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 text-[9px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>EXECUTION PERFECT</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
