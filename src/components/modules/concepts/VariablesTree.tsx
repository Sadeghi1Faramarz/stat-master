
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { conceptsData } from '@/lib/concepts-data';
import { cn } from '@/lib/utils';
import { BookCopy, Eye } from 'lucide-react';

const nodeData = conceptsData.variableTypes;

type NodeVariant = 'root' | 'quantitative' | 'qualitative';

const getVariantStyles = (variant: NodeVariant, isSelected: boolean) => {
  if (isSelected) {
    return 'bg-white text-slate-900 shadow-2xl shadow-cyan-500/50 scale-105';
  }
  switch (variant) {
    case 'quantitative':
      return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]';
    case 'qualitative':
      return 'bg-purple-500/10 border-purple-500/30 text-purple-200 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]';
    default:
      return 'bg-white/10 border-white/20 text-white';
  }
};

interface NodeProps {
  data: { name: string; description: string; examples: string[] };
  children?: React.ReactNode;
  level?: number;
  variant: NodeVariant;
  isSelected: boolean;
  onSelect: () => void;
}

const Node = ({ data, children, level = 0, variant, isSelected, onSelect }: NodeProps) => {
  return (
    <div className="relative flex flex-col items-center">
      {level > 0 && <div className="absolute bottom-full h-8 w-[2px] bg-slate-500/60" />}
      
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: level * 0.1 }}
              className={cn(
                "backdrop-blur-md border px-6 py-3 rounded-xl text-lg font-bold shadow-lg z-10",
                "transition-all duration-300 hover:scale-105 cursor-pointer",
                getVariantStyles(variant, isSelected)
              )}
              onClick={onSelect}
            >
              {data.name}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-center p-3" side="bottom">
            <p>{data.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {children && (
        <div className="mt-8 flex flex-row-reverse justify-center gap-x-8 md:gap-x-16 relative">
          <div className="absolute bottom-full h-8 w-[2px] bg-slate-500/60" />
          {React.Children.count(children) > 1 && <div className="absolute top-[-32px] h-[2px] w-full bg-slate-500/60" />}
          {children}
        </div>
      )}
    </div>
  );
};

export function VariablesTree() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const createNode = (data: any, level: number, variant: NodeVariant) => {
    const isSelected = selectedNode?.name === data.name;
    const handleSelect = () => setSelectedNode(data);
    
    const children = data.children ? Object.values(data.children).map((child: any) => 
        createNode(
            child, 
            level + 1, 
            child.variant || variant
        )
    ) : null;

    return (
        <Node
            key={data.name}
            data={data}
            level={level}
            variant={variant}
            isSelected={isSelected}
            onSelect={handleSelect}
        >
         {children}
        </Node>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
        <div className="w-full overflow-x-auto">
            <div className="flex w-full justify-center p-4 py-8 md:p-8 transition-transform duration-300 scale-75 md:scale-100 origin-top min-w-[700px]">
                {createNode(nodeData.root, 0, 'root')}
            </div>
        </div>


        <AnimatePresence>
            {selectedNode && (
            <motion.div
                layoutId="details-panel"
                initial={{ opacity: 0, y: 50, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 50, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl mt-8 text-right"
            >
                <div className="glassmorphism p-6 rounded-xl border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-start gap-3 flex-row-reverse">
                        <BookCopy className="text-cyan-400"/>
                        {selectedNode.name}
                    </h3>
                    <p className="text-slate-300 leading-relaxed mb-6 [direction:rtl]">{selectedNode.description}</p>
                    
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center justify-start gap-2 flex-row-reverse"><Eye className="h-5 w-5"/> مثال‌ها:</h4>
                    <ul className="space-y-2 list-inside pr-4">
                        {selectedNode.examples.map((ex: string) => (
                        <li key={ex} className="flex items-start gap-3 text-slate-300 flex-row-reverse justify-end [direction:rtl]">
                           <span className="flex-1">{ex}</span>
                        </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
