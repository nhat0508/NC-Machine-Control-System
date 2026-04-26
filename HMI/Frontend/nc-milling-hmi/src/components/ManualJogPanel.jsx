import { Play, MoveUp, MoveDown, MoveLeft, MoveRight, ArrowUpFromLine, ArrowDownToLine } from 'lucide-react';

export default function ManualJogPanel({ isActive, targetPos, setTargetPos, onMoveToPos, onJog, jogStates = {} }) {
  const greyoutClasses = !isActive ? 'opacity-30 pointer-events-none grayscale hidden' : 'opacity-100';

  const getJogStyle = (variableName) => {
    return jogStates[variableName] 
      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-[0.95]' 
      : 'bg-slate-700 hover:bg-slate-600 text-slate-100';
  };

  const jogEvents = (axis, dir) => ({
    onMouseDown: () => onJog(axis, dir, true),
    onMouseUp: () => onJog(axis, dir, false),
    onMouseLeave: () => onJog(axis, dir, false),
    onTouchStart: () => onJog(axis, dir, true),
    onTouchEnd: () => onJog(axis, dir, false)
  });

  return (
    <div className={`transition-all duration-500 flex flex-col gap-6 shrink-0 ${greyoutClasses}`}>
      
      {/* KHỐI 1: MANUAL ENTRY */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl flex flex-col w-full">
        <h3 className="text-md font-bold text-slate-300 mb-4 border-b border-slate-600 pb-2">MANUAL ENTRY</h3>
        <div className="flex gap-3 mb-4">
          {['X', 'Y', 'Z'].map((axis) => (
            <div key={axis} className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-bold text-slate-400 pl-1">{axis}</label>
              <input 
                type="number" placeholder="0.00" value={targetPos[axis]}
                onChange={(e) => setTargetPos({...targetPos, [axis]: e.target.value})}
                className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-center text-white w-full outline-none focus:border-blue-500 transition" 
              />
            </div>
          ))}
        </div>
        <button onClick={onMoveToPos} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-lg flex justify-center items-center gap-2 shadow-lg active:scale-95 transition">
          <Play size={18} /> MOVE TO POS
        </button>
      </div>

      {/* KHỐI 2: JOG CONTROLS */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl flex flex-col w-full">
        <h3 className="text-md font-bold text-slate-300 mb-4 border-b border-slate-600 pb-2">JOG CONTROLS</h3>
        <div className="flex gap-6 justify-center items-center">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <button {...jogEvents('Y', 'plus')} className={`p-4 rounded-lg shadow-md transition-all select-none touch-none flex justify-center items-center ${getJogStyle('Main.yPlus')}`}>
              <MoveUp size={24}/>
            </button>
            <div />
            <button {...jogEvents('X', 'minus')} className={`p-4 rounded-lg shadow-md transition-all select-none touch-none flex justify-center items-center ${getJogStyle('Main.xMinus')}`}>
              <MoveLeft size={24}/>
            </button>
            <div className="flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-500"/>
            </div>
            <button {...jogEvents('X', 'plus')} className={`p-4 rounded-lg shadow-md transition-all select-none touch-none flex justify-center items-center ${getJogStyle('Main.xPlus')}`}>
              <MoveRight size={24}/>
            </button>
            <div />
            <button {...jogEvents('Y', 'minus')} className={`p-4 rounded-lg shadow-md transition-all select-none touch-none flex justify-center items-center ${getJogStyle('Main.yMinus')}`}>
              <MoveDown size={24}/>
            </button>
            <div />
          </div>
          <div className="flex flex-col gap-2">
            <button {...jogEvents('Z', 'plus')} className={`p-4 rounded-lg shadow-md transition-all select-none touch-none flex flex-col items-center justify-center ${getJogStyle('Main.zPlus')}`}>
              <ArrowUpFromLine size={24}/>
              <span className="text-[10px] font-bold mt-1">+Z</span>
            </button>
            <button {...jogEvents('Z', 'minus')} className={`p-4 rounded-lg shadow-md transition-all select-none touch-none flex flex-col items-center justify-center ${getJogStyle('Main.zMinus')}`}>
              <ArrowDownToLine size={24}/>
              <span className="text-[10px] font-bold mt-1">-Z</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}