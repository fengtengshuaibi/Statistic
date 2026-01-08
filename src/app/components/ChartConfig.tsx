import { BarChart3, LineChart, PieChart } from 'lucide-react';

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

interface ChartConfigProps {
  headers: string[];
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
  step: number;
  itemsPerChart: number;
  groupByColumn: string;
  onChartTypeChange: (type: ChartType) => void;
  onXAxisChange: (axis: string) => void;
  onYAxisChange: (axis: string) => void;
  onStepChange: (step: number) => void;
  onItemsPerChartChange: (items: number) => void;
  onGroupByColumnChange: (column: string) => void;
}

export function ChartConfig({
  headers,
  chartType,
  xAxis,
  yAxis,
  step,
  itemsPerChart,
  groupByColumn,
  onChartTypeChange,
  onXAxisChange,
  onYAxisChange,
  onStepChange,
  onItemsPerChartChange,
  onGroupByColumnChange,
}: ChartConfigProps) {
  const chartTypes: { type: ChartType; label: string; icon: React.ReactNode }[] = [
    { type: 'bar', label: '柱状图', icon: <BarChart3 className="w-5 h-5" /> },
    { type: 'line', label: '折线图', icon: <LineChart className="w-5 h-5" /> },
    { type: 'pie', label: '饼状图', icon: <PieChart className="w-5 h-5" /> },
    { type: 'area', label: '面积图', icon: <LineChart className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl mb-4">图表配置</h2>
      
      {/* 图表类型选择 */}
      <div className="mb-6">
        <label className="block text-sm mb-2">图表类型</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chartTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => onChartTypeChange(type)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                chartType === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {icon}
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 轴配置 */}
      {chartType !== 'pie' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm mb-2">横轴 (X轴)</label>
            <select
              value={xAxis}
              onChange={(e) => onXAxisChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">纵轴 (Y轴)</label>
            <select
              value={yAxis}
              onChange={(e) => onYAxisChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 步长配置 */}
      {chartType !== 'pie' && (
        <div>
          <label className="block text-sm mb-2">Y轴步长</label>
          <input
            type="number"
            value={step}
            onChange={(e) => onStepChange(Number(e.target.value))}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* 每个图表显示的数据条数 */}
      <div className="mt-6">
        <label className="block text-sm mb-2">每个图表显示数据条数</label>
        <select
          value={itemsPerChart}
          onChange={(e) => onItemsPerChartChange(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 条</option>
          <option value={20}>20 条</option>
          <option value={30}>30 条</option>
          <option value={50}>50 条</option>
          <option value={100}>100 条</option>
          <option value={999999}>全部数据</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">数据过多时会自动分成多张图表</p>
      </div>

      {/* 数据分组 */}
      <div className="mt-4">
        <label className="block text-sm mb-2">按列分组</label>
        <select
          value={groupByColumn}
          onChange={(e) => onGroupByColumnChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">不分组</option>
          {headers.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">将数据按所选列的值分成多个图表</p>
      </div>
    </div>
  );
}