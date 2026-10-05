import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OxygenPressureSensors {
  linePressureBar: number;
  linePressureTarget: number;
  purityPercentage: number;
  bankAPressureBar: number;
  bankBPressureBar: number;
  activeBank: 'Bank A (Primary)' | 'Bank B (Standby)';
  medicalAirPressureBar: number;
  vacuumSuctionBar: number;
  flowRateLpm: number;
  liquidO2TankLevelPercent: number;
  liquidO2PressureBar: number;
  status: 'Nominal / Optimal' | 'Warning: Pressure Drop' | 'Critical Alarm';
  alarmActive: boolean;
  alarmMessage?: string;
  lastUpdated: string;
}

export interface HospitalTemperatureSensors {
  icuAmbientTempC: number;
  icuHumidityPercent: number;
  theatreTempC: number;
  theatreHumidityPercent: number;
  vaccineColdChainTempC: number;
  bloodBankFridgeTempC: number;
  ultraLowFreezerTempC: number;
  mriCryostatTempKelvin: number;
  mriHeliumLevelPercent: number;
  status: 'All Zones Normal' | 'Cold Chain Alert' | 'Climate Drift';
  alarmActive: boolean;
  alarmMessage?: string;
  lastUpdated: string;
}

export interface TelemetryDataPoint {
  timestamp: string;
  linePressure: number;
  purity: number;
  icuTemp: number;
  vaccineTemp: number;
  mriCryoTemp: number;
}

export interface SensorGatewayConfig {
  connectionMode: 'simulation' | 'hardware_gateway';
  mqttBrokerUrl: string;
  gatewayDeviceId: string;
  oxygenTransducerId: string;
  tempSensorDeviceId: string;
  protocol: 'MQTT / TLS' | 'Modbus RS-485' | 'LoRaWAN IoT' | 'REST Webhook';
  pollIntervalSeconds: number;
  pressureCalibrationOffset: number; // e.g. -0.05 to +0.05 bar
  temperatureCalibrationOffset: number; // e.g. -0.5 to +0.5 °C
  minOxygenThresholdBar: number; // default 3.80
  maxOxygenThresholdBar: number; // default 4.60
  maxVaccineTempThresholdC: number; // default 6.0
  minVaccineTempThresholdC: number; // default 2.0
  autoSwitchoverThresholdBar: number; // default 20.0 bar on bank
  lastCalibratedDate: string;
  signalStrengthDbm: number;
  batteryVoltageV: number;
  isOnline: boolean;
}

const DEFAULT_GATEWAY_CONFIG: SensorGatewayConfig = {
  connectionMode: 'simulation',
  mqttBrokerUrl: 'mqtts://telemetry.coremedtech.co.tz:8883/v1/sensors',
  gatewayDeviceId: 'CMT-GW-DAR-KJT-01',
  oxygenTransducerId: 'PT-420-O2-MNH-MAIN',
  tempSensorDeviceId: 'RTD-PT100-ICU-Z1',
  protocol: 'Modbus RS-485',
  pollIntervalSeconds: 3,
  pressureCalibrationOffset: 0.0,
  temperatureCalibrationOffset: 0.0,
  minOxygenThresholdBar: 3.80,
  maxOxygenThresholdBar: 4.60,
  maxVaccineTempThresholdC: 6.0,
  minVaccineTempThresholdC: 2.0,
  autoSwitchoverThresholdBar: 25.0,
  lastCalibratedDate: '2026-08-15 (Accredited by TMDA & TBS)',
  signalStrengthDbm: -68,
  batteryVoltageV: 24.2,
  isOnline: true,
};

