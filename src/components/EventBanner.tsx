import React from 'react';
import { AlertTriangle, TrendingUp, Sparkles, X } from 'lucide-react';
import { GameEvent } from '../types/game';
import { useLanguage } from '../context/LanguageContext';

interface EventBannerProps {
  events: GameEvent[];
  onDismiss: (eventId: string) => void;
}

export const EventBanner: React.FC<EventBannerProps> = ({ events, onDismiss }) => {
  const { lang } = useLanguage();
  if (events.length === 0) return null;

  const current = events[0];
  const title = lang === 'vi' && current.vietnameseTitle ? current.vietnameseTitle : current.title;
  const description = lang === 'vi' && current.vietnameseDescription ? current.vietnameseDescription : current.description;
  const badgeLabel = lang === 'vi'
    ? (current.type === 'crisis' ? 'SỰ CỐ' : current.type === 'opportunity' ? 'CƠ HỘI' : 'BIẾN ĐỘNG')
    : current.type;

  const getTheme = () => {
    switch (current.type) {
      case 'crisis':
        return {
          border: 'border-rose-500/40',
          bg: 'bg-rose-950/80',
          text: 'text-rose-200',
          badge: 'bg-rose-500 text-rose-950',
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
        };
      case 'opportunity':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/80',
          text: 'text-amber-200',
          badge: 'bg-amber-500 text-amber-950',
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        };
      default:
        return {
          border: 'border-blue-500/40',
          bg: 'bg-blue-950/80',
          text: 'text-blue-200',
          badge: 'bg-blue-500 text-blue-950',
          icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-30 max-w-lg w-full px-4 select-none animate-in fade-in slide-in-from-top-3 duration-300`}>
      <div className={`flex items-start gap-3 p-3.5 rounded-2xl backdrop-blur-md border shadow-2xl ${theme.border} ${theme.bg}`}>
        <div className="p-2 rounded-xl bg-slate-900/60 shrink-0">
          {theme.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${theme.badge}`}>
              {badgeLabel}
            </span>
            <span className="text-xs font-bold text-slate-100">{title}</span>
          </div>
          <p className={`text-xs mt-1 leading-relaxed ${theme.text}`}>
            {description}
          </p>
          <div className="text-[10px] text-slate-400 mt-1 font-mono-num">
            {lang === 'vi' ? 'Thời gian còn lại: ' : 'Time remaining: '}
            {Math.max(1, Math.round(current.durationHours))} {lang === 'vi' ? 'giờ trong game' : 'in-game hours'}
          </div>
        </div>
        <button
          onClick={() => onDismiss(current.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
