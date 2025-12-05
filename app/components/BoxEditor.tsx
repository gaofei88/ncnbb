import { BoxListItem } from '../models/Box';

interface BoxEditorProps {
  box: BoxListItem;
  availableBoxes: BoxListItem[];
  onUpdate: (id: string, field: 'name' | 'catalog' | 'linkedTo', value: string) => void;
  onClose: () => void;
}

export default function BoxEditor({ box, availableBoxes, onUpdate, onClose }: BoxEditorProps) {
  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Edit Box</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={box.name}
            onChange={(e) => onUpdate(box.id, 'name', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Catalog
          </label>
          <input
            type="text"
            value={box.catalog}
            onChange={(e) => onUpdate(box.id, 'catalog', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Link to Box
          </label>
          <select
            value={box.linkedTo}
            onChange={(e) => onUpdate(box.id, 'linkedTo', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            {availableBoxes
              .filter((b) => b.id !== box.id)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
          </select>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}
