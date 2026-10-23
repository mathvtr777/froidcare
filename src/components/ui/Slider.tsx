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
        <label className="text-xs font-medium text-neutral-300">{label}</label>
        <span className="text-sm font-semibold text-sage-400">
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
        className="w-full h-2 bg-charcoal-800 rounded-lg appearance-none cursor-pointer accent-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500/40"
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value}
        aria-valuetext={currentLevel.label}
      />

      {/* Ticks representation */}
      <div className="flex justify-between px-1 text-[10px] text-neutral-500 select-none">
        <span>0</span>
        <span>2</span>
        <span>4</span>
        <span>6</span>
        <span>8</span>
        <span>10</span>
      </div>

      {/* Textual accessibility description */}
      <div className="p-2.5 rounded-xl bg-charcoal-900 border border-charcoal-800 text-xs text-neutral-300">
        <span className="font-medium text-neutral-200">{currentLevel.label}:</span>{' '}
        <span className="text-neutral-400">{currentLevel.description}</span>
      </div>

      {helperText && <p className="text-xs text-neutral-500">{helperText}</p>}
    </div>
  );
};
