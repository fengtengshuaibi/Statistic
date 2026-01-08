import { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileUpload } from './components/FileUpload';
import { ChartConfig, ChartType } from './components/ChartConfig';
import { ChartDisplay } from './components/ChartDisplay';
import { DataTable } from './components/DataTable';

export default function App() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [step, setStep] = useState<number>(10);
  const [fileName, setFileName] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [itemsPerChart, setItemsPerChart] = useState<number>(20);
  const [groupByColumn, setGroupByColumn] = useState<string>('none');

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length > 0) {
          // 获取表头
          const extractedHeaders = Object.keys(jsonData[0] as object);
          setHeaders(extractedHeaders);
          setData(jsonData);
          
          // 设置默认的轴
          if (extractedHeaders.length >= 2) {
            setXAxis(extractedHeaders[0]);
            setYAxis(extractedHeaders[1]);
          } else if (extractedHeaders.length === 1) {
            setXAxis(extractedHeaders[0]);
            setYAxis(extractedHeaders[0]);
          }

          // 重置分组
          setGroupByColumn('none');
        }
      } catch (error) {
        console.error('解析Excel文件失败:', error);
        alert('文件解析失败，请确保上传的是有效的Excel文件');
      }
    };
    
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl mb-2 text-gray-800">Excel 数据可视化工具</h1>
          <p className="text-gray-600">上传Excel文件，生成各种统计图表，支持分页、排序、分组展示</p>
        </header>

        <div className="space-y-8">
          {/* 文件上传区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <FileUpload onFileUpload={handleFileUpload} />
            {fileName && (
              <p className="mt-4 text-center text-sm text-gray-600">
                已加载文件: <span className="font-semibold">{fileName}</span>
                <span className="ml-2 text-gray-500">({data.length} 条数据)</span>
              </p>
            )}
          </div>

          {/* 图表配置和显示区域 */}
          {headers.length > 0 && (
            <>
              <ChartConfig
                headers={headers}
                chartType={chartType}
                xAxis={xAxis}
                yAxis={yAxis}
                step={step}
                itemsPerChart={itemsPerChart}
                groupByColumn={groupByColumn}
                onChartTypeChange={setChartType}
                onXAxisChange={setXAxis}
                onYAxisChange={setYAxis}
                onStepChange={setStep}
                onItemsPerChartChange={setItemsPerChart}
                onGroupByColumnChange={setGroupByColumn}
              />

              <ChartDisplay
                data={data}
                chartType={chartType}
                xAxis={xAxis}
                yAxis={yAxis}
                step={step}
                itemsPerChart={itemsPerChart}
                groupByColumn={groupByColumn}
              />
            </>
          )}

          {/* 数据预览表格 */}
          {data.length > 0 && (
            <DataTable
              headers={headers}
              data={data}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
