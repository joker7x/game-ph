import React from 'react';
import { Product } from '../types/game';

interface Props {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
}

export const MedicineBoxArt: React.FC<Props> = ({ product, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-[9px]',
    md: 'w-12 h-12 text-[10px]',
    lg: 'w-16 h-16 text-xs'
  }[size];

  return (
    <div
      className={`${sizeClasses} relative rounded-xl shadow-sm border border-black/10 flex flex-col justify-between p-1 overflow-hidden shrink-0 transition-transform hover:scale-105`}
      style={{
        background: `linear-gradient(135deg, ${product.boxSecondaryColor || '#ffffff'} 0%, ${product.boxColor}22 100%)`
      }}
    >
      {/* Top color stripe */}
      <div
        className="h-2 w-full rounded-md opacity-90 shadow-xs"
        style={{ backgroundColor: product.boxColor }}
      />

      {/* Pill capsule or cross symbol */}
      <div className="flex items-center justify-center my-auto">
        <div className="flex items-center shadow-xs rounded-full overflow-hidden border border-black/10 scale-90">
          <div
            className="w-3.5 h-2"
            style={{ backgroundColor: product.boxColor }}
          />
          <div className="w-3.5 h-2 bg-white" />
        </div>
      </div>

      {/* Subtle bottom stripe */}
      <div className="flex justify-between items-center px-0.5">
        <span className="font-bold text-[8px] opacity-75 truncate max-w-[80%] font-mono">
          {product.dosage.split(' ')[0]}
        </span>
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: product.boxColor }}
        />
      </div>
    </div>
  );
};
