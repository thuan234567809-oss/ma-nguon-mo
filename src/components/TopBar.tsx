import React from 'react';
import { Play, Pause, FastForward, Volume2, VolumeX, Sun, Cloud, CloudRain, CloudLightning, Flame, Snowflake, Star, DollarSign, TrendingUp, Save, Check, Globe } from 'lucide-react';
import { GameSpeed, WeatherType, GameState } from '../types/game';
import { soundEngine } from '../engine/soundEngine';
import { useLanguage } from '../context/LanguageContext';

interface TopBarProps {
  state: GameState;
  onSetSpeed: (speed: GameSpeed) => void;
  onOpenGDD: () => void;
  onSaveGame?: () => void;
  isSaved?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ state, onSetSpeed, onOpenGDD, onSaveGame, isSaved }) => {
  const { lang, setLang, t } = useLanguage();
  const [isMuted, setIsMuted] = React.useState(soundEngine.getMuted());

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const formatTime = (timeHour: number) => {
    const hour = Math.floor(timeHour);
    const minute = Math.floor((timeHour - hour) * 60);
    const padH = hour.toString().padStart(2, '0');
    const padM = minute.toString().padStart(2, '0');
    return `${padH}:${padM}`;
  };

  const getWeatherIcon = (w: WeatherType) => {
    switch (w) {
      case 'sunny': return <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '24s' }} />;
      case 'cloudy': return <Cloud className="w-4 h-4 text-slate-300" />;
      case 'rain': return <CloudRain className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'heavy_rain': return <CloudLightning className="w-4 h-4 text-indigo-400 animate-bounce" />;
      case 'heatwave': return <Flame className="w-4 h-4 text-orange-500 animate-pulse" />;
      case 'cold_snap': return <Snowflake className="w-4 h-4 text-cyan-300" />;
    }
  };

  const getWeatherLabel = (w: WeatherType) => {
    switch (w) {
      case 'sunny': return t('weather_sunny');
      case 'cloudy': return t('weather_cloudy');
      case 'rain': return t('weather_rain');
      case 'heavy_rain': return t('weather_heavy_rain');
      case 'heatwave': return t('weather_heatwave');
      case 'cold_snap': return t('weather_cold_snap');
    }
  };

  return (
    <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Time */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Custom 3D F&B Empire Game Icon Badge */}
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={onOpenGDD}>
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" fill="currentColor" fillOpacity="0.2" />
                <line x1="6" y1="17" x2="18" y2="17" />
              </svg>
            </div>
            {/* Sparkle badge for Michelin stars */}
            {state.culinaryLab?.michelin?.stars > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="text-xs font-extrabold text-amber-400 tracking-wider uppercase flex items-center gap-1">
              <span>{t('gameTitle')}</span>
              {state.culinaryLab?.michelin?.stars > 0 && (
                <span className="text-[10px] text-amber-300 flex items-center">
                  {'★'.repeat(state.culinaryLab.michelin.stars)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-medium truncate max-w-[110px] sm:max-w-[170px]">{state.companyName}</div>
          </div>
        </div>

        <div className="h-7 w-px bg-slate-800 hidden sm:block" />

        {/* In-Game Calendar Clock */}
        <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
          <div className="text-xs font-semibold text-slate-400">{t('day')} {state.currentDay}</div>
          <div className="text-sm font-bold font-mono-num text-amber-300">{formatTime(state.timeHour)}</div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            {getWeatherIcon(state.weather)}
            <span className="hidden md:inline">{getWeatherLabel(state.weather)}</span>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => onSetSpeed(0)}
            className={`p-1.5 rounded transition ${state.gameSpeed === 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            title={t('speedPause')}
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetSpeed(1)}
            className={`p-1.5 rounded transition ${state.gameSpeed === 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            title={t('speed1x')}
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetSpeed(2)}
            className={`p-1.5 rounded transition ${state.gameSpeed === 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            title={t('speed2x')}
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetSpeed(5)}
            className={`px-2 py-1 text-xs rounded transition font-bold font-mono-num ${state.gameSpeed === 5 ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            title={t('speed5x')}
          >
            5x
          </button>
        </div>
      </div>

      {/* Real-time Economic Gauges & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Cash Balance */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-emerald-500/30 px-2.5 sm:px-3 py-1 rounded-lg">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <div className="text-right">
            <div className="text-[10px] text-emerald-400/80 uppercase font-bold tracking-wider leading-none">{t('cashBalance')}</div>
            <div className={`text-xs sm:text-sm font-bold font-mono-num ${state.finances.cash < 500 ? 'text-rose-400 animate-pulse' : 'text-emerald-300'}`}>
              ${Math.round(state.finances.cash).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Today's Live Revenue / Profit */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1 rounded-lg">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold leading-none">{t('todayRevenue')}</div>
            <div className="text-sm font-bold font-mono-num text-cyan-300">
              ${Math.round(state.finances.revenueToday).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Corporate Valuation or Reputation */}
        {state.corporate.isHoldingsFormed && (
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-950/80 border border-purple-500/30 px-2.5 py-1 rounded-lg">
            <span className="text-[10px] text-purple-400 font-bold uppercase">{t('valuation')}</span>
            <span className="text-xs font-bold font-mono-num text-purple-300">
              ${(state.corporate.enterpriseValuation / 1000).toFixed(0)}k
            </span>
          </div>
        )}

        {/* Reputation Rating */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <div className="text-sm font-bold font-mono-num text-amber-300">
            {(state.reputation / 20).toFixed(1)}
          </div>
        </div>

        {/* Language Option Switcher [ ENG | VI ] */}
        <div className="flex items-center bg-slate-950/80 border border-slate-700/80 rounded-lg p-0.5" title="Switch Language / Chọn ngôn ngữ">
          <button
            onClick={() => {
              soundEngine.playClick();
              setLang('en');
            }}
            className={`px-1.5 py-1 text-[11px] rounded transition font-bold ${
              lang === 'en'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ENG
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setLang('vi');
            }}
            className={`px-1.5 py-1 text-[11px] rounded transition font-bold ${
              lang === 'vi'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            VI
          </button>
        </div>

        {/* Save button */}
        {onSaveGame && (
          <button
            onClick={onSaveGame}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              isSaved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
            title="Save Empire Progress to Local Storage"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isSaved ? t('saved') : t('save')}</span>
          </button>
        )}

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          title={isMuted ? t('soundUnmute') : t('soundMute')}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* GDD Docs */}
        <button
          onClick={onOpenGDD}
          className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold transition hidden sm:flex items-center gap-1"
        >
          <span>{t('gddRoadmap')}</span>
        </button>
      </div>
    </header>
  );
};

