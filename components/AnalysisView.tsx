import React from 'react';
import { AnalysisResult } from '../types';
import { AlertCircle, CheckCircle, Heart, ArrowRight } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
  loading: boolean;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

const AnalysisView: React.FC<Props> = ({ result, loading, onAnalyze, canAnalyze }) => {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-100 text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mx-auto flex items-center justify-center animate-bounce">
          <Heart size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Nutri Advisor กำลังวิเคราะห์...</h3>
        <p className="text-slate-500">กำลังตรวจสอบสารอาหารและแคลอรี่เพื่อคุณ</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center mt-8">
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`px-8 py-4 text-lg font-bold rounded-full shadow-lg transition-all transform hover:-translate-y-1 ${
            canAnalyze 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {canAnalyze ? '✨ วิเคราะห์มื้ออาหารนี้กับ AI' : 'กรุณาเลือกเมนูให้ครบก่อนวิเคราะห์'}
        </button>
      </div>
    );
  }

  const getEvaluationColor = (evaluation: string) => {
    if (evaluation.includes('ดี')) return 'text-green-600 bg-green-50 border-green-200';
    if (evaluation.includes('พอใช้')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mt-8">
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Heart className="fill-white" /> Nutri Advisor Result
        </h3>
        <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
          Health Score: {result.health_score_overall}/10
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        
        {/* Summary & Evaluation */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm uppercase text-slate-400 font-bold mb-2">สรุปมื้ออาหาร</h4>
            <p className="text-lg text-slate-800 font-medium leading-relaxed">{result.summary_th}</p>
          </div>
          <div>
             <h4 className="text-sm uppercase text-slate-400 font-bold mb-2">ผลประเมิน</h4>
             <div className={`p-4 rounded-xl border ${getEvaluationColor(result.evaluation_th)}`}>
               <p className="font-bold text-lg">{result.evaluation_th}</p>
             </div>
          </div>
        </div>

        {/* Advice & Risks */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
           <h4 className="text-slate-800 font-bold mb-3 flex items-center gap-2">
             <CheckCircle size={20} className="text-indigo-500" /> คำแนะนำ
           </h4>
           <p className="text-slate-600 mb-4">{result.advice_th}</p>

           {result.risk_factors_th.length > 0 && (
             <div className="space-y-2">
               {result.risk_factors_th.map((risk, idx) => (
                 <div key={idx} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                   <AlertCircle size={16} className="mt-0.5 shrink-0" />
                   {risk}
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Alternatives */}
        {result.suggested_alternatives.length > 0 && (
          <div>
             <h4 className="text-sm uppercase text-slate-400 font-bold mb-3">ทางเลือกที่สุขภาพดีกว่า</h4>
             <div className="grid md:grid-cols-2 gap-3">
               {result.suggested_alternatives.map((alt, idx) => (
                 <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                   <div className="bg-green-200 text-green-700 p-2 rounded-full">
                     <ArrowRight size={16} />
                   </div>
                   <div>
                     <p className="font-bold text-green-800">{alt.name_th}</p>
                     <p className="text-xs text-green-600 mt-1">{alt.reason_th}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalysisView;