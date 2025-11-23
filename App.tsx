import React, { useState } from 'react';
import { Project, ViewState, IntakeData, ProjectStatus, ProposalMode, ProposalPackage } from './types';
import { generateStyleDNA, generateProposalSections } from './services/geminiService';
import { ClientIntake } from './components/ClientIntake';
import { Dashboard } from './components/Dashboard';
import { ProposalStudio } from './components/ProposalStudio';
import { ProposalPreview } from './components/ProposalPreview';
import { Command } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({ view: 'DASHBOARD' });
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mock Database State
  const [projects, setProjects] = useState<Project[]>([
    {
        id: '1',
        clientName: 'Sarah & Michael',
        status: ProjectStatus.CONTRACT_SIGNED,
        intakeData: {
            coupleName: 'Sarah & Michael',
            email: 'sarah@example.com',
            location: 'Charleston, SC',
            eventDate: 'Spring 2025',
            guestCount: '150-200',
            budgetBand: '$80k - $100k',
            vibeTags: ['Romantic', 'Historic', 'Garden'],
            notes: 'Lots of moss and vintage brass.'
        },
        styleDNA: {
            palette: ['#5D737E', '#FFF0F5', '#E6E6FA', '#C0C0C0', '#2F4F4F'],
            adjectives: ['Timeless', 'Southern', 'Lush'],
            motifs: ['Spanish Moss', 'Wrought Iron'],
            venueTypes: ['Historic Mansion'],
            summary: 'A classic southern affair with lush garden elements.'
        },
        proposals: []
    }
  ]);

  // --- Handlers ---

  const handleIntakeSubmit = async (data: IntakeData) => {
    // 1. Generate Style DNA (Agent 16)
    // In a real app, this would be a loading state while calling the API
    const loadingId = Date.now().toString();
    // Simulate optimistic UI or blocking load
    
    try {
        const styleDNA = await generateStyleDNA(data);
        
        const newProject: Project = {
            id: loadingId,
            clientName: data.coupleName,
            status: ProjectStatus.LEAD,
            intakeData: data,
            styleDNA: styleDNA,
            proposals: []
        };

        setProjects(prev => [newProject, ...prev]);
        setViewState({ view: 'DASHBOARD' }); // Or direct to thank you page
    } catch (e) {
        alert("Failed to generate Style DNA. Please try again.");
    }
  };

  const handleGenerateProposal = async (mode: ProposalMode, options: any) => {
    if (viewState.view !== 'PROPOSAL_STUDIO') return;
    
    const project = projects.find(p => p.id === viewState.projectId);
    if (!project || !project.intakeData || !project.styleDNA) return;

    setIsGenerating(true);
    
    try {
        const sections = await generateProposalSections(project.intakeData, project.styleDNA, mode);
        
        const newProposal: ProposalPackage = {
            id: Date.now().toString(),
            mode,
            title: `${project.clientName} - ${mode === ProposalMode.LIGHT ? 'Vision Proposal' : 'Design Master Plan'}`,
            createdAt: new Date().toISOString(),
            sections,
            isTeaser: options.teaserIncluded,
            styleDNA: project.styleDNA
        };

        // Update Project with new proposal
        const updatedProjects = projects.map(p => {
            if (p.id === project.id) {
                return { ...p, proposals: [newProposal, ...p.proposals] };
            }
            return p;
        });

        setProjects(updatedProjects);
        setViewState({ view: 'PROPOSAL_PREVIEW', proposal: newProposal });
    } catch (e) {
        console.error(e);
        alert("Failed to generate proposal.");
    } finally {
        setIsGenerating(false);
    }
  };

  const toggleProjectStatus = (id: string) => {
    setProjects(prev => prev.map(p => {
        if (p.id === id) {
            return {
                ...p,
                status: p.status === ProjectStatus.LEAD ? ProjectStatus.CONTRACT_SIGNED : ProjectStatus.LEAD
            };
        }
        return p;
    }));
  };

  // --- Render Logic ---

  return (
    <div className="min-h-screen font-sans">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-stone-200 sticky top-0 z-40">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div 
                    className="flex items-center gap-2 cursor-pointer" 
                    onClick={() => setViewState({ view: 'DASHBOARD' })}
                >
                    <div className="bg-stone-900 text-white p-1.5 rounded-md">
                        <Command size={20} />
                    </div>
                    <span className="font-serif text-xl font-bold tracking-tight">SayYes.ai</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-stone-500 hidden md:block">Agent Ecosystem Active</span>
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-medium text-xs">
                        JD
                    </div>
                </div>
            </div>
        </nav>

        {/* Main Content */}
        <main>
            {viewState.view === 'DASHBOARD' && (
                <Dashboard 
                    projects={projects}
                    onOpenIntake={() => setViewState({ view: 'INTAKE_FORM' })}
                    onOpenProject={(id) => setViewState({ view: 'PROPOSAL_STUDIO', projectId: id })}
                    onToggleStatus={toggleProjectStatus}
                />
            )}

            {viewState.view === 'INTAKE_FORM' && (
                <ClientIntake 
                    onSubmit={handleIntakeSubmit}
                    onCancel={() => setViewState({ view: 'DASHBOARD' })}
                />
            )}

            {viewState.view === 'PROPOSAL_STUDIO' && (
                <ProposalStudio 
                    project={projects.find(p => p.id === viewState.projectId)!}
                    onBack={() => setViewState({ view: 'DASHBOARD' })}
                    onGenerate={handleGenerateProposal}
                    isGenerating={isGenerating}
                />
            )}

            {viewState.view === 'PROPOSAL_PREVIEW' && (
                <ProposalPreview 
                    proposal={viewState.proposal}
                    onClose={() => setViewState({ view: 'DASHBOARD' })}
                />
            )}
        </main>
    </div>
  );
};

export default App;
