import {
  Upload,
  FileCode,
  Gauge,
  PlusSquare,
  Trash2,
  ArrowRight,
  Repeat1,
  ListRestart
} from "lucide-react";
import { useRef } from "react";

export default function AutoPanel({
  isActive,
  feedRate,
  setFeedRate,
  setSingleBlock,
  onLoad,
  onCreateGroup,
  onDeleteGroup,
  programName,
  setProgramName,
  toggleStates,
  onNext,
  setMode
}) {
  const fileInputRef = useRef(null);
  const greyoutClasses = !isActive
    ? "opacity-30 pointer-events-none grayscale hidden"
    : "opacity-100";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProgramName(file.name);
    }
  };

  return (
    <div
      className={`transition-all duration-500 flex flex-col gap-4 shrink-0 pb-8 ${greyoutClasses}`}
    >
      {/* KHỐI 1: CHỌN FILE NC & GROUP ACTIONS */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl flex flex-col gap-3 w-full">
        <h3 className="text-md font-bold text-slate-300 border-b border-slate-600 pb-2 uppercase tracking-tight">
          NC Program Management
        </h3>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".nc,.txt,.gcode"
        />

        <div className="flex gap-3 mt-2 items-stretch">
          <div
            onClick={() => fileInputRef.current.click()}
            className={`flex-1 border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center transition-all duration-300 ${
              programName !== "No file selected"
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-600 text-slate-500 hover:border-blue-400 hover:bg-slate-700/30"
            } cursor-pointer`}
          >
            <div className="flex items-center mb-1">
              <FileCode
                size={20}
                className={`mr-2 ${programName !== "No file selected" ? "text-blue-400" : "text-slate-500"}`}
              />
              <span
                className={`text-sm font-bold ${programName !== "No file selected" ? "text-slate-200" : "text-slate-500"}`}
              >
                {programName !== "No file selected"
                  ? "File Ready"
                  : "Select NC File"}
              </span>
            </div>
            <p className="text-[10px] truncate max-w-[150px] text-slate-500 italic font-mono">
              {programName}
            </p>
          </div>

          <button
            onClick={onLoad}
            disabled={programName === "No file selected"}
            className={`px-6 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 ${
              programName !== "No file selected"
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40"
                : "bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600"
            }`}
          >
            <Upload size={18} />{" "}
            {toggleStates.loadProgram ? "LOADING..." : "LOAD"}
          </button>
        </div>

        {/* CỤM NÚT GROUP ACTIONS */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onCreateGroup}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 text-xs border ${
              toggleStates.createGroup
                ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-[0.98]"
                : "bg-slate-700/50 border-slate-600 text-slate-400 hover:text-slate-300 hover:bg-slate-700"
            }`}
          >
            <PlusSquare size={16} /> CREATE GROUP
          </button>

          <button
            onClick={onDeleteGroup}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-100 text-xs border ${
              toggleStates.deleteGroup
                ? "bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-[0.95]"
                : "bg-slate-700/50 border-slate-600 text-slate-400 hover:text-red-400 hover:bg-slate-700"
            }`}
          >
            <Trash2 size={16} /> DELETE GROUP
          </button>
        </div>

        <div className="flex gap-2 mt-1">
          <button
            onClick={setSingleBlock}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 text-xs border ${
              toggleStates.isSingleMode
                ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-[0.98]"
                : "bg-slate-700/50 border-slate-600 text-slate-400 hover:text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Repeat1 size={16} /> SINGLE MODE
          </button>

          <button
            onClick={onNext}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-100 text-xs border ${
              toggleStates.triggerNext
                ? "bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-[0.95]"
                : "bg-slate-700/50 border-slate-600 text-slate-400 hover:text-red-400 hover:bg-slate-700"
            }`}
          >
            <ArrowRight size={16} /> NEXT
          </button>

          <button
            onClick={setMode}
            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-100 text-xs border ${
              toggleStates.setMode
                ? "bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-[0.95]"
                : "bg-slate-700/50 border-slate-600 text-slate-400 hover:text-red-400 hover:bg-slate-700"
            }`}
          >
            <ListRestart size={16}/> SET MODE
          </button>
        </div>
      </div>

      {/* KHỐI 2: EXECUTION SETTINGS */}
      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl w-full">
        <h3 className="text-md font-bold text-slate-300 mb-4 border-b border-slate-600 pb-2 uppercase tracking-tight">
          Execution Settings
        </h3>
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-orange-400" />
                <span className="text-sm font-bold text-slate-300">
                  FEED RATE
                </span>
              </div>
              <span className="font-mono font-bold text-orange-400 text-lg">
                {feedRate}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={feedRate}
              onChange={(e) => setFeedRate(e.target.value)}
              className="w-full accent-orange-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
