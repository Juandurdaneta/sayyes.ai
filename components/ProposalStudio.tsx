import React, { useState } from 'react';
import { Project, ProposalMode, StyleDNA } from '../types';
import { Sparkles, FileText, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  project: Project;
  onGenerate: (mode: ProposalMode, options: any) => void;
  onBack: () => void;
  isGenerating: boolean;
}

export const ProposalStudio: React.FC<Props> = ({ project, onGenerate, onBack, isGenerating }) => {
  const [selectedMode, setSelectedMode] = useState<ProposalMode | null>(null);
  const [options, setOptions] = useState({
    teaserIncluded: false,
    plannerNotes: ''
  });

  const canAccessFull = project.status === 'Contract Signed';

  const handleGenerate = () => {
    if (selectedMode) {
      onGenerate(selectedMode, options);
    }
  };

  const renderModeChooser = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="text-sm text-stone-500 hover:text-brand-600 underline">Back to Dashboard</button>
            <h1 className="text-2xl font-serif font-semibold text-stone-800">Proposal Studio: {project.clientName}</h1>
        </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Light Proposal Card */}
        <div 
            onClick={() => setSelectedMode(ProposalMode.LIGHT)}
            className={`cursor-pointer group relative p-8 rounded-xl border-2 transition-all duration-300 ${
                selectedMode === ProposalMode.LIGHT 
                ? 'border-brand-500 bg-brand-50 shadow-lg' 
                : 'border-stone-200 bg-white hover:border-brand-200 hover:shadow-md'
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-100 text-brand-700 rounded-lg">
                    <Sparkles size={24} />
                </div>
                <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                    Pre-Contract
                </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Light Proposal</h3>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                A fast, conceptual pitch deck designed to win clients. 
                Focuses on vibe, venue types, and budget bands. No detailed logistics.
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Vision Snapshot</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Conceptual Moodboard</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Estimated Bands</li>
            </ul>
        </div>

        {/* Full Proposal Card */}
        <div 
            onClick={() => canAccessFull && setSelectedMode(ProposalMode.FULL)}
            className={`relative p-8 rounded-xl border-2 transition-all duration-300 ${
                !canAccessFull 
                ? 'border-stone-100 bg-stone-50 opacity-70 cursor-not-allowed' 
                : selectedMode === ProposalMode.FULL
                    ? 'border-stone-800 bg-stone-50 shadow-lg'
                    : 'border-stone-200 bg-white hover:border-stone-400 cursor-pointer hover:shadow-md'
            }`}
        >
            {!canAccessFull && (
                <div className="absolute top-4 right-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 z-10">
                    <Lock size={12} /> Contract Required
                </div>
            )}
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-stone-200 text-stone-800 rounded-lg">
                    <FileText size={24} />
                </div>
                <span className="px-3 py-1 bg-stone-800 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                    Post-Contract
                </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Full Design Proposal</h3>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Production-ready plan with real assets. Requires signed contract and active Design Session.
            </p>
            <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-stone-800" /> Real Venue Rebuild</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-stone-800" /> Exact Line Items</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-stone-800" /> 3 Concepts</li>
            </ul>
        </div>
      </div>

      {selectedMode && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in-up">
            <h4 className="font-semibold text-lg mb-4">Configuration: {selectedMode === ProposalMode.LIGHT ? 'Light Mode' : 'Full Mode'}</h4>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Planner Notes (Internal Guidance for AI)</label>
                    <textarea 
                        className="w-full p-3 border border-stone-200 rounded-lg text-sm focus:ring-1 focus:ring-stone-500 outline-none"
                        rows={3}
                        placeholder="Emphasize the outdoor ceremony option..."
                        value={options.plannerNotes}
                        onChange={(e) => setOptions({...options, plannerNotes: e.target.value})}
                    />
                </div>

                {selectedMode === ProposalMode.LIGHT && (
                    <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-lg border border-brand-100">
                        <input 
                            type="checkbox" 
                            id="teaser"
                            className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                            checked={options.teaserIncluded}
                            onChange={(e) => setOptions({...options, teaserIncluded: e.target.checked})}
                        />
                        <label htmlFor="teaser" className="text-sm font-medium text-stone-700 cursor-pointer">
                            Include "Teaser Concept" (Approximate Render)
                        </label>
                    </div>
                )}

                <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-70 flex justify-center items-center gap-2"
                >
                    {isGenerating ? (
                        <>Generating Magic...</>
                    ) : (
                        <>Build Proposal <Sparkles size={16} /></>
                    )}
                </button>
            </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {renderModeChooser()}
    </div>
  );
};
