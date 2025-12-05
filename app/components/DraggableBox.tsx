'use client';

import { useState, useRef, MouseEvent, ChangeEvent } from 'react';

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
  onTextChange: (id: string, field: 'name' | 'catalog', text: string) => void;
  onLinkChange: (id: string, linkedToId: string) => void;
  onDragStateChange: (id: string, isDragging: boolean) => void;
  onRemove: (id: string) => void;
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
  onTextChange,
  onLinkChange,
  onDragStateChange,
  onRemove,
}: DraggableBoxProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState<'name' | 'catalog' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState(initialName);
  const [catalog, setCatalog] = useState(initialCatalog);
  const [linkedTo, setLinkedTo] = useState(initialLinkedTo);
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

  const handleDoubleClick = (e: MouseEvent<HTMLDivElement>, field: 'name' | 'catalog') => {
    e.stopPropagation();
    setIsEditing(field);
  };

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'name' | 'catalog'
  ) => {
    const newText = e.target.value;
    if (field === 'name') {
      setName(newText);
    } else {
      setCatalog(newText);
    }
    onTextChange(id, field, newText);
  };

  const handleTextBlur = () => {
    setIsEditing(null);
  };

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRemove(id);
  };

  const handleLinkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLinkedTo = e.target.value;
    setLinkedTo(newLinkedTo);
    onLinkChange(id, newLinkedTo);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  return (
    <div
      className={`absolute w-72 h-48 rounded-lg shadow-lg ${
        isDragging ? 'shadow-2xl scale-105' : 'hover:shadow-xl'
      } ${isEditing ? 'cursor-text' : 'cursor-move'}`}
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
        <button
          onClick={handleRemove}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-lg flex items-center justify-center shadow transition-all text-xl font-semibold"
          title="Remove box"
        >
          ×
        </button>
      )}

      <div className="h-full flex flex-col gap-3">
        <div>
          <div className="font-bold text-white text-sm mb-1">Name</div>
          {isEditing === 'name' ? (
            <input
              value={name}
              onChange={(e) => handleTextChange(e, 'name')}
              onBlur={handleTextBlur}
              autoFocus
              className="w-full bg-white/95 border-0 rounded px-2 py-1 text-gray-900 font-normal text-sm placeholder-gray-400 outline-none shadow-sm"
              placeholder="Enter name"
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className="w-full text-white font-normal text-sm cursor-text break-words"
              onDoubleClick={(e) => handleDoubleClick(e, 'name')}
            >
              {name || <span className="text-white/70 italic">Click to edit</span>}
            </div>
          )}
        </div>
        
        <div>
          <div className="font-bold text-white text-sm mb-1">Category</div>
          {isEditing === 'catalog' ? (
            <textarea
              value={catalog}
              onChange={(e) => handleTextChange(e, 'catalog')}
              onBlur={handleTextBlur}
              autoFocus
              className="w-full bg-white/95 border-0 rounded px-2 py-1 text-gray-900 font-normal text-sm placeholder-gray-400 outline-none shadow-sm resize-none"
              rows={2}
              placeholder="Enter category"
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className="w-full text-white font-normal text-sm cursor-text break-words"
              onDoubleClick={(e) => handleDoubleClick(e, 'catalog')}
            >
              {catalog || <span className="text-white/70 italic">Click to edit</span>}
            </div>
          )}
        </div>

        <div>
          <div className="font-bold text-white text-sm mb-1">Link to</div>
          <select
            value={linkedTo}
            onChange={handleLinkChange}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full bg-white/95 border-0 rounded px-2 py-1 text-gray-900 font-normal text-sm outline-none shadow-sm cursor-pointer"
          >
            <option value="">None</option>
            {availableBoxes.filter(box => box.id !== id).map(box => (
              <option key={box.id} value={box.id}>{box.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
