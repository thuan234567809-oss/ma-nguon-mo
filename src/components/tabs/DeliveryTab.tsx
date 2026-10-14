import React from 'react';
import { GameState } from '../../types/game';
import { Bike, CloudRain, Check, X, Clock } from 'lucide-react';
import { soundEngine } from '../../engine/soundEngine';
import { useLanguage } from '../../context/LanguageContext';

interface DeliveryTabProps {
  state: GameState;
  onTogglePlatform: (platformId: string) => void;
  onBuyScooter: () => void;
}

export const DeliveryTab: React.FC<DeliveryTabProps> = ({ state, onTogglePlatform, onBuyScooter }) => {
  const { lang } = useLanguage();
  const isRain = state.weather === 'rain' || state.weather === 'heavy_rain';
  const scooterCost = 450;

  return (
    <div className="space-y-4 select-none">
      {/* Weather Rain Synergy Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
        isRain ? 'bg-blue-500/15 border-blue-500/40 text-blue-200 shadow-lg' : 'bg-slate-900/70 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isRain ? 'bg-blue-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
            <CloudRain className={`w-5 h-5 ${isRain ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
              <span>{lang === 'vi' ? 'Điều Phối Giao Hàng & Bùng Nổ Đơn Mùa Mưa' : 'Dynamic Delivery Logistics & Weather Surge'}</span>
              {isRain && (
                <span className="text-[10px] bg-blue-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  {lang === 'vi' ? 'MƯA BÙNG NỔ ĐƠN +140%' : 'RAIN DEMAND +140%'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'vi'
                ? 'Khi trời mưa bão, lượng khách đi bộ vào quán giảm mạnh, nhưng lượng đơn đặt giao hàng online tăng đột biến!'
                : 'During rain and stormy weather, walk-in pedestrian traffic drops sharply, while online delivery orders surge!'}
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-[10px] text-slate-400 uppercase">
            {lang === 'vi' ? 'Doanh Thu Giao Hàng Hôm Nay' : "Today's Delivery Sales"}
          </div>
          <div className="text-sm font-bold font-mono-num text-emerald-400">
            ${state.deliveryRevenueToday.toFixed(2)} ({state.deliveredOrdersToday} {lang === 'vi' ? 'đơn' : 'orders'})
          </div>
        </div>
      </div>

      {/* Third-Party Delivery Aggregators */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Bike className="w-4 h-4 text-emerald-400" />{' '}
            {lang === 'vi' ? 'Các Ứng Dụng Đặt Đồ Ăn Trực Tuyến' : 'Online Food Delivery Platforms'}
          </h3>
          <span className="text-[10px] text-slate-400">
            {lang === 'vi' ? 'Bật/tắt ứng dụng để nhận đơn giao hàng' : 'Toggle apps to accept online delivery tickets'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {state.deliveryPlatforms.map((platform) => (
            <div
              key={platform.id}
              className={`p-3 rounded-xl border transition ${
                platform.active
                  ? 'bg-slate-950/80 border-emerald-500/40 shadow-md shadow-emerald-500/5'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-100">{platform.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'vi' ? 'Hoa hồng sàn: ' : 'Commission: '}
                    <strong className="text-rose-400 font-mono-num">{platform.commissionPct}%</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onTogglePlatform(platform.id);
                  }}
                  className={`p-1.5 rounded-lg border transition ${
                    platform.active
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={platform.active ? (lang === 'vi' ? 'Ngưng nhận đơn' : 'Offline') : (lang === 'vi' ? 'Mở nhận đơn' : 'Accept')}
                >
                  {platform.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  {lang === 'vi' ? 'Lượng đơn: ' : 'Traffic: '}
                  <strong className="text-amber-300 font-mono-num">{platform.orderMultiplier}x</strong>
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  {platform.active ? (lang === 'vi' ? 'Đang Nhận Đơn' : 'Accepting Orders') : (lang === 'vi' ? 'Tạm Ngưng' : 'Offline')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Orders Live Dispatch Ticker */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />{' '}
            {lang === 'vi' ? 'Hàng Đợi Điều Phối Đơn Hàng' : 'Active Dispatch Queue'} ({state.activeDeliveryOrders.length})
          </h3>
          <span className="text-[10px] text-slate-400">
            {lang === 'vi' ? 'Đơn đang nấu & đang giao' : 'Orders in prep & delivery'}
          </span>
        </div>

        {state.activeDeliveryOrders.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800/60">
            {lang === 'vi'
              ? 'Hiện không có đơn giao hàng nào trong hàng đợi. Hãy bật ít nhất một ứng dụng giao đồ ăn!'
              : 'No active delivery orders currently queued. Ensure at least one platform is active!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto">
            {state.activeDeliveryOrders.map((order) => {
              const statusColors = {
                preparing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                ready_pickup: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                delivering: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                delivered: 'bg-slate-800 text-slate-400 border-slate-700',
              };
              const statusVi = {
                preparing: 'Đang nấu',
                ready_pickup: 'Chờ lấy',
                delivering: 'Đang giao',
                delivered: 'Đã giao',
              };

              return (
                <div key={order.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200 flex items-center gap-2">
                      <span>{order.menuItemName}</span>
                      <span className="text-[10px] font-mono-num text-emerald-400 font-semibold">${order.price.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lang === 'vi' ? 'Giao đến: ' : 'To: '}{order.customerName} • {lang === 'vi' ? 'qua ' : 'via '}{order.appSource}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                      {lang === 'vi' ? statusVi[order.status] : order.status.replace('_', ' ')}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono-num mt-1">
                      {Math.round(order.timeElapsed)}s / {order.timeLimit}s {lang === 'vi' ? 'hạn mức' : 'limit'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* In-House Scooter Delivery Fleet */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-100">
              {lang === 'vi' ? 'Đội Xe Máy Giao Hàng Nội Bộ Riêng' : 'In-House Dedicated Delivery Scooters'}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'vi'
                ? `Đang sở hữu ${state.ownedScooters} xe máy giao hàng. Tăng +50% tốc độ lấy món và giảm tỷ lệ hủy đơn!`
                : `Own ${state.ownedScooters} delivery scooters. Accelerates pickup speed by +50% and reduces cancellation rates!`}
            </div>
          </div>
        </div>

        <button
          disabled={state.finances.cash < scooterCost}
          onClick={() => {
            soundEngine.playClick();
            onBuyScooter();
          }}
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
        >
          {lang === 'vi' ? `Mua Xe Máy ($${scooterCost})` : `Buy Scooter ($${scooterCost})`}
        </button>
      </div>
    </div>
  );
};
