import { Crosshair } from 'lucide-react';

export default function AxisDisplay({ x = 0, y = 0, z = 0 }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <Crosshair className="text-blue-400" size={24} />
        <h2 className="text-lg font-bold text-slate-200">ACTUAL POSITION</h2>
      </div>
      <div className="flex gap-2 justify-between">
        {['X', 'Y', 'Z'].map((axis, i) => {
          const rawValue = [x, y, z][i] || 0; 
          return (
            <div key={axis} className="flex-1 flex items-center bg-slate-900 rounded-lg p-2 border border-slate-600">
              <span className="text-xl font-bold text-slate-400 w-6">{axis}</span>
              <input 
                type="text" readOnly value={Number(rawValue).toFixed(3)} 
                className="bg-transparent text-right text-2xl font-mono text-green-400 w-full outline-none"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}