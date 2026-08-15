import React from 'react';
import { ZoomIn, Move, RotateCcw, Image as ImageIcon } from 'lucide-react';

export interface PhotoAdjusterProps {
  photo: string;
  zoom: number;
  panX: number;
  panY: number;
  onChangeZoom: (zoom: number) => void;
  onChangePan: (pan: { x?: number; y?: number }) => void;
  onChangePhotoClick?: () => void;
}

export const PhotoAdjuster: React.FC<PhotoAdjusterProps> = ({
  photo,
  zoom,
  panX,
  panY,
  onChangeZoom,
  onChangePan,
  onChangePhotoClick,
}) => {
  const handleReset = () => {
    onChangeZoom(1.0);
    onChangePan({ x: 0, y: 0 });
  };

  return (
    <div className="bg-[#FFFDF5] text-black border-3 border-black rounded-2xl p-4 md:p-5 shadow-[5px_5px_0px_0px_#000000] flex flex-col gap-4">
      <div className="flex items-center justify-between border-b-2 border-black/15 pb-2.5">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-black" />
          <span className="font-display font-black text-xs md:text-sm uppercase tracking-wider">
            FRAME ADJUSTMENT
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs font-bold text-black/60 hover:text-black flex items-center gap-1 uppercase hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Viewport Preview + Adjustment Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Visual Miniature Viewport */}
        <div className="sm:col-span-4 flex flex-col items-center">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl border-3 border-black bg-black overflow-hidden shadow-[3px_3px_0px_0px_#000000]">
            <img
              src={photo}
              alt="Photo preview"
              className="w-full h-full object-cover transition-transform duration-75"
              style={{
                transform: `scale(${zoom}) translate(${panX / 4}%, ${panY / 4}%)`,
              }}
            />
            <div className="absolute inset-0 border border-white/30 pointer-events-none" />
            <div className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-[#FEE101] px-1 rounded font-mono">
              {zoom.toFixed(1)}x
            </div>
          </div>
          {onChangePhotoClick && (
            <button
              onClick={onChangePhotoClick}
              className="mt-2 text-[11px] font-extrabold uppercase text-[#0B6839] hover:text-[#FF0080] underline flex items-center gap-1"
            >
              <ImageIcon className="w-3 h-3" />
              <span>Change Photo</span>
            </button>
          )}
        </div>

        {/* Sliders */}
        <div className="sm:col-span-8 flex flex-col gap-3">
          {/* Zoom Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-extrabold font-display">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5" /> ZOOM
              </span>
              <span className="font-mono">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.05"
              value={zoom}
              onChange={(e) => onChangeZoom(parseFloat(e.target.value))}
              className="w-full accent-[#0B6839] cursor-pointer h-2 bg-black/10 rounded-lg"
            />
          </div>

          {/* Pan X Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-extrabold font-display">
              <span>PAN HORIZONTAL (X)</span>
              <span className="font-mono">{panX > 0 ? `+${panX}` : panX}%</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={panX}
              onChange={(e) => onChangePan({ x: parseInt(e.target.value, 10) })}
              className="w-full accent-[#FF0080] cursor-pointer h-2 bg-black/10 rounded-lg"
            />
          </div>

          {/* Pan Y Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-extrabold font-display">
              <span>PAN VERTICAL (Y)</span>
              <span className="font-mono">{panY > 0 ? `+${panY}` : panY}%</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="1"
              value={panY}
              onChange={(e) => onChangePan({ y: parseInt(e.target.value, 10) })}
              className="w-full accent-[#FF0080] cursor-pointer h-2 bg-black/10 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
