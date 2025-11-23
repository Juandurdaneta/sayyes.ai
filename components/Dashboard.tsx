import React from 'react';
import { Project, ProjectStatus } from '../types';
import { Plus, Search, MoreHorizontal, LayoutTemplate } from 'lucide-react';

interface Props {
  projects: Project[];
  onOpenIntake: () => void;
  onOpenProject: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const Dashboard: React.FC<Props> = ({ projects, onOpenIntake, onOpenProject, onToggleStatus }) => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-serif font-medium text-stone-900">Projects</h1>
            <p className="text-stone-500 mt-1">Manage client intakes and design proposals.</p>
        </div>
        <button 
            onClick={onOpenIntake}
            className="bg-stone-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-stone-800 transition shadow-sm"
        >
            <Plus size={18} /> New Client Intake
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search clients..." 
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-400"
                />
            </div>
        </div>
        
        <table className="w-full">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-medium text-left">
                <tr>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Style DNA</th>
                    <th className="px-6 py-4">Proposals</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
                {projects.map(project => (
                    <tr key={project.id} className="hover:bg-stone-50/50 transition group">
                        <td className="px-6 py-4">
                            <div className="font-medium text-stone-900">{project.clientName}</div>
                            <div className="text-xs text-stone-400">{project.intakeData?.location || 'Unknown Location'}</div>
                        </td>
                        <td className="px-6 py-4">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onToggleStatus(project.id); }}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                                    project.status === ProjectStatus.CONTRACT_SIGNED 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-green-50'
                                }`}
                            >
                                {project.status}
                            </button>
                        </td>
                        <td className="px-6 py-4">
                            {project.styleDNA ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                        {project.styleDNA.palette.slice(0,3).map((c, i) => (
                                            <div key={i} className="w-4 h-4 rounded-full border border-white" style={{backgroundColor: c}}></div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-stone-500 truncate max-w-[120px]">{project.styleDNA.adjectives[0]}</span>
                                </div>
                            ) : (
                                <span className="text-stone-400 text-xs italic">Pending Intake</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-stone-600">
                                {project.proposals.length} Generated
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => onOpenProject(project.id)}
                                className="text-brand-600 hover:text-brand-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto"
                            >
                                <LayoutTemplate size={16} /> Open Studio
                            </button>
                        </td>
                    </tr>
                ))}
                {projects.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                            No projects yet. Send an intake link to get started.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};
