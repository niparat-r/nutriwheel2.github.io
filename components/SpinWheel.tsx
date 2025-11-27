import React, { useState, useRef, useEffect } from 'react';
import { MenuDatabase, MenuItem, CategoryKey } from '../types';
import NutritionCard from './NutritionCard';
import { RefreshCw, Shuffle, Sparkles } from 'lucide-react';

interface Props {
  database: MenuDatabase;
  selectedItems: Record<CategoryKey, MenuItem | null>;
  onSelect: (category: CategoryKey, item: MenuItem) => void;
  onGenerateNewMenu: () => void;
  isGenerating: boolean;
  copy: any;
}

const SpinWheel: React.FC<Props> = ({ database, selectedItems, onSelect, onGenerateNewMenu, isGenerating, copy }) => {
  const [spinning, setSpinning] = useState<Record<CategoryKey, boolean>>({
    main_dish: false,
    snack: false,
    drink: false,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playTickSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'triangle';
      // Randomize pitch slightly for realism/variation
      const frequency = 600 + Math.random() * 200; 
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      // Short click envelope
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Ignore audio errors
    }
  };

  const spinCategory = (category: CategoryKey) => {
    const items = database.categories[category];
    if (items.length === 0) return;

    setSpinning(prev => ({ ...prev, [category]: true }));

    let count = 0;
    const totalSpins = 25; // More spins for fluid animation
    let currentDelay = 50; // Start fast (50ms)

    const runSpin = () => {
      // Pick random item
      const randomIndex = Math.floor(Math.random() * items.length);
      onSelect(category, items[randomIndex]);
      playTickSound();

      count++;
      
      if (count < totalSpins) {
        // Slow down in the last 30% of spins (Ease-out effect)
        if (count > totalSpins * 0.7) {
          currentDelay *= 1.2; 
        }
        setTimeout(runSpin, currentDelay);
      } else {
        setSpinning(prev => ({ ...prev, [category]: false }));
      }
    };

    runSpin();
  };

  const handleSpinAll = () => {
    spinCategory('main_dish');
    setTimeout(() => spinCategory('snack'), 300);
    setTimeout(() => spinCategory('drink'), 600);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-orange-500 text-white p-1.5 rounded-lg"><Shuffle size={20} /></span>
          NutriWheel
        </h2>
        
        <div className="flex gap-2">
          <button 
            onClick={onGenerateNewMenu} 
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="animate-spin" size={16}/> : <Sparkles size={16}/>}
            {isGenerating ? 'Generating DB...' : 'New DB'}
          </button>
          
          <button 
            onClick={handleSpinAll}
            className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full shadow-md transition-all active:scale-95"
          >
            <RefreshCw size={16} />
            {copy.buttons.spin_all}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <button 
            onClick={() => spinCategory('main_dish')}
            disabled={spinning.main_dish}
            className="w-full py-2 bg-orange-100 text-orange-700 font-semibold rounded-lg hover:bg-orange-200 transition-colors text-sm"
          >
            {copy.buttons.spin_now} Main Dish
          </button>
          <NutritionCard 
            category="Main Dish" 
            item={selectedItems.main_dish} 
            isSpinning={spinning.main_dish} 
          />
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => spinCategory('snack')}
            disabled={spinning.snack}
            className="w-full py-2 bg-yellow-100 text-yellow-700 font-semibold rounded-lg hover:bg-yellow-200 transition-colors text-sm"
          >
            {copy.buttons.spin_now} Snack
          </button>
          <NutritionCard 
            category="Snack" 
            item={selectedItems.snack} 
            isSpinning={spinning.snack} 
          />
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => spinCategory('drink')}
            disabled={spinning.drink}
            className="w-full py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors text-sm"
          >
            {copy.buttons.spin_now} Drink
          </button>
          <NutritionCard 
            category="Drink" 
            item={selectedItems.drink} 
            isSpinning={spinning.drink} 
          />
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;