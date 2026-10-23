import React from 'react';
import { INTENSITY_LEVELS } from '../../constants';

export interface IntensitySliderProps {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  helperText?: string;
}

export const IntensitySlider: React.FC<IntensitySliderProps> = ({
  value,
  onChange,
  label = 'Intensidade percebida (0 a 10)',
  helperText,
}) => {
  const currentLevel = INTENSITY_LEVELS.find((l) => l.value === value) || INTENSITY_LEVELS[value] || INTENSITY_LEVELS[0];

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-semibold text-on-surface">{label}</label>
        <span className="text-sm font-semibold text-primary">
          Nível {value} / 10
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value}
        aria-valuetext={currentLevel.label}
      />

      {/* Ticks representation */}
      <div className="flex justify-between px-1 text-[10px] text-on-surface-variant select-none font-mono">
        <span>0</span>
        <span>2</span>
        <span>4</span>
        <span>6</span>
        <span>8</span>
        <span>10</span>
      </div>

      {/* Textual accessibility description */}
      <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 text-xs text-on-surface">
        <span className="font-semibold text-primary">{currentLevel.label}:</span>{' '}
        <span className="text-on-surface-variant">{currentLevel.description}</span>
      </div>

      {helperText && <p className="text-xs text-on-surface-variant">{helperText}</p>}
    </div>
  );
};
