import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTINENT_META } from '../genotypeData';
import { normalizeBranchName } from '../utils/haplogroupTreeUtils';

export interface HaplogroupTreeViewProps {
  node: any;
  userPath?: string[];
  level?: number;
  searchTerm?: string;
  testedMarkers?: any[];
}

export const HaplogroupTreeView = memo(({ 
  node, 
  userPath = [], 
  level = 0, 
  searchTerm = '', 
  testedMarkers = [] 
}: HaplogroupTreeViewProps) => {
  const safeUserPath = userPath || [];
  const normalizedUserPath = safeUserPath.map(p => normalizeBranchName(p));
  const isMatch = normalizedUserPath.includes(normalizeBranchName(node.branchName));
  const matchesSearch = searchTerm && node.branchName.toLowerCase().includes(searchTerm.toLowerCase());
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (matchesSearch) setIsExpanded(true);
  }, [matchesSearch]);

  const treeMarkers = node.snp || node.mutations || [];
  const hasChildren = node.children && node.children.length > 0;

  const getMarkerStatus = (m: string) => {
    const tested = testedMarkers.find(tm => (tm.marker === m || tm.mutation === m));
    if (!tested) return 'untested';
    return (tested.isDerived || tested.status === 'derived') ? 'derived' : 'ancestral';
  };

  return (
    <div className={`ml-2 sm:ml-4 border-l border-slate-100 pl-2 sm:pl-4 my-2 ${matchesSearch ? 'ring-2 ring-teal-500/20 rounded-r' : ''}`}>
      <div 
        className={`flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-2xl transition-all ${isMatch ? 'bg-teal-50 text-teal-900 shadow-sm' : 'hover:bg-white'} ${matchesSearch ? 'bg-amber-50' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.span 
          animate={{ rotate: isExpanded ? 90 : 0 }}
          className="text-[10px] text-slate-300 w-4 flex justify-center"
        >
          {hasChildren ? '▶' : '•'}
        </motion.span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-black tracking-tight ${isMatch ? 'text-teal-700' : 'text-slate-700'} ${matchesSearch ? 'text-amber-700' : ''}`}>
              {node.branchName}
            </span>
            {node.region && (
              <span 
                className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${(CONTINENT_META[node.region] || CONTINENT_META["Global"]).color}15`,
                  color: (CONTINENT_META[node.region] || CONTINENT_META["Global"]).color
                }}
              >
                {node.region}
              </span>
            )}
          </div>
          {node.description && (
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{node.description}</p>
          )}
          {node.historicalContext && isExpanded && (
            <p className="text-[9px] text-rose-500 mt-2 font-bold italic border-l-2 border-rose-100 pl-2 leading-relaxed">
              {node.historicalContext}
            </p>
          )}
          <AnimatePresence>
            {isExpanded && treeMarkers.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1 mt-2 overflow-hidden"
              >
                {treeMarkers.map((m: string, idx: number) => {
                  const status = getMarkerStatus(m);
                  return (
                    <span 
                      key={idx} 
                      className={`text-[8px] font-mono font-black px-2 py-0.5 rounded-full shadow-sm transition-all ${
                        status === 'derived' 
                          ? 'bg-teal-600 text-white' 
                          : status === 'ancestral'
                          ? 'bg-slate-100 text-slate-400 border border-slate-200'
                          : 'bg-slate-50 text-slate-300'
                      }`}
                    >
                      {m}
                    </span>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {node.children.map((child: any, i: number) => (
              <HaplogroupTreeView key={i} node={child} userPath={safeUserPath} level={level + 1} searchTerm={searchTerm} testedMarkers={testedMarkers} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default HaplogroupTreeView;
