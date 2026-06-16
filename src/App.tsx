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
  HelpCircle,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Bot,
  BrainCircuit,
  Bookmark,
  MessageSquare,
  Sparkle,
  Pause,
  Sliders,
  Loader2,
  Headphones
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

  // LEARNING HUB & SPEECH STATE HOOKS
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "ai-coach">("overview");
  
  // Voice Synthesis Narrator states
  const [isSpeakingLocal, setIsSpeakingLocal] = useState<boolean>(false);
  const [isSpeakingGemini, setIsSpeakingGemini] = useState<boolean>(false);
  const [isTTSLoading, setIsTTSLoading] = useState<boolean>(false);
  const [ttsRate, setTtsRate] = useState<number>(1.0);
  const [ttsVoiceName, setTtsVoiceName] = useState<string>("Kore"); // Kore, Zephyr, Puck, Fenrir
  const activeAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // AI Tutor Coach states
  const [chatMessages, setChatMessages] = useState<Array<{
    role: "user" | "assistant" | "system";
    text: string;
    timestamp: string;
  }>>([
    {
      role: "assistant",
      text: "👋 Hello! I am your AI Python Learning Coach. I am here to help you breakdown Python step-by-step! \n\nYou can ask me custom questions about variables, loops, arrays (lists), or conditions. You can also press the **Microphone icon 🎙️** to speak your questions instead of typing them!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Speech-to-Text Microphone Listening states
  const [isListeningSTT, setIsListeningSTT] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

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

  // Auto-scroll AI chat messages container down when replies arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab]);

  // Clean speaking sources on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (activeAudioSourceRef.current) {
        try { activeAudioSourceRef.current.stop(); } catch (e) {}
      }
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

    // Stop speaking if topic switches
    stopAllSpeech();

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

  // VOICE SYNTHESIS HELPERS
  const playPcmAudio = async (base64Data: string) => {
    try {
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0; // scale standard PCM to Float32 sample boundaries
      }
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      buffer.copyToChannel(float32Array, 0);
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      
      if (activeAudioSourceRef.current) {
        try { activeAudioSourceRef.current.stop(); } catch (e) {}
      }
      activeAudioSourceRef.current = source;
      setIsSpeakingGemini(true);
      
      source.onended = () => {
        setIsSpeakingGemini(false);
      };
      
      source.start();
    } catch (err) {
      console.error("PCM synthesis decode failed:", err);
      setIsSpeakingGemini(false);
    }
  };

  const speakLocalVoice = (msgText: string) => {
    window.speechSynthesis.cancel();
    if (activeAudioSourceRef.current) {
      try { activeAudioSourceRef.current.stop(); } catch (e) {}
    }
    setIsSpeakingGemini(false);

    // Strip markdown tags cleanly so browser reads natively without tags
    const clean = msgText.replace(/[`#*_\-[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = ttsRate;

    const voices = window.speechSynthesis.getVoices();
    const prefersVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Natural")) || voices.find(v => v.lang.startsWith("en"));
    if (prefersVoice) utterance.voice = prefersVoice;

    utterance.onend = () => {
      setIsSpeakingLocal(false);
    };
    utterance.onerror = () => {
      setIsSpeakingLocal(false);
    };

    setIsSpeakingLocal(true);
    window.speechSynthesis.speak(utterance);
  };

  const speakGeminiVoice = async (msgText: string) => {
    window.speechSynthesis.cancel();
    setIsSpeakingLocal(false);
    if (activeAudioSourceRef.current) {
      try { activeAudioSourceRef.current.stop(); } catch (e) {}
    }

    try {
      setIsTTSLoading(true);
      const clean = msgText.replace(/[`#*_\-[\]()]/g, '').substring(0, 400);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: clean,
          voiceName: ttsVoiceName
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.audio) {
        playPcmAudio(data.audio);
      } else {
        throw new Error("Empty audio response");
      }
    } catch (err: any) {
      console.error(err);
      // Failover to local speech engine gracefully!
      speakLocalVoice(msgText);
    } finally {
      setIsTTSLoading(false);
    }
  };

  const stopAllSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeakingLocal(false);
    if (activeAudioSourceRef.current) {
      try { activeAudioSourceRef.current.stop(); } catch (e) {}
    }
    setIsSpeakingGemini(false);
  };

  // SPEECH TO TEXT CONTROL
  const startListeningSTT = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Microphone recognition is not supported natively in this browser window. Please type manually!");
      return;
    }

    const rec = new SpeechRecognitionAPI();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => {
      setIsListeningSTT(true);
    };

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setChatInput((prev) => prev ? prev + " " + transcript : transcript);
    };

    rec.onerror = (e: any) => {
      console.error("Speech Recognition Error:", e);
      setIsListeningSTT(false);
    };

    rec.onend = () => {
      setIsListeningSTT(false);
    };

    rec.start();
    recognitionRef.current = rec;
  };

  const stopListeningSTT = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // AI TUTOR SEED SENDER
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSendingMessage) return;

    const userText = chatInput.trim();
    setChatInput("");
    
    const userMsg = {
      role: "user" as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsSendingMessage(true);

    try {
      const systemInstruction = `You are an encouraging, expert Python tutor helping a beginner learn to code.
The user is currently studying the module: "${activeChapter.title}".
Current module description: "${activeChapter.conceptBrief}".
The learner's current template code in the editor is:
\`\`\`python
${code}
\`\`\`

Instruct the learner clearly, giving intense focus to lists (arrays), conditions (if statements), and loops (for/while loops). 
Explain "why" things work (e.g. why counting starts at zero, why loops might get stuck with True). Use simple, friendly analogies and metaphors. Format code responses cleanly in markdown syntax. Keep replies relatively concise.`;

      const contentsPayload = updatedMessages.map(m => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.text }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: contentsPayload,
          systemInstruction,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setChatMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.text || "I apologize, I didn't catch that correctly. Can you rephrase your question about Python?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: `⚠️ Tutor Connection Timeout: ${err.message || "Failed to reach our server. Check backend compilation logs."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // NATIVE ELEMENT MARKDOWN DECODER
  const renderSimpleMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-xs font-bold text-sky-300 mt-4 mb-2 font-mono flex items-center gap-1.5 border-b border-slate-800/60 pb-1">
            <Sparkle className="w-3 h-3 text-sky-400" />
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-sm font-bold text-cyan-300 mt-4 mb-2 font-mono border-b border-slate-800 pb-1 flex items-center gap-1.5">
            <Sparkle className="w-3.5 h-3.5 text-cyan-400" />
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h5 key={idx} className="text-[11px] font-semibold text-indigo-300 mt-3 mb-1 font-mono">
            {line.replace("#### ", "")}
          </h5>
        );
      }
      if (line.trim().startsWith("- ")) {
        return (
          <div key={idx} className="flex gap-2 text-[11px] text-slate-300 ml-2 my-1 leading-relaxed">
            <span className="text-indigo-400 font-bold">•</span>
            <span>{line.trim().replace("- ", "")}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        const parts = line.trim().split(/^\d+\.\s/);
        const numMatch = line.trim().match(/^\d+/);
        const num = numMatch ? numMatch[0] : "1";
        return (
          <div key={idx} className="flex gap-2 text-[11px] text-slate-300 ml-2 my-1 leading-relaxed">
            <span className="text-cyan-400 font-mono font-bold text-[10px]">{num}.</span>
            <span>{parts[1]}</span>
          </div>
        );
      }
      if (line.trim().startsWith("```")) {
        return null; // hide backticks markers cleanly
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1" />;
      }
      
      const hasInlineStyles = line.includes("**") || line.includes("`") || line.includes("\\$");
      if (hasInlineStyles) {
        return (
          <p key={idx} className="text-[11px] text-slate-300 leading-relaxed font-sans mb-1.5">
            {line.split(/(\*\*.*?\*\*|`.*?`)/).map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={pIdx} className="text-sky-200 font-semibold">{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith("`") && part.endsWith("`")) {
                return <code key={pIdx} className="bg-slate-900 border border-slate-800/80 px-1 py-0.5 rounded text-[10px] font-mono mx-0.5 text-amber-200">{part.slice(1, -1)}</code>;
              }
              return part;
            })}
          </p>
        );
      }

      return (
        <p key={idx} className="text-[11px] text-slate-300 leading-relaxed font-sans mb-1.5">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 overflow-x-hidden" id="applet-viewport">
      {/* 🚀 Header bar */}
      <header className="sticky top-0 bg-[#0f1524]/90 backdrop-blur border-b border-slate-800/80 z-40 px-4 py-3 md:px-6" id="applet-navbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 md:hidden hover:bg-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
              id="hamburguer-menu-btn"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-950/20 shrink-0">
                <span className="font-mono font-bold text-base text-white">py</span>
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
                  Python Playground
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-1.5 py-0.2 rounded-full leading-none">
                    AI Enabled
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Interactive Python training sandbox with real-time AI Tutor Co-Pilot
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Gamified progress indicator */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1" id="nav-badge-box">
              <Award className="w-4 h-4 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
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
              <span>Mobile-responsive</span>
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
                  Learning Modules
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

          <div className="bg-[#0f1524] border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-4 shadow-lg shadow-black/10" id="chapters-nav-card">
            <ChapterSelector
              activeChapterId={activeChapter.id}
              onSelectChapter={handleSelectChapter}
              completedChapters={completedChapters}
            />
          </div>

          {/* 🌟 MAGNIFICENT TABBED LEARNING HUB & AI COACH CARD 🌟 */}
          <div className="bg-[#0f1524] border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col flex-1 shadow-xl shadow-black/15 min-h-[480px]" id="learning-hub-card">
            
            {/* Tab Controllers bar */}
            <div className="grid grid-cols-3 bg-slate-900/90 border-b border-slate-850 p-1 rounded-t-2xl" id="learning-tabs-header">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex flex-col sm:flex-row items-center gap-1 justify-center py-2 text-[10px] font-bold font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Lesson Overview & Challenges"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Basic</span>
              </button>

              <button
                onClick={() => setActiveTab("notes")}
                className={`flex flex-col sm:flex-row items-center gap-1 justify-center py-2 text-[10px] font-bold font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Syllabus Deep Notes"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Deep Notes</span>
              </button>

              <button
                onClick={() => setActiveTab("ai-coach")}
                className={`flex flex-col sm:flex-row items-center gap-1 justify-center py-2 text-[10px] font-bold font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer relative ${
                  activeTab === "ai-coach"
                    ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="AI Tutor Helper"
              >
                <span className="flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Tutor</span>
                </span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </button>
            </div>

            {/* Content Switcher panels */}
            <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto max-h-[500px]" id="hub-panels-viewport">
              <AnimatePresence mode="wait">
                {/* 📝 Tab 1: Overview */}
                {activeTab === "overview" && (
                  <motion.div
                    key="overview-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-3 flex-1"
                  >
                    <div className="flex items-center gap-2 pb-1" id="overview-brief-row">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {activeChapter.id}
                      </div>
                      <div>
                        <h4 className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mb-0.5 leading-none">
                          Active Syllabus Study #{activeChapter.id}
                        </h4>
                        <h3 className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                          {activeChapter.title}
                          <span className="text-[8px] bg-sky-950 text-sky-400 px-1 py-0.2 rounded font-normal shrink-0">
                            {activeChapter.difficulty}
                          </span>
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/50">
                      {activeChapter.conceptBrief}
                    </p>

                    {/* Educational challenges task checklist */}
                    <div className="p-3 bg-[#0d1222] rounded-xl border border-indigo-950/80 shadow-inner" id="module-challenges">
                      <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block mb-2 font-semibold">
                        📂 Hands-on objectives to try:
                      </span>
                      <ul className="flex flex-col gap-2">
                        {activeChapter.instructions.map((inst, index) => (
                          <li key={index} className="flex gap-2 text-[11px] text-slate-300 leading-normal">
                            <span className="text-emerald-400 font-bold text-xs shrink-0 select-none">✓</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expected console snapshot output */}
                    <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl" id="expected-output-spec">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-widest block mb-1">
                        Expected Output Preview:
                      </span>
                      <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap leading-tight bg-black/40 p-2 rounded border border-slate-900">
                        {activeChapter.expectedOutputSnippet}
                      </pre>
                    </div>
                  </motion.div>
                )}

                {/* 📚 Tab 2: Detailed Learning Notes */}
                {activeTab === "notes" && (
                  <motion.div
                    key="notes-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-3 flex-1"
                  >
                    {/* Narrator TTS audio bar controls */}
                    <div className="bg-slate-950/90 border border-slate-800/60 p-2 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs" id="notes-voice-narrator-panel">
                      <div className="flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-sky-400 animate-pulse" />
                        <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Voice Reader
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isSpeakingLocal || isSpeakingGemini ? (
                          <button
                            onClick={stopAllSpeech}
                            className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-lg flex items-center gap-1 text-[10px] font-semibold cursor-pointer select-none"
                          >
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Reader</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => speakGeminiVoice(activeChapter.detailedNotes || activeChapter.conceptBrief)}
                              disabled={isTTSLoading}
                              className="px-2.5 py-1 bg-sky-500/15 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 rounded-lg flex items-center gap-1 text-[10px] font-bold cursor-pointer select-none disabled:opacity-50"
                              title="Listen to realistic voice"
                            >
                              {isTTSLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                              <span>Realistic AI Voice</span>
                            </button>

                            <button
                              onClick={() => speakLocalVoice(activeChapter.detailedNotes || activeChapter.conceptBrief)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg flex items-center gap-1 text-[10px] font-semibold cursor-pointer select-none"
                              title="Listen instantly with web voice browser"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Reader</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Speech tuning tools */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-850 pb-2">
                      <div className="flex items-center gap-2">
                        <span>Speed (Local):</span>
                        <input
                          type="range"
                          min="0.7"
                          max="1.5"
                          step="0.1"
                          value={ttsRate}
                          onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                          className="w-16 accent-sky-400"
                        />
                        <span>{ttsRate}x</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Voice (AI):</span>
                        <select
                          value={ttsVoiceName}
                          onChange={(e) => setTtsVoiceName(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-400 text-[10px] p-0.5 rounded focus:outline-none"
                        >
                          <option value="Kore">Kore (Male)</option>
                          <option value="Zephyr">Zephyr (Cheer)</option>
                          <option value="Puck">Puck (Brisk)</option>
                          <option value="Charon">Charon (Dry)</option>
                        </select>
                      </div>
                    </div>

                    {/* Output notes */}
                    <div className="flex flex-col gap-3 font-sans leading-relaxed text-slate-300 text-xs text-justify pr-1" id="detailed-notes-content">
                      {activeChapter.detailedNotes ? (
                        renderSimpleMarkdown(activeChapter.detailedNotes)
                      ) : (
                        <p className="text-slate-400 font-mono text-[11px] text-center mt-5">
                          Detailed notes are currently being initialized for this module.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 🤖 Tab 3: AI Learning Coach Chat */}
                {activeTab === "ai-coach" && (
                  <motion.div
                    key="chat-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col h-[400px] justify-between"
                  >
                    {/* Chat Messages Log scroll panel */}
                    <div
                      ref={chatScrollRef}
                      className="flex-1 overflow-y-auto mb-3 flex flex-col gap-3 pr-1"
                      id="ai-coach-history-shelf"
                    >
                      {chatMessages.map((msg, index) => {
                        const isAssistant = msg.role === "assistant";
                        return (
                          <div
                            key={index}
                            className={`flex flex-col max-w-[85%] ${
                              isAssistant ? "self-start" : "self-end items-end"
                            }`}
                          >
                            <div className="flex items-center gap-1 px-1.5 mb-1">
                              {isAssistant ? (
                                <span className="text-[9px] font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1">
                                  <Bot className="w-3 h-3" />
                                  <span>Tutor Coach</span>
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">
                                  Learner
                                </span>
                              )}
                              <span className="text-[8px] text-slate-600 font-mono">
                                • {msg.timestamp}
                              </span>
                            </div>

                            <div
                              className={`p-3 rounded-2xl text-[11px] leading-relaxed relative border ${
                                isAssistant
                                  ? "bg-slate-900/80 border-slate-800/80 text-slate-200 rounded-tl-none whitespace-pre-line"
                                  : "bg-sky-600/10 border-sky-500/20 text-sky-200 rounded-tr-none"
                              }`}
                            >
                              {/* Simple rendered block */}
                              {isAssistant ? renderSimpleMarkdown(msg.text) : <p>{msg.text}</p>}

                              {/* Reader trigger for Assistant Response bubble */}
                              {isAssistant && (
                                <div className="absolute -bottom-2 -right-2 flex gap-1 z-10">
                                  <button
                                    onClick={() => speakLocalVoice(msg.text)}
                                    className="p-1 rounded bg-[#1c243a] border border-slate-700 hover:border-sky-500 text-sky-400 hover:text-sky-300 shadow-md cursor-pointer"
                                    title="Listen Local Voice"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => speakGeminiVoice(msg.text)}
                                    className="p-1 rounded bg-[#1c243a] border border-slate-700 hover:border-emerald-500 text-emerald-400 hover:text-emerald-300 shadow-md cursor-pointer"
                                    title="Listen Real AI Voice"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {isSendingMessage && (
                        <div className="self-start max-w-[80%] flex items-center gap-1.5 p-2 bg-slate-900/40 rounded-xl text-slate-500 font-mono text-[10px]">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                          <span>Tutor is formulating advice...</span>
                        </div>
                      )}
                    </div>

                    {/* Dynamic User Send controls tray */}
                    <form
                      onSubmit={handleSendChatMessage}
                      className="border-t border-slate-850 pt-2.5 flex items-center gap-2"
                      id="ai-chat-tray-input"
                    >
                      {/* Speech to Text Microphone trigger */}
                      <button
                        type="button"
                        onClick={isListeningSTT ? stopListeningSTT : startListeningSTT}
                        className={`p-2 rounded-xl transition-all border shrink-0 cursor-pointer ${
                          isListeningSTT
                            ? "bg-rose-500/20 border-rose-500/80 text-rose-300 animate-pulse"
                            : "bg-slate-900 border-slate-800/80 text-slate-400 hover:text-slate-200"
                        }`}
                        title={isListeningSTT ? "Stop continuous listening" : "Dictate query with Mic"}
                      >
                        {isListeningSTT ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl text-[11px] leading-none focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-500"
                        placeholder={
                          isListeningSTT
                            ? "Listening... Speak now!"
                            : `Ask tutor about variables or loops...`
                        }
                        disabled={isSendingMessage}
                      />

                      <button
                        type="submit"
                        disabled={!chatInput.trim() || isSendingMessage}
                        className={`p-2 rounded-xl text-white transition-all scale-100 active:scale-95 cursor-pointer shrink-0 ${
                          chatInput.trim() && !isSendingMessage
                            ? "bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-950/20"
                            : "bg-slate-900 text-slate-600 border border-slate-850/60 cursor-not-allowed"
                        }`}
                        title="Send Message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Center/Right: Python Editor, inputs queue, backups and shell terminal outputs (cols: 12 -> lg: 8) */}
        <section className="col-span-1 lg:col-span-8 flex flex-col gap-4" id="coding-workspace-pane">
          {/* Dynamic compiling indicators */}
          {isLoadingPyodide && (
            <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-300 text-xs font-medium animate-pulse flex items-center gap-2 shadow-inner">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
              <span>We are preparing Python in your browser. This takes a few seconds...</span>
            </div>
          )}

          {/* 💻 Code Editor Container Card */}
          <div
            id="code-editor-card"
            className={`bg-[#0f1524] border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg ${
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
              <div className="w-10 text-right pr-2 py-4 text-slate-600 border-r border-slate-800/60 select-none text-[11px] leading-relaxed" id="line-numbers-col">
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
            Python Playground runs Python programs client-side via WebAssembly. Questions and speaking voices connect to your private AI Tutor securely.
          </p>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-emerald-500/80 font-medium">✓ Audio TTS Enabled</span>
            <span>•</span>
            <span className="text-emerald-500/80 font-medium">✓ Audio Transcription Ready</span>
            <span>•</span>
            <span className="text-emerald-500/80 font-medium">✓ Private Safe API Proxy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
