import React, { useState } from 'react';
import { useSensors } from '../context/SensorContext';
import {
  Gauge,
  Thermometer,
  Activity,
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Cpu,
  Zap,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Snowflake,
  Flame,
  Wind
} from 'lucide-react';

interface IoTMonitoringDashboardProps {
  onNavigateToSettings?: () => void;
  selectedFacilityName?: string;
}

export const IoTMonitoringDashboard: React.FC<IoTMonitoringDashboardProps> = ({
  onNavigateToSettings,
  selectedFacilityName = 'Muhimbili National Hospital (MNH)'
}) => {
  const {
    oxygenData,
    temperatureData,
    historyTimeline,
    gatewayConfig,
    simulatePressureDrop,
    simulateTemperatureSpike,
    resetSimulationToNominal,
    isLiveStreaming,
    toggleLiveStreaming
  } = useSensors();

  const [activeZoneFilter, setActiveZoneFilter] = useState<'all' | 'oxygen' | 'temperature'>('all');

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header & Stream Controls */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                oxygenData.alarmActive || temperatureData.alarmActive
                  ? 'bg-red-500 animate-ping'
                  : 'bg-emerald-500 animate-pulse'
              }`}
            ></span>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <span>IoT Clinical Telemetry & SCADA Monitor</span>
              <span className="text-xs font-mono font-normal text-slate-400">·</span>
              <span className="text-xs font-medium text-[#0F4C81]">{selectedFacilityName}</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sensor telemetry for medical oxygen pressure distribution, ICU climate, and vaccine cold-chain integrity.
          </p>
        </div>

        {/* Action Controls & Stream Pause */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pause/Resume Live Polling */}
          <button
            type="button"
            onClick={toggleLiveStreaming}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              isLiveStreaming
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
            title={isLiveStreaming ? 'Pause live polling' : 'Resume live stream'}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Live Streaming' : 'Stream Paused'}</span>
          </button>

          {/* Test Simulation Triggers */}
          <button
            type="button"
            onClick={simulatePressureDrop}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            title="Inject simulated pressure drop below 3.8 bar threshold"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Test O₂ Drop</span>
          </button>

          <button
            type="button"
            onClick={simulateTemperatureSpike}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            title="Inject simulated vaccine temperature rise above 6°C"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Test Temp Spike</span>
          </button>

          {(oxygenData.alarmActive || temperatureData.alarmActive) && (
            <button
              type="button"
              onClick={resetSimulationToNominal}
              className="px-3 py-1.5 bg-[#0F4C81] hover:bg-[#0B3961] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Nominal</span>
            </button>
          )}

          {onNavigateToSettings && (
            <button
              type="button"
              onClick={onNavigateToSettings}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              title="Open Hardware IoT Gateway Settings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Sensor Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* Alarm Warning Banner when Threshold Breached */}
      {(oxygenData.alarmActive || temperatureData.alarmActive) && (
        <div className="p-4 bg-red-50 border-2 border-red-500/80 rounded-3xl shadow-md text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-700">
                ACTIVE SCADA CRITICAL ALARM
              </h4>
              <p className="text-sm font-bold text-red-900">
                {oxygenData.alarmMessage || temperatureData.alarmMessage}
              </p>
              <span className="text-[11px] text-red-700">
                Automated SMS dispatch notification triggered to on-duty biomedical engineer.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={resetSimulationToNominal}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Acknowledge & Clear Alarm
          </button>
        </div>
      )}

      {/* Active Gateway Telemetry Status Strip */}
      <div className="p-3.5 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Cpu className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>Hardware Gateway: <strong className="text-slate-900 font-mono">{gatewayConfig.gatewayDeviceId}</strong></span>
          </span>
          <span className="hidden sm:inline text-slate-300">·</span>
          <span className="hidden sm:flex items-center gap-1 font-medium">
            <span>Protocol: <strong className="text-slate-900">{gatewayConfig.protocol}</strong></span>
          </span>
          <span className="hidden md:inline text-slate-300">·</span>
          <span className="hidden md:flex items-center gap-1 font-mono text-[11px]">
            <span>Signal RSSI: <strong className="text-emerald-700">{gatewayConfig.signalStrengthDbm} dBm</strong></span>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
          <span>Polling Rate: <strong>{gatewayConfig.pollIntervalSeconds}s</strong></span>
          <span>·</span>
          <span>{oxygenData.lastUpdated}</span>
        </div>
      </div>

      {/* SECTION 1: HOSPITAL OXYGEN PRESSURE & GAS SYSTEM */}
      {(activeZoneFilter === 'all' || activeZoneFilter === 'oxygen') && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 font-display">
                  Medical Gas Pipeline System (MGPS) & Pressure Transducers
                </h4>
                <p className="text-xs text-slate-500">
                  Transducer ID: <span className="font-mono font-semibold text-slate-700">{gatewayConfig.oxygenTransducerId}</span> · Continuous line pressure, flow rate and gas manifold monitoring.
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 text-xs font-bold rounded-full self-start flex items-center gap-1.5 ${
                oxygenData.alarmActive
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  oxygenData.alarmActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'
                }`}
              ></span>
              <span>{oxygenData.status}</span>
            </span>
          </div>

          {/* Primary Pressure Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Main Line Pressure */}
            <div
              className={`p-4 rounded-2xl border transition-all text-center ${
                oxygenData.alarmActive && oxygenData.linePressureBar < 3.8
                  ? 'bg-red-50/80 border-red-400'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Main Line Pressure
              </span>
              <div className="flex items-baseline justify-center gap-1 my-1">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-[#0F4C81]">
                  {oxygenData.linePressureBar}
                </span>
                <span className="text-xs font-bold text-slate-500">bar</span>
              </div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <div>Target: {oxygenData.linePressureTarget} bar (±0.2)</div>
                <div className="font-mono text-emerald-700 font-semibold">
                  Offset Applied: {gatewayConfig.pressureCalibrationOffset > 0 ? `+${gatewayConfig.pressureCalibrationOffset}` : gatewayConfig.pressureCalibrationOffset} bar
                </div>
              </div>
            </div>

            {/* O2 Purity Meter */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Oxygen Purity Sensor
              </span>
              <div className="flex items-baseline justify-center gap-1 my-1">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-emerald-600">
                  {oxygenData.purityPercentage}
                </span>
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                ISO 7396-1 Standard (&gt; 93.0% ± 3%)
              </span>
            </div>

            {/* Flow Rate */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Hospital Consumption
              </span>
              <div className="flex items-baseline justify-center gap-1 my-1">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-800">
                  {oxygenData.flowRateLpm}
                </span>
                <span className="text-xs font-bold text-slate-500">L/min</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                ICU + OT + Wards Total Load
              </span>
            </div>

            {/* Medical Air & Vacuum */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Medical Air & Vacuum
              </span>
              <div className="mt-1 space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Air:</span>
                  <span className="font-bold text-slate-800">{oxygenData.medicalAirPressureBar} bar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vacuum:</span>
                  <span className="font-bold text-slate-800">{oxygenData.vacuumSuctionBar} bar</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Duplex Plants Running</span>
            </div>
          </div>

          {/* Dual Bank Manifold Cylinder Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Bank A */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="text-xs font-bold text-emerald-950">Bank A (Primary 10-Cylinder Manifold)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ONLINE & DISPENSING
                </span>
              </div>
              <div className="w-full bg-emerald-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '86%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-mono text-emerald-900">
                <span>Cylinder Bank Pressure: <strong>{oxygenData.bankAPressureBar} bar</strong></span>
                <span className="font-bold">86% Remaining</span>
              </div>
            </div>

            {/* Bank B */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-bold text-slate-800">Bank B (Standby Auto-Switchover)</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                  STANDBY RESERVE
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#0F4C81] h-full rounded-full transition-all" style={{ width: '96%' }}></div>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-700">
                <span>Cylinder Bank Pressure: <strong>{oxygenData.bankBPressureBar} bar</strong></span>
                <span className="font-bold text-[#0F4C81]">96% Full Reserve</span>
              </div>
            </div>
          </div>

          {/* Historical Pressure Timeline Bar */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Pressure Stability Timeline (Last 10 Readings)
              </span>
              <span className="text-slate-400 font-mono text-[10px]">Sample Interval: {gatewayConfig.pollIntervalSeconds}s</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {historyTimeline.map((item, idx) => (
                <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200 text-center font-mono">
                  <span className="text-[9px] text-slate-400 block truncate">{item.timestamp}</span>
                  <span
                    className={`text-xs font-bold mt-0.5 block ${
                      item.linePressure < 3.8 ? 'text-red-600' : 'text-[#0F4C81]'
                    }`}
                  >
                    {item.linePressure} bar
                  </span>
                  <span className="text-[9px] text-emerald-600">{item.purity}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: HOSPITAL TEMPERATURE, CLIMATE & COLD CHAIN MONITORING */}
      {(activeZoneFilter === 'all' || activeZoneFilter === 'temperature') && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0F4C81] flex items-center justify-center">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 font-display">
                  Hospital Ambient Climate & Vaccine Cold-Chain Telemetry
                </h4>
                <p className="text-xs text-slate-500">
                  Sensor ID: <span className="font-mono font-semibold text-slate-700">{gatewayConfig.tempSensorDeviceId}</span> · Precision PT100 RTD wireless environmental loggers.
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 text-xs font-bold rounded-full self-start flex items-center gap-1.5 ${
                temperatureData.alarmActive
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  temperatureData.alarmActive ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'
                }`}
              ></span>
              <span>{temperatureData.status}</span>
            </span>
          </div>

          {/* 4 Clinical Climate Zones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Zone 1: Vaccine Storage */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                temperatureData.alarmActive && temperatureData.vaccineColdChainTempC > 6.0
                  ? 'bg-amber-50/80 border-amber-400'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Vaccine Cold-Chain
                </span>
                <Snowflake className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-baseline justify-center gap-1 my-2">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                  {temperatureData.vaccineColdChainTempC}
                </span>
                <span className="text-xs font-bold text-slate-500">°C</span>
              </div>
              <div className="text-[10px] text-center text-slate-400 space-y-0.5">
                <div>WHO Target: 2.0 °C to 6.0 °C</div>
                <span className="font-semibold text-emerald-700">Datalogger Active</span>
              </div>
            </div>

            {/* Zone 2: Main Operating Theatre */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Operating Theatre (OT)
                </span>
                <Wind className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline justify-center gap-1 my-2">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                  {temperatureData.theatreTempC}
                </span>
                <span className="text-xs font-bold text-slate-500">°C</span>
              </div>
              <div className="text-[10px] text-center text-slate-400 space-y-0.5">
                <div>Humidity: {temperatureData.theatreHumidityPercent}% RH</div>
                <span className="font-semibold text-emerald-700">Laminar Airflow Nominal</span>
              </div>
            </div>

            {/* Zone 3: ICU Ambient */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Main ICU Ward Climate
                </span>
                <Activity className="w-4 h-4 text-[#0F4C81]" />
              </div>
              <div className="flex items-baseline justify-center gap-1 my-2">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                  {temperatureData.icuAmbientTempC}
                </span>
                <span className="text-xs font-bold text-slate-500">°C</span>
              </div>
              <div className="text-[10px] text-center text-slate-400 space-y-0.5">
                <div>Humidity: {temperatureData.icuHumidityPercent}% RH</div>
                <span className="font-semibold text-emerald-700">Patient Comfort Standard</span>
              </div>
            </div>

            {/* Zone 4: MRI Superconductive Helium Cryostat */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  MRI Cryostat (Kelvin)
                </span>
                <Radio className="w-4 h-4 text-[#0F4C81]" />
              </div>
              <div className="flex items-baseline justify-center gap-1 my-2">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-[#0F4C81]">
                  {temperatureData.mriCryostatTempKelvin}
                </span>
                <span className="text-xs font-bold text-slate-500">K</span>
              </div>
              <div className="text-[10px] text-center text-slate-400 space-y-0.5">
                <div>Liquid Helium: {temperatureData.mriHeliumLevelPercent}%</div>
                <span className="font-semibold text-emerald-700">-268.97 °C Superconductive</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Integration Navigation Helper */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-[#0F4C81] text-white rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h5 className="text-xs font-bold">Project Real Results & Hardware Calibration</h5>
            <p className="text-[11px] text-slate-300">
              Configure your live Modbus, MQTT broker, transducer offsets, and high/low alarm limits in Settings.
            </p>
          </div>
        </div>
        {onNavigateToSettings && (
          <button
            type="button"
            onClick={onNavigateToSettings}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Sensor Settings</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
