interface ToolboxPanelProps {
  boxCount: number;
  connectionCount: number;
  onAddBox: () => void;
}

export default function ToolboxPanel({ boxCount, connectionCount, onAddBox }: ToolboxPanelProps) {
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
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Statistics</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Boxes:</span>
                <span className="font-semibold text-gray-800">{boxCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Connections:</span>
                <span className="font-semibold text-gray-800">{connectionCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
