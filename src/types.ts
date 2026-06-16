/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Chapter {
  id: number;
  title: string;
  description: string;
  conceptBrief: string;
  code: string;
  instructions: string[];
  expectedOutputSnippet: string;
  difficulty: "Beginner" | "Intermediate" | "General";
  detailedNotes?: string; // Long-form beginner-friendly notes for easy learning
}

export interface ConsoleLine {
  text: string;
  type: "stdout" | "stderr" | "system" | "input_prompt" | "input_echo";
  timestamp: string;
}

export interface SavedSnippet {
  id: string;
  title: string;
  code: string;
  chapterId?: number;
  timestamp: string;
}
