import React, { useState, useCallback } from 'react';
import { MenuDatabase, MenuItem, UserProfile, CategoryKey, AnalysisResult } from './types';
import { INITIAL_DATABASE, DEFAULT_USER_PROFILE, DEFAULT_UI_STRINGS } from './constants';
import * as GeminiService from './services/geminiService';
import SpinWheel from './components/SpinWheel';
import AnalysisView from './components/AnalysisView';
import UserProfileForm from './components/UserProfileForm';
import NutritionCard from './components/NutritionCard';
import { Utensils } from 'lucide-react';

export default function App() {
  const [database, setDatabase] = useState<MenuDatabase>(INITIAL_DATABASE);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [selectedItems, setSelectedItems] = useState<Record<CategoryKey, MenuItem | null>>({
    main_dish: null,
    snack: null,
    drink: null
  });
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingDB, setIsGeneratingDB] = useState(false);

  const handleSelect = (category: CategoryKey, item: MenuItem) => {
    setSelectedItems(prev => ({ ...prev, [category]: item }));
    // Reset analysis when selection changes
    setAnalysis(null);
  };

  const handleGenerateMenu = async () => {
    setIsGeneratingDB(true);
    const newDb = await GeminiService.generateMenuDatabase();
    if (newDb) {
      setDatabase(newDb);
      // Reset selections
      setSelectedItems({ main_dish: null, snack: null, drink: null });
      setAnalysis(null);
    }
    setIsGeneratingDB(false);
  };

  const handleAnalyze = async () => {
    if (!selectedItems.main_dish || !selectedItems.snack || !selectedItems.drink) return;

    setIsAnalyzing(true);
    const result = await GeminiService.analyzeSelectedMenu(
      userProfile,
      selectedItems as { main_dish: MenuItem; snack: MenuItem; drink: MenuItem },
      { drink: database.categories.drink } // Provide drink candidates for alternatives
    );
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const isSelectionComplete = Object.values(selectedItems).every(item => item !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Utensils size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">NutriWheel AI</h1>
              <p className="text-xs text-slate-500">Smart Food Randomizer</p>
            </div>
          </div>
          
          <div className="hidden sm:block text-right">
             <p className="text-xs font-semibold text-slate-400 uppercase">Current Goal</p>
             <p className="text-sm font-bold text-indigo-600 capitalize">{userProfile.goal.replace('_', ' ')}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Hero / Spinner Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              วันนี้กินอะไรดี?
            </h2>
            <p className="text-slate-500">หมุนวงล้อเพื่อสุ่มเมนูสุขภาพ และให้ AI ช่วยวิเคราะห์สารอาหาร</p>
          </div>
          
          <SpinWheel 
            database={database}
            selectedItems={selectedItems}
            onSelect={handleSelect}
            onGenerateNewMenu={handleGenerateMenu}
            isGenerating={isGeneratingDB}
            copy={DEFAULT_UI_STRINGS}
          />
        </section>

        {/* Analysis Section */}
        <section id="analysis">
          <AnalysisView 
            result={analysis} 
            loading={isAnalyzing} 
            onAnalyze={handleAnalyze} 
            canAnalyze={isSelectionComplete}
          />
        </section>
      </main>

      {/* Profile Settings Modal */}
      <UserProfileForm profile={userProfile} onUpdate={setUserProfile} />
    </div>
  );
}