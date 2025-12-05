'use client';

import { BoxListItem } from '../models/Box';
import BoxList from './BoxList';
import BoxEditor from './BoxEditor';

interface ToolboxPanelProps {
  boxes: BoxListItem[];
  selectedBoxId: string | null;
  onAddBox: () => void;
  onUpdateBox: (id: string, field: 'name' | 'catalog' | 'linkedTo', value: string) => void;
  onSelectBox: (id: string) => void;
  onDeselectBox: () => void;
}

export default function ToolboxPanel({ boxes, selectedBoxId, onAddBox, onUpdateBox, onSelectBox, onDeselectBox }: ToolboxPanelProps) {
  const selectedBox = boxes.find(b => b.id === selectedBoxId) || null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Toolbox</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <button
            onClick={onAddBox}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
          >
            + Add Box
          </button>

          {!selectedBox ? (
            <BoxList 
              boxes={boxes}
              onSelectBox={onSelectBox}
              selectedBoxId={selectedBoxId}
            />
          ) : (
            <BoxEditor 
              box={selectedBox}
              availableBoxes={boxes}
              onUpdate={onUpdateBox}
              onClose={onDeselectBox}
            />
          )}
        </div>
      </div>
    </div>
  );
}
