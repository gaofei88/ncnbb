'use client';

import { useState, useRef, useEffect } from 'react';
import DraggableBox from './DraggableBox';
import ToolboxPanel from './ToolboxPanel';
import { Box } from '../models/Box';

export default function Board() {
  const toolboxWidth = 320; // w-80 = 320px
  const [boxes, setBoxes] = useState<Box[]>([
    { id: '1', x: 100, y: 100, name: 'Box 1', catalog: 'Category A', linkedTo: '', color: '#3b82f6' },
    { id: '2', x: 400, y: 150, name: 'Box 2', catalog: 'Category B', linkedTo: '', color: '#8b5cf6' },
    { id: '3', x: 700, y: 200, name: 'Box 3', catalog: 'Category C', linkedTo: '', color: '#ec4899' },
    { id: '4', x: 250, y: 350, name: 'Box 4', catalog: 'Category A', linkedTo: '', color: '#10b981' },
    { id: '5', x: 550, y: 400, name: 'Box 5', catalog: 'Category B', linkedTo: '', color: '#f59e0b' },
  ]);
  const [draggingBoxId, setDraggingBoxId] = useState<string | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ 
    width: 2000, 
    height: 2000 
  });
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize canvas size based on window dimensions
    const minWidth = window.innerWidth - toolboxWidth;
    const minHeight = window.innerHeight;
    
    setCanvasSize({
      width: Math.max(2000, minWidth),
      height: Math.max(2000, minHeight),
    });
  }, []);

  useEffect(() => {
    // Only resize canvas when not dragging
    if (draggingBoxId) return;

    // Calculate required canvas size based on box positions
    const boxWidth = 288;
    const boxHeight = 192;
    const padding = 100;

    if (boxes.length === 0) return;

    const minWidth = window.innerWidth - toolboxWidth;
    const minHeight = window.innerHeight;

    // Find the rightmost and bottommost positions
    const maxX = Math.max(...boxes.map(b => b.x + boxWidth));
    const maxY = Math.max(...boxes.map(b => b.y + boxHeight));

    // Canvas size expands to fit all boxes plus padding
    setCanvasSize({
      width: Math.max(maxX + padding, minWidth),
      height: Math.max(maxY + padding, minHeight),
    });
  }, [boxes, toolboxWidth, draggingBoxId]);

  const handlePositionChange = (id: string, x: number, y: number) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (box.id === id ? { ...box, x, y } : box))
    );
  };

  const handleTextChange = (id: string, field: 'name' | 'catalog', text: string) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (box.id === id ? { ...box, [field]: text } : box))
    );
  };

  const handleLinkChange = (id: string, linkedToId: string) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (box.id === id ? { ...box, linkedTo: linkedToId } : box))
    );
  };

  const handleUpdateBox = (id: string, field: 'name' | 'catalog' | 'linkedTo', value: string) => {
    if (field === 'linkedTo') {
      handleLinkChange(id, value);
    } else {
      handleTextChange(id, field, value);
    }
  };

  const handleDragStateChange = (id: string, isDragging: boolean) => {
    setDraggingBoxId(isDragging ? id : null);
    
    // Disable scrolling during drag
    if (canvasRef.current) {
      if (isDragging) {
        canvasRef.current.style.overflow = 'hidden';
      } else {
        canvasRef.current.style.overflow = 'auto';
      }
    }
  };

  const handleRemove = (id: string) => {
    setBoxes((prevBoxes) => prevBoxes.filter((box) => box.id !== id));
    if (selectedBoxId === id) {
      setSelectedBoxId(null);
    }
  };

  const handleEdit = (id: string) => {
    setSelectedBoxId(id);
  };

  const handleAddBox = () => {
    const newBox: Box = {
      id: Date.now().toString(),
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      name: 'New Box',
      catalog: 'New Category',
      linkedTo: '',
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };
    setBoxes([...boxes, newBox]);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden select-none flex">
      {/* Main canvas area */}
      <div ref={canvasRef} className="flex-1 relative overflow-auto">
        <div className="relative" style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}>
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

      {/* Draw arrows for linked boxes */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          {boxes.map((box) => (
            <marker
              key={`marker-${box.id}`}
              id={`arrowhead-${box.id}`}
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill={box.color} />
            </marker>
          ))}
        </defs>
        {boxes.map((box) => {
          if (!box.linkedTo) return null;
          const targetBox = boxes.find((b) => b.id === box.linkedTo);
          if (!targetBox) return null;

          const boxWidth = 288; // w-72
          const boxHeight = 192; // h-48
          
          // Define all possible edge midpoints for source box
          const sourceEdges = [
            { x: box.x + boxWidth / 2, y: box.y, name: 'top' }, // top
            { x: box.x + boxWidth / 2, y: box.y + boxHeight, name: 'bottom' }, // bottom
            { x: box.x, y: box.y + boxHeight / 2, name: 'left' }, // left
            { x: box.x + boxWidth, y: box.y + boxHeight / 2, name: 'right' }, // right
          ];
          
          // Define all possible edge midpoints for target box
          const targetEdges = [
            { x: targetBox.x + boxWidth / 2, y: targetBox.y, name: 'top' }, // top
            { x: targetBox.x + boxWidth / 2, y: targetBox.y + boxHeight, name: 'bottom' }, // bottom
            { x: targetBox.x, y: targetBox.y + boxHeight / 2, name: 'left' }, // left
            { x: targetBox.x + boxWidth, y: targetBox.y + boxHeight / 2, name: 'right' }, // right
          ];
          
          // Find the shortest path between any two edge points
          let minDistance = Infinity;
          let startX = 0, startY = 0, endX = 0, endY = 0;
          
          for (const sourceEdge of sourceEdges) {
            for (const targetEdge of targetEdges) {
              const distance = Math.sqrt(
                Math.pow(targetEdge.x - sourceEdge.x, 2) + 
                Math.pow(targetEdge.y - sourceEdge.y, 2)
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                startX = sourceEdge.x;
                startY = sourceEdge.y;
                endX = targetEdge.x;
                endY = targetEdge.y;
              }
            }
          }

          // Check if this arrow is connected to the dragging box
          const isConnectedToDragging = draggingBoxId && (box.id === draggingBoxId || box.linkedTo === draggingBoxId);

          return (
            <g key={`link-${box.id}-${box.linkedTo}`} style={{ zIndex: isConnectedToDragging ? 999 : 1 }}>
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={box.color}
                strokeWidth="3"
                strokeOpacity="0.8"
                markerEnd={`url(#arrowhead-${box.id})`}
              />
            </g>
          );
        })}
      </svg>

      {/* Draggable boxes */}

      {/* Draggable boxes */}
      {boxes.map((box) => (
        <DraggableBox
          key={box.id}
          id={box.id}
          initialX={box.x}
          initialY={box.y}
          initialName={box.name}
          initialCatalog={box.catalog}
          initialLinkedTo={box.linkedTo}
          color={box.color}
          availableBoxes={boxes.map(b => ({ id: b.id, name: b.name }))}
          onPositionChange={handlePositionChange}
          onDragStateChange={handleDragStateChange}
          onRemove={handleRemove}
          onEdit={handleEdit}
        />
      ))}
        </div>
      </div>

      {/* Toolbox Panel */}
      <ToolboxPanel 
        boxes={boxes.map(b => ({ id: b.id, name: b.name, catalog: b.catalog, linkedTo: b.linkedTo }))}
        selectedBoxId={selectedBoxId}
        onAddBox={handleAddBox}
        onUpdateBox={handleUpdateBox}
        onSelectBox={setSelectedBoxId}
        onDeselectBox={() => setSelectedBoxId(null)}
      />
    </div>
  );
}
