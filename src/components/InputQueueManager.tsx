/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash2, HelpCircle, CornerDownRight, ArrowDown } from "lucide-react";

interface InputQueueManagerProps {
  inputQueue: string[];
  setInputQueue: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function InputQueueManager({
  inputQueue,
  setInputQueue,
}: InputQueueManagerProps) {
  const [newValue, setNewValue] = useState("");

  const handleAddValue = () => {
    if (!newValue.trim()) return;
    setInputQueue([...inputQueue, newValue]);
    setNewValue("");
  };

  const handleRemoveValue = (index: number) => {
    setInputQueue(inputQueue.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setInputQueue([]);
  };

  const handleAddDefaultPreset = () => {
    setInputQueue(["Arthur", "Mage", "7"]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddValue();
    }
  };

  return (
    <div id="input-queue-panel" className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      {/* Header section with info */}
      <div className="flex items-center justify-between" id="input-queue-header">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              Interactive Inputs Queue
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Feeds sequential values to Python's <code className="text-amber-400 bg-amber-500/10 px-1 py-0.2 rounded font-mono">input()</code>
            </p>
          </div>
        </div>
        
        {inputQueue.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors font-mono uppercase tracking-wider"
            id="clear-inputs-btn"
          >
            Clear Queue
          </button>
        )}
      </div>

      {/* Visual representation of the queue */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950/70 border border-slate-800/80 rounded-lg min-h-[46px]" id="queue-visual-track">
        {inputQueue.length === 0 ? (
          <div className="w-full flex justify-between items-center px-1" id="empty-queue-msg">
            <span className="text-[11px] text-slate-500 italic">No inputs queued; default empty strings will be returned.</span>
            <button
              onClick={handleAddDefaultPreset}
              className="text-[10px] text-amber-500 hover:text-amber-400 font-medium font-mono underline cursor-pointer"
            >
              Add Preset
            </button>
          </div>
        ) : (
          inputQueue.map((val, idx) => (
            <div
              key={idx}
              id={`queue-itm-${idx}`}
              className={`flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-md text-xs font-mono border transition-all ${
                idx === 0
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-200 ring-1 ring-amber-500/20"
                  : "bg-slate-800/50 border-slate-700/60 text-slate-400"
              }`}
            >
              {idx === 0 && <ArrowDown className="w-3 h-3 text-amber-400 animate-bounce" />}
              <span className="max-w-[80px] truncate">{val}</span>
              <button
                onClick={() => handleRemoveValue(idx)}
                className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                id={`rmv-idx-btn-${idx}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Adding to the queue */}
      <div className="flex gap-2" id="queue-add-box">
        <input
          type="text"
          id="queue-txt-input"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Queue next answer input..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/80 transition-all font-mono"
        />
        <button
          onClick={handleAddValue}
          id="queue-add-btn"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
          <span>Add</span>
        </button>
      </div>

      <p className="text-[10px] text-slate-500 leading-relaxed font-sans" id="input-queue-info">
        <CornerDownRight className="w-3 h-3 inline mr-1 text-slate-600" />
        When Python prompts <code className="font-mono text-slate-400">val = input()</code>, it consumes the 1st highlighted item from left to right. Pre-configuring your queue is faster and avoids typing in real-time!
      </p>
    </div>
  );
}