interface SensorContextType {
  oxygenData: OxygenPressureSensors;
  temperatureData: HospitalTemperatureSensors;
  historyTimeline: TelemetryDataPoint[];
  gatewayConfig: SensorGatewayConfig;
  updateGatewayConfig: (newConfig: Partial<SensorGatewayConfig>) => void;
  resetGatewayConfig: () => void;
  testSensorHardwarePing: () => Promise<{ success: boolean; latencyMs: number; rssi: number; message: string }>;
  simulatePressureDrop: () => void;
  simulateTemperatureSpike: () => void;
  resetSimulationToNominal: () => void;
  isLiveStreaming: boolean;
  toggleLiveStreaming: () => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Config with localStorage persistence
  const [gatewayConfig, setGatewayConfig] = useState<SensorGatewayConfig>(() => {
    try {
      const saved = localStorage.getItem('coremed_sensor_gateway_config');
      if (saved) {
        return { ...DEFAULT_GATEWAY_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read sensor config from localStorage', e);
    }
    return DEFAULT_GATEWAY_CONFIG;
  });

  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Oxygen Live State
  const [oxygenData, setOxygenData] = useState<OxygenPressureSensors>({
    linePressureBar: 4.18,
    linePressureTarget: 4.20,
    purityPercentage: 94.8,
    bankAPressureBar: 138.4,
    bankBPressureBar: 145.0,
    activeBank: 'Bank A (Primary)',
    medicalAirPressureBar: 7.22,
    vacuumSuctionBar: -0.68,
    flowRateLpm: 342.0,
    liquidO2TankLevelPercent: 88.5,
    liquidO2PressureBar: 10.4,
    status: 'Nominal / Optimal',
    alarmActive: false,
    lastUpdated: 'Live · Just now',
  });

  // Temperature Live State
  const [temperatureData, setTemperatureData] = useState<HospitalTemperatureSensors>({
    icuAmbientTempC: 22.4,
    icuHumidityPercent: 52,
    theatreTempC: 19.6,
    theatreHumidityPercent: 48,
    vaccineColdChainTempC: 3.8,
    bloodBankFridgeTempC: 4.1,
    ultraLowFreezerTempC: -80.4,
    mriCryostatTempKelvin: 4.18,
    mriHeliumLevelPercent: 98.4,
    status: 'All Zones Normal',
    alarmActive: false,
    lastUpdated: 'Live · Just now',
  });

  // Sparkline Historical Timeline
  const [historyTimeline, setHistoryTimeline] = useState<TelemetryDataPoint[]>([
    { timestamp: '10m ago', linePressure: 4.19, purity: 94.7, icuTemp: 22.3, vaccineTemp: 3.7, mriCryoTemp: 4.18 },
    { timestamp: '8m ago', linePressure: 4.18, purity: 94.8, icuTemp: 22.4, vaccineTemp: 3.8, mriCryoTemp: 4.18 },
    { timestamp: '6m ago', linePressure: 4.20, purity: 94.9, icuTemp: 22.5, vaccineTemp: 3.9, mriCryoTemp: 4.19 },
    { timestamp: '4m ago', linePressure: 4.17, purity: 94.7, icuTemp: 22.4, vaccineTemp: 3.8, mriCryoTemp: 4.18 },
    { timestamp: '2m ago', linePressure: 4.18, purity: 94.8, icuTemp: 22.4, vaccineTemp: 3.8, mriCryoTemp: 4.18 },
    { timestamp: 'Just now', linePressure: 4.18, purity: 94.8, icuTemp: 22.4, vaccineTemp: 3.8, mriCryoTemp: 4.18 },
  ]);

  // Persist Gateway Config changes
  const updateGatewayConfig = (newConfig: Partial<SensorGatewayConfig>) => {
    setGatewayConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem('coremed_sensor_gateway_config', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save sensor config to localStorage', e);
      }
      return updated;
    });
  };

  const resetGatewayConfig = () => {
    setGatewayConfig(DEFAULT_GATEWAY_CONFIG);
    try {
      localStorage.removeItem('coremed_sensor_gateway_config');
    } catch (e) {
      console.warn('Could not clear sensor config from localStorage', e);
    }
  };

  // Hardware Handshake Ping Simulation
  const testSensorHardwarePing = async () => {
    return new Promise<{ success: boolean; latencyMs: number; rssi: number; message: string }>((resolve) => {
      setTimeout(() => {
        const latency = Math.floor(14 + Math.random() * 12);
        const rssi = -65 - Math.floor(Math.random() * 8);
        resolve({
          success: true,
          latencyMs: latency,
          rssi: rssi,
          message: `Hardware ACK received from ${gatewayConfig.gatewayDeviceId} via ${gatewayConfig.protocol}. Transducer ${gatewayConfig.oxygenTransducerId} online (24V DC).`,
        });
      }, 700);
    });
  };

  // Simulation Injections
  const simulatePressureDrop = () => {
    setOxygenData((prev) => ({
      ...prev,
      linePressureBar: 3.65, // Below 3.8 threshold
      status: 'Critical Alarm',
      alarmActive: true,
      alarmMessage: 'CRITICAL LOW PRESSURE: Distribution Line at 3.65 bar (Threshold < 3.80 bar)!',
      lastUpdated: 'Live · ALARM TRIGGERED',
    }));
  };

  const simulateTemperatureSpike = () => {
    setTemperatureData((prev) => ({
      ...prev,
      vaccineColdChainTempC: 7.8, // Above 6.0 threshold
      status: 'Cold Chain Alert',
      alarmActive: true,
      alarmMessage: 'VACCINE COLD CHAIN BREACH: Temperature 7.8 °C (Safe limit: 2.0 - 6.0 °C)!',
      lastUpdated: 'Live · ALARM TRIGGERED',
    }));
  };

