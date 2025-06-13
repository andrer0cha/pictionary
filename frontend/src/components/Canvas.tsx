import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface DrawData {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  color: string;
  size: number;
  tool: 'brush' | 'eraser';
}

interface CanvasProps {
  onDrawData?: (data: DrawData) => void;
  onClearCanvas?: () => void;
  isDrawer?: boolean;
  disabled?: boolean;
}

export interface CanvasRef {
  clearCanvas: () => void;
  handleRemoteDrawData: (data: DrawData) => void;
  handleRemoteClear: () => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(({ 
  onDrawData, 
  onClearCanvas, 
  isDrawer = true,
  disabled = false 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser'>('brush');
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  useImperativeHandle(ref, () => ({
    clearCanvas: handleClear,
    handleRemoteDrawData: (data: DrawData) => {
      drawLine(data.prevX, data.prevY, data.x, data.y, data.color, data.size, data.tool);
    },
    handleRemoteClear: () => {
      clearCanvasInternal();
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Initial setup
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, size: number, tool: 'brush' | 'eraser') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    
    if (tool === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = size * 2; // Eraser is bigger
    } else {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = color;
      context.lineWidth = size;
    }
    
    context.stroke();
    context.closePath();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawer || disabled) return;

    const { x, y } = getCanvasCoordinates(e);
    setIsDrawing(true);
    setLastPosition({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawer || disabled) return;

    const { x, y } = getCanvasCoordinates(e);
    
    // Draw locally
    drawLine(lastPosition.x, lastPosition.y, x, y, currentColor, brushSize, currentTool);
    
    // Send draw data to other players
    if (onDrawData) {
      onDrawData({
        x,
        y,
        prevX: lastPosition.x,
        prevY: lastPosition.y,
        color: currentColor,
        size: brushSize,
        tool: currentTool
      });
    }

    setLastPosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  const clearCanvasInternal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    if (!isDrawer || disabled) return;
    
    clearCanvasInternal();
    
    // Notify other players to clear their canvas
    if (onClearCanvas) {
      onClearCanvas();
    }
  };

  return (
    <div className="space-y-4">
      {/* Drawing Tools - Only show for drawer */}
      {isDrawer && !disabled && (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Color:</span>
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    currentColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Tool Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tool:</span>
            <button
              onClick={() => setCurrentTool('brush')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentTool === 'brush'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🖌️ Brush
            </button>
            <button
              onClick={() => setCurrentTool('eraser')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentTool === 'eraser'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🧽 Eraser
            </button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600">{brushSize}</span>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            🗑️ Clear
          </button>
        </div>
      )}

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`border-2 border-gray-300 rounded-lg bg-white w-full max-w-4xl ${
            !isDrawer || disabled ? 'cursor-not-allowed' : 'cursor-crosshair'
          }`}
          style={{ aspectRatio: '4/3' }}
        />
        
        {/* Overlay for non-drawers */}
        {(!isDrawer || disabled) && (
          <div className="absolute inset-0 bg-transparent rounded-lg flex items-center justify-center">
            <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {disabled ? '🕐 Waiting...' : '👀 Watch and guess!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas; 
