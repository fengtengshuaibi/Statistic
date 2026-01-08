import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChartType } from './ChartConfig';

interface ChartDisplayProps {
  data: any[];
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
  step: number;
  itemsPerChart: number;
  groupByColumn: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FD8D8D', '#A569BD'];

export function ChartDisplay({ 
  data, 
  chartType, 
  xAxis, 
  yAxis, 
  step, 
  itemsPerChart,
  groupByColumn 
}: ChartDisplayProps) {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-400">暂无数据</p>
      </div>
    );
  }

  // 数据分组
  const groupedData = groupByColumn && groupByColumn !== 'none'
    ? groupDataByColumn(data, groupByColumn, xAxis, yAxis)
    : [{ name: '全部数据', data }];

  // 将数据分割成多个图表
  const chartGroups = groupedData.map(group => {
    const chunks: any[][] = [];
    for (let i = 0; i < group.data.length; i += itemsPerChart) {
      chunks.push(group.data.slice(i, i + itemsPerChart));
    }
    return {
      name: group.name,
      chunks
    };
  });

  // 扁平化所有图表
  const allCharts: Array<{ groupName: string; chunkIndex: number; data: any[] }> = [];
  chartGroups.forEach(group => {
    group.chunks.forEach((chunk, index) => {
      allCharts.push({
        groupName: group.name,
        chunkIndex: index,
        data: chunk
      });
    });
  });

  const totalCharts = allCharts.length;
  const currentChart = allCharts[currentChartIndex];

  const renderChart = (chartData: any[]) => {
    const maxValue = Math.max(...chartData.map(d => Number(d[yAxis]) || 0));
    const tickCount = step > 0 ? Math.ceil(maxValue / step) + 1 : 5;

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 'auto']} tickCount={tickCount} />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 'auto']} tickCount={tickCount} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yAxis} stroke="#0088FE" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 'auto']} tickCount={tickCount} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey={yAxis} stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">数据可视化</h2>
        {totalCharts > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentChartIndex(Math.max(0, currentChartIndex - 1))}
              disabled={currentChartIndex === 0}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[100px] text-center">
              {currentChartIndex + 1} / {totalCharts}
            </span>
            <button
              onClick={() => setCurrentChartIndex(Math.min(totalCharts - 1, currentChartIndex + 1))}
              disabled={currentChartIndex === totalCharts - 1}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {currentChart && (
        <>
          <div className="mb-2 text-sm text-gray-600">
            {currentChart.groupName !== '全部数据' && (
              <span className="font-semibold">{currentChart.groupName}</span>
            )}
            {currentChart.chunkIndex > 0 && (
              <span className="ml-2">- 第 {currentChart.chunkIndex + 1} 部分</span>
            )}
          </div>
          {renderChart(currentChart.data)}
        </>
      )}
    </div>
  );
}

// 数据分组辅助函数
function groupDataByColumn(data: any[], groupColumn: string, xAxis: string, yAxis: string) {
  const groups = new Map<string, any[]>();

  data.forEach(item => {
    const groupValue = String(item[groupColumn]);
    if (!groups.has(groupValue)) {
      groups.set(groupValue, []);
    }
    groups.get(groupValue)!.push(item);
  });

  return Array.from(groups.entries()).map(([name, groupData]) => ({
    name,
    data: groupData
  }));
}
