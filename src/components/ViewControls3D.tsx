import React from 'react';
import { Eye, Building2, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ViewControls3DProps {
  onSetPreset: (preset: 'overview' | 'interior' | 'street') => void;
  activePreset: 'overview' | 'interior' | 'street';
}

export const ViewControls3D: React.FC<ViewControls3DProps> = ({ onSetPreset, activePreset }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="absolute top-16 left-4 z-20 flex flex-col gap-1.5 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl select-none">
      <div className="text-[10px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">
        3D Camera
      </div>

      <button
        onClick={() => onSetPreset('overview')}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
          activePreset === 'overview'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        title="View surrounding city neighborhood"
      >
        <Building2 className="w-3.5 h-3.5" />
        <span>{t('cam_district')}</span>
      </button>

      <button
        onClick={() => onSetPreset('interior')}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
          activePreset === 'interior'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        title="Close-up cutaway of restaurant interior"
      >
        <Store className="w-3.5 h-3.5" />
        <span>{t('cam_bistro')}</span>
      </button>

      <button
        onClick={() => onSetPreset('street')}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
          activePreset === 'street'
            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        title="Street level customer foot traffic perspective"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>{t('cam_street')}</span>
      </button>

      <div className="pt-1 mt-1 border-t border-slate-800/80 px-2 text-[10px] text-slate-400 leading-tight">
        <div>{lang === 'vi' ? '• Kéo: Xoay 360°' : '• Drag: Rotate 360°'}</div>
        <div>{lang === 'vi' ? '• Chuột phải: Di chuyển' : '• Right-drag: Pan'}</div>
        <div>{lang === 'vi' ? '• Cuộn: Phóng to/nhỏ' : '• Scroll: Zoom'}</div>
      </div>
    </div>
  );
};

