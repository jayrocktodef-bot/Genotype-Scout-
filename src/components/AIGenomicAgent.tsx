import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, Key, RefreshCw, Trash2, Info, 
  ChevronDown, ChevronUp, Check, AlertCircle, Download, Bot
} from 'lucide-react';
import { calculateArchaicIntrogression } from '../lib/AncientAdmixtureCalculator';

interface AIGenomicAgentProps {
  dataset: any;
  oracleResults: any;
  populationProximity: any[];
  famousMatches: any[];
  autosomalMarkers: any[];
  userSnps: Record<string, string>;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

const SYSTEM_PROMPT = `You are the Genotype Scout AI Explainer, a premium built-in autonomous genetic researcher and ancestry guide.
Your goal is to interpret the user's high-resolution biogeographical deconvolution, maternal/paternal lineages, and ancient specimen matches.

Guidelines:
1. NEVER offer medical or clinical diagnostic advice. Genotype Scout is an educational research and ancestry mapping tool.
2. Be scientific, precise, and educational. Explain what haplogroups, deconvolution percentages, and genetic distances mean.
3. Keep responses structured and clean, utilizing markdown formatting. Use lists, bold key terms, and neat headers.
4. Draw historical and migratory context. For example, if the user asks about their haplogroups, explain their historical migration paths (e.g., Cro-Magnon, Indo-European expansions, Neolithic farmers, Hunter-gatherers).
5. Ground all explanations in the user's actual genomic summary provided in the context. Do not invent traits or populations not found in the user's data.
6. Maintain a professional, premium, and friendly tone.`;

export const AIGenomicAgent: React.FC<AIGenomicAgentProps> = ({
  dataset,
  oracleResults,
  populationProximity,
  famousMatches,
  autosomalMarkers,
  userSnps
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummaryView, setShowSummaryView] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const localStorageKey = 'witg_gemini_api_key';

  // Load API key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(localStorageKey);
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    } else {
      // Check for environment variable fallback
      const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      if (envKey) {
        setApiKey(envKey);
        setIsSaved(true);
      } else {
        setShowKeyConfig(true);
      }
    }

    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `Hello! I am your **AI Genomic Guide**. I have analyzed your ancestry deconvolution, haplogroups, Euclidean distances, and ancient matches. 

You can ask me questions like:
- *What does my maternal haplogroup reveal about my ancestors?*
- *Can you explain my subpopulation percentages?*
- *Which ancient individuals am I closest to genetically?*

*Please note: I run 100% client-side. None of your raw DNA genotypes or wellness findings are sent to the AI.*`
      }
    ]);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Save key helper
  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(localStorageKey, apiKey.trim());
      setIsSaved(true);
      setShowKeyConfig(false);
    } else {
      localStorage.removeItem(localStorageKey);
      setIsSaved(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem(localStorageKey);
    setApiKey('');
    setIsSaved(false);
    setShowKeyConfig(true);
  };

  // Compile prompt context string containing genomic profile details
  const genomicSummaryText = React.useMemo(() => {
    if (!dataset) return 'No dataset loaded.';
    
    let summary = '';
    
    // 1. Dataset metadata
    summary += `User Name/ID: ${dataset.name || 'Sample Specimen'}\n`;
    summary += `Array Chip: ${dataset.chip || 'High-Density Array'}\n`;
    summary += `Total SNPs Analyzed: ${dataset.snpCount ? dataset.snpCount.toLocaleString() : '10,000'}\n\n`;
    
    // 2. Continental Admixture Proportions
    const primaryOracle = oracleResults?.primary || {};
    const continentalScores = primaryOracle.continentalScores || {};
    if (Object.keys(continentalScores).length > 0) {
      summary += `Continental Ancestry Proportions:\n`;
      Object.entries(continentalScores)
        .sort((a: any, b: any) => b[1] - a[1])
        .forEach(([pop, val]) => {
          summary += `- ${pop}: ${Number(val).toFixed(2)}%\n`;
        });
      summary += `\n`;
    }
    
    // 3. Subpopulation Deconvolution
    const subPopulations = primaryOracle.subPopulations || {};
    if (Object.keys(subPopulations).length > 0) {
      summary += `Top Refined Subpopulations (NNLS Deconvolution):\n`;
      Object.entries(subPopulations)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([pop, val]) => {
          summary += `- ${pop}: ${Number(val).toFixed(2)}%\n`;
        });
      summary += `\n`;
    }
    
    // 4. Lineages (Paternal & Maternal Haplogroups)
    const yHaploName = dataset.predictedYDNA?.predicted?.name || "Not Detected / Female";
    const yHaploPath = (dataset.predictedYDNA?.path || []).map((p: string) => p.replace("Haplogroup ", "")).join(" ➔ ") || "Root";
    
    const mtHaploName = dataset.predictedMtDNA?.predicted || "Not Detected";
    const mtHaploPath = (dataset.predictedMtDNA?.path || []).map((p: string) => p.replace("Haplogroup ", "")).join(" ➔ ") || "Root";
    
    summary += `Paternal Lineage (Y-DNA):\n`;
    summary += `- Haplogroup: ${yHaploName}\n`;
    if (yHaploPath && yHaploPath !== "Root") {
      summary += `- Path: ${yHaploPath}\n`;
    }
    summary += `\n`;
    
    summary += `Maternal Lineage (mtDNA):\n`;
    summary += `- Haplogroup: ${mtHaploName}\n`;
    if (mtHaploPath && mtHaploPath !== "Root") {
      summary += `- Path: ${mtHaploPath}\n`;
    }
    summary += `\n`;
    
    // 5. Euclidean Proximities (Closest modern populations)
    if (populationProximity && populationProximity.length > 0) {
      summary += `Closest Genetic Populations (Euclidean Distances, lower is closer):\n`;
      [...populationProximity]
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 5)
        .forEach((pop: any) => {
          summary += `- ${pop.population || pop.popCode}: Distance ${pop.distance.toFixed(4)}\n`;
        });
      summary += `\n`;
    }
    
    // 6. Ancient fossil specimen matches
    if (famousMatches && famousMatches.length > 0) {
      summary += `Ancient Fossil Specimen Matches:\n`;
      [...famousMatches]
        .sort((a: any, b: any) => b.affinity - a.affinity)
        .slice(0, 5)
        .forEach((m: any) => {
          summary += `- ${m.name} (${m.sampleId}): Affinity ${m.affinity}%, Location: ${m.location}, Era: ${m.era}, Confidence: ${m.confidence}%\n`;
        });
      summary += `\n`;
    }

    // 7. Archaic Hominin Introgression
    if (userSnps && Object.keys(userSnps).length > 0) {
      try {
        const archaic = calculateArchaicIntrogression(userSnps);
        summary += `Archaic Hominin Introgression:\n`;
        summary += `- Neanderthal/Denisovan Allele Index: ${archaic.score.toFixed(1)}%\n`;
        summary += `- Archaic Alleles Detected: ${archaic.carriedAlleles} out of ${archaic.comparedMarkers * 2} tested alleles\n`;
        
        const carriers = archaic.details.filter(d => d.hasDerived);
        if (carriers.length > 0) {
          summary += `- Introgressed Variants Carried:\n`;
          carriers.forEach(c => {
            summary += `  * Gene ${c.gene} (${c.rsid}): ${c.trait} (Genotype: ${c.userGenotype})\n`;
          });
        }
        summary += `\n`;
      } catch (e) {
        console.error('Failed to parse archaic introgression context:', e);
      }
    }
    
    // 8. Non-clinical traits (Secretor, Blood Type)
    const traits = autosomalMarkers?.filter(m => m.category === 'Appearance' || m.category === 'Identity' || m.category === 'Lifestyle') || [];
    if (traits.length > 0) {
      summary += `Predicted Non-Clinical Traits:\n`;
      traits.slice(0, 8).forEach((t: any) => {
        summary += `- ${t.trait}: ${t.interpretation || t.description}\n`;
      });
      summary += `\n`;
    }
    
    return summary;
  }, [dataset, oracleResults, populationProximity, famousMatches, autosomalMarkers]);

  // Preset prompts configurations
  const presetPrompts = [
    {
      label: '🧬 Summarize Ancestry',
      text: 'Provide a structured summary of my ancestral deconvolution, detailing what my main biogeographical origins and subpopulation deconvolution imply about my genetic roots.'
    },
    {
      label: '♂️ Explain Lineages',
      text: 'Explain my maternal and paternal haplogroup results (if available). What is the historical migration path and origin of these clades?'
    },
    {
      label: '💀 Analyze Fossil Matches',
      text: 'Interpret my ancient fossil specimen matches. What are these historical archaeological samples and why does my DNA show genetic affinity to them?'
    },
    {
      label: '🗺️ Interpret Proximities',
      text: 'Explain what my closest population Euclidean distances mean. Why is distance important, and what does my top list of matching modern populations represent?'
    }
  ];

  // Send message API request (streaming)
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;
    
    if (!apiKey) {
      setShowKeyConfig(true);
      alert('Please enter your Gemini API Key in the settings panel first.');
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend
    };

    const modelMsg: Message = {
      id: `model-${Date.now()}`,
      role: 'model',
      text: '',
      isStreaming: true
    };

    setMessages(prev => [...prev, userMsg, modelMsg]);
    setInputValue('');
    setIsGenerating(true);

    try {
      // API request streaming setup using SSE alt=sse
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey.trim()}`;
      
      // Compile message history in Gemini API format
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const payload = {
        contents: [
          ...history,
          {
            role: 'user',
            parts: [{ text: textToSend }]
          }
        ],
        systemInstruction: {
          parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Genomic Data Summary:\n${genomicSummaryText}` }]
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const errMsg = errJson?.error?.message || response.statusText;
        throw new Error(errMsg);
      }

      if (!response.body) {
        throw new Error('No streaming response body received from Gemini.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last partial line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine.startsWith('data:')) continue;
          
          try {
            const dataStr = cleanLine.substring(5).trim();
            if (dataStr === '[DONE]') continue;

            const parsed = JSON.parse(dataStr);
            const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            streamedText += textChunk;
            
            // Update messages array in real time
            setMessages(prev => {
              const updated = [...prev];
              const targetIdx = updated.findIndex(m => m.id === modelMsg.id);
              if (targetIdx !== -1) {
                updated[targetIdx] = {
                  ...updated[targetIdx],
                  text: streamedText
                };
              }
              return updated;
            });
          } catch (e) {
            console.error('Failed to parse SSE JSON chunk:', e, cleanLine);
          }
        }
      }

      // Finish streaming state
      setMessages(prev => {
        const updated = [...prev];
        const targetIdx = updated.findIndex(m => m.id === modelMsg.id);
        if (targetIdx !== -1) {
          updated[targetIdx] = {
            ...updated[targetIdx],
            isStreaming: false
          };
        }
        return updated;
      });

    } catch (err: any) {
      console.error('Gemini API Error:', err);
      setMessages(prev => {
        const updated = [...prev];
        const targetIdx = updated.findIndex(m => m.id === modelMsg.id);
        if (targetIdx !== -1) {
          updated[targetIdx] = {
            ...updated[targetIdx],
            text: `⚠️ **Connection Error**: ${err.message || 'Failed to stream response from Gemini API.'} Please verify your API key, internet connection, and try again.`,
            isStreaming: false
          };
        }
        return updated;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear entire chat history?')) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `Chat history cleared. I am ready to answer any new questions about your genome.`
        }
      ]);
    }
  };

  const handleExportChat = () => {
    const textContent = messages
      .map(m => `[${m.role === 'user' ? 'User' : 'AI Guide'}]\n${m.text}\n`)
      .join('\n---\n\n');
      
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `genotype_scout_chat_${dataset?.name || 'results'}.txt`;
    link.click();
  };

  // Helper function to format basic markdown-style text into react HTML elements
  const formatMessageText = (text: string) => {
    // Basic text parsing for headers, bold text, and bullet points
    return text.split('\n').map((line, idx) => {
      let content: React.ReactNode = line;
      
      // Handle bold text **something**
      if (line.includes('**')) {
        const parts = line.split('**');
        content = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-teal-700 dark:text-teal-400 font-extrabold">{part}</strong> : part);
      }
      
      // Handle italic text *something*
      if (line.includes('*') && !line.startsWith('*')) {
        const parts = line.split('*');
        content = parts.map((part, i) => i % 2 === 1 ? <em key={i} className="italic text-slate-700 dark:text-slate-300">{part}</em> : part);
      }

      // Check bullet point
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-sm font-medium leading-relaxed my-1">
            {content instanceof Array ? content : line.substring(2)}
          </li>
        );
      }

      // Check headers
      if (line.startsWith('### ')) {
        return <h5 key={idx} className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mt-4 mb-2">{line.substring(4)}</h5>;
      }
      if (line.startsWith('## ')) {
        return <h4 key={idx} className="text-base font-black tracking-tight text-slate-900 dark:text-white mt-5 mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">{line.substring(3)}</h4>;
      }
      if (line.startsWith('# ')) {
        return <h3 key={idx} className="text-lg font-black tracking-tighter text-teal-600 dark:text-teal-400 mt-6 mb-3">{line.substring(2)}</h3>;
      }

      return (
        <p key={idx} className="text-sm font-medium leading-relaxed my-2 min-h-[1rem]">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl transition-all duration-300">
      {/* Agent Top Header bar */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-650 flex items-center justify-center text-white relative shadow-lg shadow-purple-500/20">
            <Bot className="w-5.5 h-5.5 text-white" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black tracking-tight uppercase">Genomic AI Explainer</h3>
              <span className="text-[8px] bg-purple-500/20 text-purple-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">v2.5 Flash</span>
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Secure, Local Ancestry Interpretation
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Settings toggles */}
          <button 
            onClick={() => setShowSummaryView(!showSummaryView)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
              showSummaryView 
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle prompt context preview"
          >
            Show Context
          </button>
          
          <button 
            onClick={() => setShowKeyConfig(!showKeyConfig)}
            className={`p-2 rounded-xl transition-all border ${
              showKeyConfig 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          {messages.length > 1 && (
            <button 
              onClick={handleExportChat}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
              title="Export Chat Log"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main layout container (Settings Pane + Summary Pane + Chat Pane) */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        
        {/* Collapsible API Key settings config container */}
        <AnimatePresence>
          {showKeyConfig && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-50 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 z-20"
            >
              <div className="p-6 max-w-xl mx-auto space-y-4 text-left">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Gemini Developer API Key</h4>
                    <p className="text-[10px] text-slate-500 mt-1">
                      To run explanations, input a Gemini API key. You can generate a free key in <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-bold">Google AI Studio</a>. Keys are stored locally in your browser.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                  {isSaved ? (
                    <>
                      <button 
                        onClick={handleSaveKey}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Update
                      </button>
                      <button 
                        onClick={handleClearKey}
                        className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-455 font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={handleSaveKey}
                      className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Save Key
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsible context prompt summary data string preview */}
        <AnimatePresence>
          {showSummaryView && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '220px', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-50 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 z-20 flex flex-col"
            >
              <div className="p-4 flex-1 flex flex-col min-h-0 text-left">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Genomic Context Passed to AI Prompt</span>
                <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-350 p-4 rounded-xl font-mono text-[9px] leading-relaxed border border-slate-800">
                  <pre className="whitespace-pre-wrap">{genomicSummaryText}</pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const isAI = m.role === 'model';
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[85%] text-left">
                    {isAI && (
                      <div className="w-8 h-8 rounded-lg bg-slate-150 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      </div>
                    )}
                    <div 
                      className={`p-4 sm:p-5 rounded-2xl sm:rounded-[1.75rem] border ${
                        isAI 
                          ? 'bg-slate-50/50 dark:bg-slate-850/50 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-150 shadow-sm' 
                          : 'bg-teal-600 border-teal-500 text-white shadow-md shadow-teal-500/10'
                      }`}
                    >
                      {isAI ? (
                        formatMessageText(m.text)
                      ) : (
                        <p className="text-sm font-semibold leading-relaxed">{m.text}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Streaming cursor loading dot state */}
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className="w-8 h-8 rounded-lg bg-slate-150 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <RefreshCw className="w-4 h-4 text-teal-500 animate-spin" />
                </div>
                <div className="p-4 rounded-[1.75rem] bg-slate-50/40 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800 text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Presets chips Panel */}
      {messages.length <= 1 && (
        <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20 shrink-0 text-left">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 mt-1">Choose a prompt preset</span>
          <div className="flex flex-wrap gap-2 mb-2">
            {presetPrompts.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.text)}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/80 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-teal-950/20 text-slate-600 dark:text-slate-350 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200/50 dark:border-slate-700/50 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input panel block */}
      <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder={isGenerating ? "AI Explainer is generating response..." : "Ask the AI Genomic Explainer about your ancestry, lineage, or matches..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isGenerating}
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-teal-500/20 placeholder-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isGenerating}
            className="p-3 bg-teal-600 hover:bg-teal-500 text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-450 dark:disabled:text-slate-550 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/10 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        {/* Tiny footer disclaimer */}
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
          <AlertCircle className="w-3 h-3 text-slate-400" />
          Educational Research & Ancestry Mapping Only • Non-Clinical • 100% Client-Side Private
        </div>
      </div>
    </div>
  );
};
