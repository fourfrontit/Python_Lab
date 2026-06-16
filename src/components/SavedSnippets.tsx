/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SavedSnippet } from "../types";
import { Save, FolderOpen, Trash2, Clock, PlayCircle } from "lucide-react";

interface SavedSnippetsProps {
  snippets: SavedSnippet[];
  onSaveSnippet: (title: string) => void;
  onLoadSnippet: (snippet: SavedSnippet) => void;
  onDeleteSnippet: (id: string) => void;
  activeCode: string;
}

export default function SavedSnippets({
  snippets,
  onSaveSnippet,
  onLoadSnippet,
  onDeleteSnippet,
  activeCode,
}: SavedSnippetsProps) {
  const [newTitle, setNewTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSaveSnippet(newTitle.trim());
    setNewTitle("");
    setIsSaving(false);
  };

  return (
    <div id="saved-snippets-panel" className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      {/* Block title header */}
      <div className="flex items-center justify-between" id="snippets-header">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              Saved Experiments ({snippets.length})
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Backup your Python projects locally</p>
          </div>
        </div>

        {!isSaving && (
          <button
            onClick={() => setIsSaving(true)}
            id="start-save-btn"
            className="text-[11px] bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Code</span>
          </button>
        )}
      </div>

      {/* Saving mini-form */}
      {isSaving && (
        <form onSubmit={handleSave} className="flex gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg animate-fadeIn" id="save-snippet-form">
          <input
            type="text"
            id="snippet-title-txt"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Name your file (e.g. My Loop)"
            required
            className="flex-1 bg-transparent border-none text-xs text-slate-200 focus:outline-none font-mono"
            maxLength={30}
          />
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsSaving(false)}
              className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-1 font-medium cursor-pointer"
              id="cancel-save-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-[10px] bg-purple-500 hover:bg-purple-600 text-white font-medium px-2.5 py-1 rounded cursor-pointer"
              id="confirm-save-btn"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Snippets list */}
      <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1" id="saved-snippets-list">
        {snippets.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg" id="empty-snippets-card">
            <p className="text-[11px] text-slate-500 italic">No saved files yet.</p>
          </div>
        ) : (
          snippets.map((snip) => (
            <div
              key={snip.id}
              id={`snip-rec-${snip.id}`}
              className="flex items-center justify-between p-2.5 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/60 rounded-lg group transition-all"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <PlayCircle className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-slate-200 truncate group-hover:text-purple-300 transition-colors">
                    {snip.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(snip.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono truncate max-w-[120px]">
                      {snip.code.trim().substring(0, 30)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 pl-2" id={`snip-actions-${snip.id}`}>
                <button
                  onClick={() => onLoadSnippet(snip)}
                  className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white px-2 py-0.5 rounded transition-all font-mono cursor-pointer"
                  id={`load-snip-btn-${snip.id}`}
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteSnippet(snip.id)}
                  className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded transition-all cursor-pointer"
                  id={`delete-snip-btn-${snip.id}`}
                  title="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