  const resetSimulationToNominal = () => {
    setOxygenData((prev) => ({
      ...prev,
      linePressureBar: 4.18 + gatewayConfig.pressureCalibrationOffset,
      status: 'Nominal / Optimal',
      alarmActive: false,
      alarmMessage: undefined,
      lastUpdated: 'Live · Reset to Nominal',
    }));
    setTemperatureData((prev) => ({
      ...prev,
      vaccineColdChainTempC: 3.8 + gatewayConfig.temperatureCalibrationOffset,
      status: 'All Zones Normal',
      alarmActive: false,
      alarmMessage: undefined,
      lastUpdated: 'Live · Reset to Nominal',
    }));
  };

  const toggleLiveStreaming = () => {
    setIsLiveStreaming((prev) => !prev);
  };

  // Dynamic Telemetry Polling Effect incorporating offsets and thresholds
  useEffect(() => {
    if (!isLiveStreaming) return;

    const intervalTime = (gatewayConfig.pollIntervalSeconds || 3) * 1000;

    const timer = setInterval(() => {
      // Calculate realistic variations
      const pOffset = gatewayConfig.pressureCalibrationOffset || 0;
      const tOffset = gatewayConfig.temperatureCalibrationOffset || 0;

      const randomJitterPressure = (Math.random() * 0.04 - 0.02);
      const newLinePressure = Number((4.18 + pOffset + randomJitterPressure).toFixed(2));
      const newPurity = Number((94.8 + (Math.random() * 0.2 - 0.1)).toFixed(1));
      const newFlowRate = Number((340 + (Math.random() * 10 - 5)).toFixed(1));

      const newIcuTemp = Number((22.4 + tOffset + (Math.random() * 0.2 - 0.1)).toFixed(1));
      const newVaccineTemp = Number((3.8 + tOffset + (Math.random() * 0.1 - 0.05)).toFixed(1));
      const newCryoTemp = Number((4.18 + (Math.random() * 0.02 - 0.01)).toFixed(2));

      // Threshold evaluations
      const isPressureLow = newLinePressure < gatewayConfig.minOxygenThresholdBar;
      const isPressureHigh = newLinePressure > gatewayConfig.maxOxygenThresholdBar;
      const isVaccineWarm = newVaccineTemp > gatewayConfig.maxVaccineTempThresholdC;

      setOxygenData((prev) => {
        // Keep simulated drop if explicitly injected unless user resets
        if (prev.alarmActive && prev.linePressureBar < 3.7) {
          return prev;
        }
        return {
          ...prev,
          linePressureBar: newLinePressure,
          purityPercentage: newPurity,
          flowRateLpm: newFlowRate,
          status: isPressureLow
            ? 'Critical Alarm'
            : isPressureHigh
            ? 'Warning: Pressure Drop'
            : 'Nominal / Optimal',
          alarmActive: isPressureLow || isPressureHigh,
          alarmMessage: isPressureLow
            ? `Low Line Pressure Alert (${newLinePressure} bar < ${gatewayConfig.minOxygenThresholdBar} bar)`
            : isPressureHigh
            ? `High Pressure Alarm (${newLinePressure} bar > ${gatewayConfig.maxOxygenThresholdBar} bar)`
            : undefined,
          lastUpdated: `Live · ${new Date().toLocaleTimeString()} (Polled ${gatewayConfig.pollIntervalSeconds}s)`,
        };
      });

      setTemperatureData((prev) => {
        if (prev.alarmActive && prev.vaccineColdChainTempC > 7.0) {
          return prev;
        }
        return {
          ...prev,
          icuAmbientTempC: newIcuTemp,
          vaccineColdChainTempC: newVaccineTemp,
          mriCryostatTempKelvin: newCryoTemp,
          status: isVaccineWarm ? 'Cold Chain Alert' : 'All Zones Normal',
          alarmActive: isVaccineWarm,
          alarmMessage: isVaccineWarm
            ? `Vaccine Storage Temp Alert (${newVaccineTemp} °C > ${gatewayConfig.maxVaccineTempThresholdC} °C)`
            : undefined,
          lastUpdated: `Live · ${new Date().toLocaleTimeString()}`,
        };
      });

      // Append to historical timeline
      setHistoryTimeline((prev) => {
        const nextPoint: TelemetryDataPoint = {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          linePressure: newLinePressure,
          purity: newPurity,
          icuTemp: newIcuTemp,
          vaccineTemp: newVaccineTemp,
          mriCryoTemp: newCryoTemp,
        };
        const updated = [...prev.slice(1), nextPoint];
        return updated;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isLiveStreaming, gatewayConfig]);

  return (
    <SensorContext.Provider
      value={{
        oxygenData,
        temperatureData,
        historyTimeline,
        gatewayConfig,
        updateGatewayConfig,
        resetGatewayConfig,
        testSensorHardwarePing,
        simulatePressureDrop,
        simulateTemperatureSpike,
        resetSimulationToNominal,
        isLiveStreaming,
        toggleLiveStreaming,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export const useSensors = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensors must be used within a SensorProvider');
  }
  return context;
};
