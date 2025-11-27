import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Settings, X } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const UserProfileForm: React.FC<Props> = ({ profile, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? Number(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white p-4 rounded-full shadow-xl hover:bg-slate-700 transition-all hover:scale-105"
      >
        <Settings size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-6">ตั้งค่าข้อมูลส่วนตัว</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">อายุ (ปี)</label>
              <input 
                type="number" name="age" value={formData.age} onChange={handleChange} 
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">เพศ</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded-lg p-2">
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">น้ำหนัก (kg)</label>
              <input 
                type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} 
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ส่วนสูง (cm)</label>
              <input 
                type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} 
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-slate-500 mb-1">เป้าหมาย</label>
             <select name="goal" value={formData.goal} onChange={handleChange} className="w-full border rounded-lg p-2">
               <option value="weight_loss">ลดน้ำหนัก</option>
               <option value="maintain">รักษาน้ำหนัก</option>
               <option value="muscle_gain">เพิ่มกล้ามเนื้อ</option>
             </select>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="has_diabetes" checked={formData.has_diabetes} onChange={handleChange} />
              เป็นเบาหวาน
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="has_hypertension" checked={formData.has_hypertension} onChange={handleChange} />
              เป็นความดันโลหิตสูง
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="sensitive_to_caffeine" checked={formData.sensitive_to_caffeine} onChange={handleChange} />
              แพ้/ไวต่อคาเฟอีน
            </label>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4">
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;