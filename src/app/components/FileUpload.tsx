import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-12 h-12 mb-4 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">点击上传</span> 或拖放文件
          </p>
          <p className="text-xs text-gray-500">支持 Excel 文件 (.xlsx, .xls)</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
