import { BoxListItem } from '../models/Box';

interface BoxListProps {
  boxes: BoxListItem[];
  onSelectBox: (id: string) => void;
  selectedBoxId: string | null;
}

export default function BoxList({ boxes, onSelectBox, selectedBoxId }: BoxListProps) {
  return (
    <div className="pt-4 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">All Boxes</h3>
      <div className="space-y-2">
        {boxes.map((box) => (
          <div
            key={box.id}
            onClick={() => onSelectBox(box.id)}
            className={`p-2 rounded cursor-pointer transition-colors ${
              selectedBoxId === box.id
                ? 'bg-blue-100 border border-blue-300'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {box.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {box.catalog}
                </div>
              </div>
              <div
                className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
                style={{ backgroundColor: box.linkedTo ? '#10b981' : '#d1d5db' }}
                title={box.linkedTo ? 'Connected' : 'Not connected'}
              />
            </div>
          </div>
        ))}
        {boxes.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-4">
            No boxes yet
          </div>
        )}
      </div>
    </div>
  );
}
