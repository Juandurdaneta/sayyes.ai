import React from 'react';
import { ProposalPackage, ProposalMode, ProposalSection } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Share2, ArrowLeft, Printer } from 'lucide-react';

interface Props {
  proposal: ProposalPackage;
  onClose: () => void;
}

const renderSection = (section: ProposalSection, isLight: boolean) => {
  switch (section.type) {
    case 'text':
      return (
        <div className="prose prose-stone max-w-none">
          <p className="text-stone-600 leading-relaxed whitespace-pre-line">{section.content}</p>
        </div>
      );
    case 'gallery':
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-stone-200 rounded-lg overflow-hidden relative group">
              <img 
                src={`https://picsum.photos/400/400?random=${i + 10}`} 
                alt="Inspo" 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
              />
              {isLight && (
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded">
                  Conceptual
                </div>
              )}
            </div>
          ))}
        </div>
      );
    case 'budget_chart':
      const data = isLight 
        ? [
            { name: 'Venue', min: 15000, max: 25000 },
            { name: 'Catering', min: 20000, max: 30000 },
            { name: 'Decor', min: 10000, max: 18000 },
            { name: 'Planning', min: 8000, max: 12000 },
          ]
        : [
            { name: 'Venue', amount: 22500 },
            { name: 'Catering', amount: 28400 },
            { name: 'Decor', amount: 15600 },
            { name: 'Planning', amount: 10000 },
          ];

      return (
        <div className="h-64 mt-6 bg-white p-4 rounded-xl border border-stone-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12, fill: '#666'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                {isLight ? (
                    <>
                         <Bar dataKey="min" stackId="a" fill="transparent" />
                         <Bar dataKey="max" stackId="a" fill="#d18a8a" radius={[0, 4, 4, 0]} barSize={20} />
                    </>
                ) : (
                    <Bar dataKey="amount" fill="#7a3e3e" radius={[0, 4, 4, 0]} barSize={20} />
                )}
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-stone-400 mt-2">
            {isLight ? "*Ranges represent estimated market rates for your style." : "*Finalized costs based on vendor quotes."}
          </p>
        </div>
      );
    default:
      return null;
  }
};

export const ProposalPreview: React.FC<Props> = ({ proposal, onClose }) => {
  const isLight = proposal.mode === ProposalMode.LIGHT;

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex flex-col">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition">
                <ArrowLeft className="text-stone-600" size={20} />
            </button>
            <div>
                <h2 className="font-bold text-stone-800">{proposal.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isLight ? 'bg-brand-100 text-brand-800' : 'bg-stone-800 text-white'}`}>
                    {isLight ? 'Light Proposal' : 'Full Design Package'}
                </span>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg text-sm font-medium transition">
                <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition">
                <Download size={16} /> Export PDF
            </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-stone-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white min-h-[1000px] shadow-2xl rounded-sm overflow-hidden flex flex-col">
            
            {/* Cover Page */}
            <div className="h-[500px] bg-stone-900 relative text-white flex flex-col justify-center items-center text-center p-12">
                <div className="absolute inset-0 opacity-40">
                    <img src="https://picsum.photos/1200/800?grayscale" className="w-full h-full object-cover" alt="Cover" />
                </div>
                <div className="relative z-10 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-serif tracking-tight">{proposal.title}</h1>
                    <p className="text-xl font-light tracking-widest uppercase opacity-90">{proposal.styleDNA.summary.split(' ').slice(0, 5).join(' ')}</p>
                    {isLight && <div className="mt-8 px-4 py-2 border border-white/30 inline-block text-xs tracking-widest uppercase">Conceptual Draft</div>}
                </div>
            </div>

            {/* Style DNA Strip */}
            <div className="bg-stone-50 border-b border-stone-100 p-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 text-center">Style DNA Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <h4 className="font-serif text-xl mb-2 text-stone-800">Palette</h4>
                        <div className="flex justify-center gap-2 mt-2">
                            {proposal.styleDNA.palette.map((color, idx) => (
                                <div key={idx} className="w-8 h-8 rounded-full shadow-sm border border-stone-100" style={{backgroundColor: color}}></div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-serif text-xl mb-2 text-stone-800">Keywords</h4>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {proposal.styleDNA.adjectives.map((adj, idx) => (
                                <span key={idx} className="text-xs border border-stone-300 px-2 py-1 rounded-full text-stone-600">{adj}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-serif text-xl mb-2 text-stone-800">Motifs</h4>
                         <p className="text-sm text-stone-600 italic mt-2">{proposal.styleDNA.motifs.join(" • ")}</p>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="p-12 space-y-16">
                {proposal.sections.filter(s => s.id !== 'cover').map((section) => (
                    <div key={section.id} className="animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-px flex-1 bg-stone-200"></span>
                            <h2 className="text-2xl font-serif text-stone-800">{section.title}</h2>
                            <span className="h-px flex-1 bg-stone-200"></span>
                        </div>
                        {renderSection(section, isLight)}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="bg-stone-50 p-12 text-center border-t border-stone-100 mt-auto">
                <p className="font-serif text-2xl mb-4">Ready to say yes?</p>
                <button className="bg-brand-600 text-white px-8 py-3 rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-200">
                    Book Vision Call
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
