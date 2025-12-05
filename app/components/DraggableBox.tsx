'use client';

import { useState, useRef, MouseEvent } from 'react';

interface DraggableBoxProps {
  id: string;
  initialX: number;
  initialY: number;
  initialName?: string;
  initialCatalog?: string;
  initialLinkedTo?: string;
  color: string;
  availableBoxes: Array<{ id: string; name: string }>;
  onPositionChange: (id: string, x: number, y: number) => void;
  onDragStateChange: (id: string, isDragging: boolean) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function DraggableBox({
  id,
  initialX,
  initialY,
  initialName = 'Name',
  initialCatalog = 'Catalog',
  initialLinkedTo = '',
  color,
  availableBoxes,
  onPositionChange,
  onDragStateChange,
  onRemove,
  onEdit,
}: DraggableBoxProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number }>({
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    onDragStateChange(id, true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    let newX = e.clientX - dragRef.current.offsetX;
    let newY = e.clientY - dragRef.current.offsetY;

    // Constrain to left and top edges
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);

    setPosition({ x: newX, y: newY });
    onPositionChange(id, newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onDragStateChange(id, false);
  };

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove(id);
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  // Find the linked box name for display
  const linkedBox = availableBoxes.find(box => box.id === initialLinkedTo);

  return (
    <div
      className={`absolute w-72 h-48 rounded-lg shadow-lg ${
        isDragging ? 'shadow-2xl scale-105' : 'hover:shadow-xl'
      } cursor-move`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: color,
        padding: '10px',
        zIndex: isDragging ? 1000 : 10,
        transition: isDragging ? 'none' : 'all 0.2s',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
    >
      {isHovered && !isDragging && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleEdit}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-7 h-7 bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 rounded-lg flex items-center justify-center shadow transition-all text-sm font-semibold"
            title="Edit box"
          >
            ✎
          </button>
          <button
            onClick={handleRemove}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-7 h-7 bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 rounded-lg flex items-center justify-center shadow transition-all text-xl font-semibold"
            title="Remove box"
          >
            ×
          </button>
        </div>
      )}

      <div className="h-full flex flex-col gap-3">
        <div>
          <div className="font-bold text-white text-sm mb-1">Name</div>
          <div className="w-full text-white font-normal text-sm break-words">
            {initialName}
          </div>
        </div>
        
        <div>
          <div className="font-bold text-white text-sm mb-1">Category</div>
          <div className="w-full text-white font-normal text-sm break-words">
            {initialCatalog}
          </div>
        </div>

        {initialLinkedTo && (
          <div>
            <div className="font-bold text-white text-sm mb-1">Linked to</div>
            <div className="w-full text-white font-normal text-sm break-words">
              {linkedBox?.name || 'Unknown'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
