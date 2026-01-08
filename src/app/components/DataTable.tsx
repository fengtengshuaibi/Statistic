import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface DataTableProps {
  headers: string[];
  data: any[];
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
}

export function DataTable({ headers, data, itemsPerPage, onItemsPerPageChange }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // 排序数据
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // 尝试转换为数字比较
    const aNum = Number(aValue);
    const bNum = Number(bValue);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    // 字符串比较
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // 分页
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">数据预览</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">每页显示:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(header)}
                >
                  <div className="flex items-center gap-2">
                    {header}
                    {getSortIcon(header)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          显示 {startIndex + 1} - {Math.min(endIndex, sortedData.length)} 条，共 {sortedData.length} 条数据
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            上一页
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              第 {currentPage} / {totalPages} 页
            </span>
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}
