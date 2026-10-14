import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';
import { useLanguage } from '../context/LanguageContext';

interface BankruptcyModalProps {
  isOpen: boolean;
  debtAmount: number;
  onRestructure: () => void;
  onRestart: () => void;
}

export const BankruptcyModal: React.FC<BankruptcyModalProps> = ({
  isOpen,
  debtAmount,
  onRestructure,
  onRestart,
}) => {
  const { lang, t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl overflow-hidden p-6 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
          <AlertOctagon className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <h2 className="text-xl font-black text-rose-400 uppercase tracking-wide">
            {t('bankruptcyTitle')}
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {lang === 'vi'
              ? `Doanh nghiệp F&B của bạn đã vi phạm giới hạn tín dụng thương mại với khoản âm tiền mặt `
              : `Your F&B enterprise has breached its commercial credit covenants with accumulated debt of `}
            <strong className="text-rose-400 font-mono-num">${Math.abs(Math.round(debtAmount)).toLocaleString()}</strong>.
            {lang === 'vi'
              ? ' Chi phí mặt bằng, điện nước và lương nhân sự đã vượt quá dòng tiền thu vào.'
              : ' Fixed rent, utility overhead, and payroll expenses exceeded incoming cashflow.'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
          <div className="font-bold text-slate-200">{lang === 'vi' ? 'Bài học Quản trị Tài chính:' : 'Management Lesson:'}</div>
          <div>{lang === 'vi' ? '• Doanh thu không phải là tiền mặt: mở rộng quá nhanh mà thiếu vốn lưu động sẽ dẫn tới mất thanh khoản.' : '• Revenue is not cash: aggressive expansion without capital buffer causes bankruptcy.'}</div>
          <div>{lang === 'vi' ? '• Luôn duy trì dòng tiền đệm trước khi bung ngân sách tiếp thị hoặc mở chuỗi.' : '• Keep sufficient working cash reserves before scaling marketing campaigns or opening branches.'}</div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onRestructure();
            }}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
          >
            {lang === 'vi' ? 'Tái Cấu Trúc Khẩn Cấp (Bán bớt máy móc, nhận $1,000 vốn)' : 'Emergency Asset Restructuring (Recover $1,000 Cash)'}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onRestart();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition border border-slate-700"
          >
            {lang === 'vi' ? 'Giải thể & Bắt đầu Quán mới (Restart Game)' : 'Liquidate & Start Fresh Bistro (Restart)'}
          </button>
        </div>
      </div>
    </div>
  );
};

