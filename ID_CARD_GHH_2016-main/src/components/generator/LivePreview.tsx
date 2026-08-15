import React, { useEffect, useRef, useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { generateBuilderId, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../canvas/generateBuilderId';
import { Loader2 } from 'lucide-react';

export interface LivePreviewProps {
  className?: string;
  onRenderComplete?: (dataUrl: string, blob: Blob) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  className = '',
  onRenderComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const builder = useBuilderStore((state) => state.builder);
  const setGeneratedResult = useBuilderStore((state) => state.setGeneratedResult);

  useEffect(() => {
    let isCancelled = false;

    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);

      try {
        const result = await generateBuilderId(builder, canvasRef.current);
        if (!isCancelled) {
          setGeneratedResult(result.dataUrl, result.blob);
          if (onRenderComplete) {
            onRenderComplete(result.dataUrl, result.blob);
          }
        }
      } catch (err) {
        console.error('Canvas render error:', err);
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    };

    const timeout = setTimeout(render, 40); // smooth debounce
    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [
    builder.name,
    builder.role,
    builder.teamName,
    builder.power,
    builder.builderTitle,
    builder.photo,
    builder.style,
    builder.photoZoom,
    builder.photoPosition.x,
    builder.photoPosition.y,
  ]);

  return (
    <div className={`relative flex items-center justify-center w-full select-none ${className}`}>
      {/* Neo-brutalist card container frame */}
      <div className="relative w-full max-w-[420px] rounded-2xl overflow-hidden border-3 md:border-4 border-black bg-black shadow-[8px_8px_0px_0px_#000000]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-auto block"
          style={{ aspectRatio: '1080 / 1350' }}
        />

        {isRendering && (
          <div className="absolute top-3 right-3 bg-black/80 text-[#FEE101] text-[10px] font-mono px-2 py-1 rounded-md border border-[#FEE101]/40 flex items-center gap-1.5 backdrop-blur-sm">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>SYNCING</span>
          </div>
        )}
      </div>
    </div>
  );
};
