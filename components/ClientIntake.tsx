import React, { useState } from 'react';
import { IntakeData } from '../types';
import { Loader2, ArrowRight, Heart, MapPin, Calendar, DollarSign, Users } from 'lucide-react';

interface Props {
  onSubmit: (data: IntakeData) => void;
  onCancel: () => void;
}

const VIBE_TAGS = [
  "Modern", "Romantic", "Bohemian", "Classic", "Minimalist", 
  "Industrial", "Garden", "Vintage", "Glamorous", "Rustic", 
  "Ethereal", "Moody", "Coastal", "Traditional"
];

export const ClientIntake: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IntakeData>({
    coupleName: '',
    email: '',
    eventDate: '',
    guestCount: '',
    budgetBand: '',
    location: '',
    vibeTags: [],
    notes: ''
  });

  const handleChange = (field: keyof IntakeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => {
      const tags = prev.vibeTags.includes(tag)
        ? prev.vibeTags.filter(t => t !== tag)
        : [...prev.vibeTags, tag];
      return { ...prev, vibeTags: tags };
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-stone-800">Welcome to SayYes</h2>
        <p className="text-stone-500 mt-2">Let's start with the basics of your special day.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Couple Names</label>
          <div className="relative">
            <Heart className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input 
              type="text" 
              className="w-full pl-10 p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-300 focus:border-brand-300 outline-none transition"
              placeholder="e.g. Alex & Jordan"
              value={formData.coupleName}
              onChange={(e) => handleChange('coupleName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-300 outline-none"
            placeholder="hello@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Date / Season</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                    <input 
                        type="text" 
                        className="w-full pl-10 p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-300 outline-none"
                        placeholder="Fall 2025"
                        value={formData.eventDate}
                        onChange={(e) => handleChange('eventDate', e.target.value)}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                    <input 
                        type="text" 
                        className="w-full pl-10 p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-300 outline-none"
                        placeholder="Napa, CA"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                    />
                </div>
            </div>
        </div>
      </div>
      
      <button 
        onClick={nextStep}
        disabled={!formData.coupleName || !formData.email}
        className="w-full mt-6 bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center items-center gap-2"
      >
        Next Step <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-stone-800">Logistics & Budget</h2>
        <p className="text-stone-500 mt-2">Help us understand the scale of your event.</p>
      </div>

      <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Guest Count Range</label>
            <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                <select 
                    className="w-full pl-10 p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-300 outline-none appearance-none"
                    value={formData.guestCount}
                    onChange={(e) => handleChange('guestCount', e.target.value)}
                >
                    <option value="">Select a range</option>
                    <option value="Less than 50">Micro (Less than 50)</option>
                    <option value="50-100">Intimate (50 - 100)</option>
                    <option value="100-200">Standard (100 - 200)</option>
                    <option value="200-300">Large (200 - 300)</option>
                    <option value="300+">Grand (300+)</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Estimated Budget Band</label>
            <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                <select 
                    className="w-full pl-10 p-3 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-300 outline-none appearance-none"
                    value={formData.budgetBand}
                    onChange={(e) => handleChange('budgetBand', e.target.value)}
                >
                    <option value="">Select a budget range</option>
                    <option value="$20k - $40k">$20k - $40k</option>
                    <option value="$40k - $70k">$40k - $70k</option>
                    <option value="$70k - $100k">$70k - $100k</option>
                    <option value="$100k - $150k">$100k - $150k</option>
                    <option value="$150k+">$150k (Luxury)</option>
                </select>
            </div>
            <p className="text-xs text-stone-400 mt-2">This is just a starting point. We refine this later.</p>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={prevStep} className="flex-1 py-3 border border-stone-200 rounded-lg font-medium text-stone-600 hover:bg-stone-50">Back</button>
        <button 
            onClick={nextStep}
            disabled={!formData.guestCount || !formData.budgetBand}
            className="flex-1 bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 disabled:opacity-50"
        >
            Next Step
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-stone-800">Style & Vibe</h2>
        <p className="text-stone-500 mt-2">Select keywords that resonate with your vision.</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {VIBE_TAGS.map(tag => (
            <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition duration-200 border ${
                    formData.vibeTags.includes(tag)
                        ? "bg-brand-900 text-white border-brand-900 shadow-md transform scale-105"
                        : "bg-white text-stone-600 border-stone-200 hover:border-brand-300 hover:bg-brand-50"
                }`}
            >
                {tag}
            </button>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-stone-700 mb-2">Any specific notes or must-haves?</label>
        <textarea
            className="w-full p-4 bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-300 outline-none h-32 resize-none"
            placeholder="We love natural light, live jazz, and plenty of greenery..."
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={prevStep} className="flex-1 py-3 border border-stone-200 rounded-lg font-medium text-stone-600 hover:bg-stone-50">Back</button>
        <button 
            onClick={() => onSubmit(formData)}
            disabled={formData.vibeTags.length === 0}
            className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 shadow-lg shadow-brand-200"
        >
            Complete Intake
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
        <div className="mb-6 flex justify-between items-center">
             <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-brand-600' : 'bg-stone-200'}`} />
                ))}
             </div>
             <button onClick={onCancel} className="text-xs text-stone-400 hover:text-stone-600 uppercase tracking-wider">Skip</button>
        </div>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};
