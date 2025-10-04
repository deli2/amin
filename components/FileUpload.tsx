
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileProcess: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileProcess(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileProcess(e.dataTransfer.files[0]);
    }
  }, [onFileProcess]);


  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-slate-700">فایل اکسل خود را بارگذاری کنید</h2>
      <p className="text-slate-500 mt-2">
        فایل شما باید شامل ستون‌های <span className="font-mono text-indigo-600">'نام مقاله'</span> و <span className="font-mono text-indigo-600">'آدرس اینترنتی مقاله'</span> باشد.
      </p>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-6 border-2 border-dashed rounded-lg p-10 cursor-pointer transition-colors ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
             <svg className="w-12 h-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="mt-4 text-slate-600">
              فایل را اینجا بکشید و رها کنید یا <span className="font-semibold text-indigo-600">برای انتخاب کلیک کنید</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">XLSX, XLS, CSV</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
