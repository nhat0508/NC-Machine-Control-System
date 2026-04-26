import { useState, useEffect } from "react";
import {
  Gamepad2,
  PlaySquare,
  Play,
  Square,
  RotateCcw,
  Power,
  LogOut
} from "lucide-react";

import AxisDisplay from "./AxisDisplay";
import ManualJogPanel from "./ManualJogPanel";
import AutoPanel from "./AutoPanel";
import Machine3D from "./Machine3D";

function CNCDashboard({ onLogout, socket }) {
  // CNC states
  const [plcConnected, setPlcConnected] = useState(false);
  const [activeMode, setActiveMode] = useState("MANUAL");
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0, z: 0 });
  const [targetPos, setTargetPos] = useState({ X: "", Y: "", Z: "" });
  const [feedRate, setFeedRate] = useState(100);
  const [programName, setProgramName] = useState("No file selected");

  const [toggleStates, setToggleStates] = useState({
    start: false, stop: false, reset: false, enable: false,
    loadProgram: false, createGroup: false, deleteGroup: false,
    isSingleMode: false, triggerNext: false, setMode : false
  });

  const [jogStates, setJogStates] = useState({});

  // Listen to PLC State
  useEffect(() => {
    socket.on("plcState", (state) => {
      setPlcConnected(state.connected);
      setCurrentPos({
        x: state.axes?.x?.value || 0,
        y: state.axes?.y?.value || 0,
        z: state.axes?.z?.value || 0,
      });
      if (state.mode?.manual) setActiveMode("MANUAL");
      if (state.mode?.auto) setActiveMode("AUTO");
    });
    return () => socket.off("plcState");
  }, [socket]);

  const sendCommand = (path, value, plcVariable = null) => {
    socket.emit("updatePLC", { path, value, plcVariable });
  };

  const handleFeedRateChange = (newVal) => {
    const value = Number(newVal);
    setFeedRate(value);
    sendCommand("nc.feedRate", value, "Main.feedRate");
  };

  const handleToggleCommand = (key, path, plcVariable) => {
    setToggleStates((prev) => {
      const newState = !prev[key];
      sendCommand(path, newState, plcVariable);
      return { ...prev, [key]: newState };
    });
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    const isManual = mode === "MANUAL";
    sendCommand("mode.manual", isManual, "Main.Manual");
    sendCommand("mode.auto", !isManual, "Main.Auto");
  };

  const handleEnable = () => handleToggleCommand("enable", "nc.enable", "Main.Enable");
  const handleCycleStart = () => handleToggleCommand("start", "nc.start", "Main.start");
  const handleCycleStop = () => handleToggleCommand("stop", "nc.stop", "Main.stop");
  const handleReset = () => handleToggleCommand("reset", "nc.reset", "Main.reset");

  const handleMoveToPos = () => {
    sendCommand("targetPos.x", Number(targetPos.X), "Main.targetX");
    sendCommand("targetPos.y", Number(targetPos.Y), "Main.targetY");
    sendCommand("targetPos.z", Number(targetPos.Z), "Main.targetZ");
    sendCommand("btn.moveToPos", true, "Main.moveToPos");
    setTimeout(() => sendCommand("btn.moveToPos", false, "Main.moveToPos"), 200);
  };

  const handleJog = (axis, dir, isPressed) => {
    const varName = `Main.${axis.toLowerCase()}${dir === "plus" ? "Plus" : "Minus"}`;
    setJogStates((prev) => {
      if (prev[varName] === isPressed) return prev;
      sendCommand(`axes.${axis}.jog.${dir}`, isPressed, varName);
      return { ...prev, [varName]: isPressed };
    });
  };

  const handleCreateGroup = () => handleToggleCommand("createGroup", "nc.createGroup", "Main.createGroup");

  const handleLoadFile = () => {
    if (programName !== "No file selected") {
      sendCommand("nc.programName", programName, "Main.progName");
      setToggleStates(prev => ({ ...prev, loadProgram: true }));
      sendCommand("btn.loadProgram", true, "Main.loadProgram");
      setTimeout(() => {
        setToggleStates(prev => ({ ...prev, loadProgram: false }));
        sendCommand("btn.loadProgram", false, "Main.loadProgram");
      }, 500);
    }
  };

  const handleDeleteGroup = () => {
    setToggleStates(prev => ({ ...prev, deleteGroup: true }));
    sendCommand('nc.deleteGroup', true, 'Main.deleteGroup');
    setProgramName("No file selected");
    setTimeout(() => {
      setToggleStates(prev => ({ ...prev, deleteGroup: false }));
      sendCommand('nc.deleteGroup', false, 'Main.deleteGroup');
    }, 200);
  };

  const handleSingleBlockToggle = () => handleToggleCommand("isSingleMode", "nc.isSingleMode", "Main.isSingleMode");

  const handleNext = () => {
    setToggleStates(prev => ({ ...prev, triggerNext: true }));
    sendCommand('nc.triggerNext', true, 'Main.triggerNext');
    setTimeout(() => {
      setToggleStates(prev => ({ ...prev, triggerNext: false }));
      sendCommand('nc.triggerNext', false, 'Main.triggerNext');
    }, 200);    
  };

  const handleSetMode = () => {
    setToggleStates(prev => ({ ...prev, setMode: true }));
    sendCommand('nc.setMode', true, 'Main.setMode');
    setTimeout(() => {
      setToggleStates(prev => ({ ...prev, setMode: false }));
      sendCommand('nc.setMode', false, 'Main.setMode');
    }, 200);    
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 p-4 gap-4 font-sans overflow-hidden relative w-full">
      
      {/* Logout Button */}
      <button 
        onClick={onLogout}
        className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold border border-red-500 transition-colors"
      >
        <LogOut size={16} /> LOGOUT
      </button>

      <div className="w-[30%] min-w-[420px] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {/* Connection Status */}
        <div className={`p-2 rounded-lg text-center text-xs font-bold border ${plcConnected ? "bg-green-900/50 text-green-400 border-green-800" : "bg-red-900/50 text-red-400 border-red-800"}`}>
          {plcConnected ? "🟢 PLC CONNECTED" : "🔴 PLC DISCONNECTED"}
        </div>

        {/* Axis Display */}
        <AxisDisplay x={currentPos.x} y={currentPos.y} z={currentPos.z} />

        {/* Main Controls */}
        <div className="flex gap-3">
          <button onClick={handleCycleStart} className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-all ${toggleStates.start ? "bg-green-600 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)]" : "bg-green-950/40 border-green-900 text-slate-500"}`}>
            <Play size={18} /> START
          </button>
          <button onClick={handleCycleStop} className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-all ${toggleStates.stop ? "bg-red-600 border-red-400 shadow-[0_0_15px_rgba(248,113,113,0.4)]" : "bg-red-950/40 border-red-900 text-slate-500"}`}>
            <Square size={18} /> STOP
          </button>
          <button onClick={handleReset} className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-all ${toggleStates.reset ? "bg-yellow-600 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]" : "bg-yellow-950/40 border-yellow-900 text-slate-500"}`}>
            <RotateCcw size={18} /> RESET
          </button>
        </div>

        {/* Mode & Enable */}
        <div className="flex gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
          <button onClick={() => handleModeChange("MANUAL")} className={`flex-1 py-2 rounded-lg font-bold flex flex-col items-center text-xs transition-all ${activeMode === "MANUAL" ? "bg-orange-600 text-white shadow-lg" : "bg-slate-700/50 text-slate-500"}`}>
            <Gamepad2 size={18} /> MANUAL
          </button>
          <button onClick={() => handleModeChange("AUTO")} className={`flex-1 py-2 rounded-lg font-bold flex flex-col items-center text-xs transition-all ${activeMode === "AUTO" ? "bg-green-600 text-white shadow-lg" : "bg-slate-700/50 text-slate-500"}`}>
            <PlaySquare size={18} /> AUTO
          </button>
          <button onClick={handleEnable} className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 border transition-all ${toggleStates.enable ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" : "bg-blue-950/40 border-blue-900 text-slate-500"}`}>
            <Power size={18} /> ENABLE
          </button>
        </div>

        {/* Panels */}
        <ManualJogPanel isActive={activeMode === "MANUAL"} targetPos={targetPos} setTargetPos={setTargetPos} onMoveToPos={handleMoveToPos} onJog={handleJog} jogStates={jogStates} />
        
        <AutoPanel 
          isActive={activeMode === "AUTO"} feedRate={feedRate} setFeedRate={handleFeedRateChange}
          setSingleBlock={handleSingleBlockToggle} onLoad={handleLoadFile} onCreateGroup={handleCreateGroup} 
          onDeleteGroup={handleDeleteGroup} programName={programName} setProgramName={setProgramName}
          toggleStates={toggleStates} onNext={handleNext} setMode={handleSetMode}
        />
      </div>

      {/* 3D Visualization */}
      <div className="flex-1 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10 bg-slate-900/80 p-2 rounded-lg border border-slate-700 pointer-events-none">
          <span className="text-sm font-bold text-blue-400 tracking-wider uppercase">3D Machine View</span>
        </div>
        <div className="flex-1 w-full h-full">
          <Machine3D x={currentPos.x} y={currentPos.y} z={currentPos.z} feedRate={feedRate} />
        </div>
      </div>
    </div>
  );
}

export default CNCDashboard;