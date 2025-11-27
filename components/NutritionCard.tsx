import React from 'react';
import { MenuItem } from '../types';
import { Leaf, Flame, Droplet, Coffee } from 'lucide-react';

interface Props {
  item: MenuItem | null;
  category: string;
  isSpinning: boolean;
}

const NutritionCard: React.FC<Props> = ({ item, category, isSpinning }) => {
  // We no longer return a loader here. We show the cycling item.
  
  if (!item) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-64 flex items-center justify-center border border-slate-100">
        <p className="text-slate-400">ยังไม่ได้เลือก {category}</p>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 5) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-5 border flex flex-col h-full relative overflow-hidden transition-all duration-75 ${
      isSpinning 
        ? 'border-orange-400 scale-[1.02] shadow-orange-200/50' 
        : 'border-slate-100 hover:shadow-xl'
    }`}>
      {/* Active Spinning Indicator Overlay */}
      {isSpinning && (
        <div className="absolute inset-0 bg-orange-500/5 pointer-events-none z-10" />
      )}

      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold z-20 transition-colors duration-100 ${getHealthColor(item.health_score)}`}>
        Score: {item.health_score}/10
      </div>
      
      <div className="mb-2 relative z-20">
        <span className="text-xs uppercase tracking-wide text-slate-400 font-semibold">{category}</span>
        <h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-2 min-h-[3.5rem] flex items-center">
          {item.name_th}
        </h3>
        <p className="text-xs text-slate-500 italic truncate">{item.name_en}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto text-sm relative z-20">
        <div className="flex items-center gap-2 text-slate-600">
          <Flame size={16} className="text-orange-500" />
          <span>{item.calories_kcal} kcal</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Leaf size={16} className="text-green-500" />
          <span>Sug {item.sugar_g}g</span>
        </div>
        {item.caffeine_level !== 'none' && (
          <div className="col-span-2 flex items-center gap-2 text-slate-600">
            <Coffee size={16} className="text-amber-700" />
            <span className="capitalize">Caf: {item.caffeine_level}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1 relative z-20">
        {item.type_tag === 'healthy' && <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">Healthy</span>}
        {item.type_tag === 'high_protein' && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">High Protein</span>}
        {item.type_tag === 'high_calorie' && <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full">High Calorie</span>}
        {item.type_tag === 'low_carb' && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">Low Carb</span>}
        {item.type_tag === 'normal' && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">Normal</span>}
      </div>
    </div>
  );
};

export default NutritionCard;