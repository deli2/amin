
import React, { useState, useCallback } from 'react';
import { Article, ProcessingStatus, ArticleStatus } from './types';
import { fetchArticleContentWithRetry } from './services/geminiService';
import FileUpload from './components/FileUpload';
import ArticleList from './components/ArticleList';
import Header from './components/Header';
import DownloadButton from './components/DownloadButton';

declare const XLSX: any;

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleFileProcess = useCallback(async (file: File) => {
    setProcessingStatus(ProcessingStatus.PARSING);
    setError(null);
    setArticles([]);

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target?.result) {
            throw new Error("خطا در خواندن فایل.");
        }
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const parsedArticles: Article[] = json.map((row, index) => {
          const url = row['آدرس اینترنتی مقاله'];
          const name = row['نام مقاله'];

          if (!url || !name) {
            throw new Error(`ردیف ${index + 2} در فایل اکسل ناقص است. ستون‌های 'نام مقاله' و 'آدرس اینترنتی مقاله' الزامی هستند.`);
          }
          if (typeof url !== 'string' || !url.startsWith('http')) {
            throw new Error(`آدرس اینترنتی در ردیف ${index + 2} نامعتبر است.`);
          }

          return {
            id: index,
            name: name,
            url: url,
            status: ArticleStatus.PENDING,
          };
        });

        if (parsedArticles.length === 0) {
            throw new Error("فایل اکسل خالی است یا ستون‌های مورد نیاز را ندارد.");
        }

        setArticles(parsedArticles);
        setProcessingStatus(ProcessingStatus.FETCHING);
        await processArticles(parsedArticles);
      } catch (err: any) {
        setError(err.message || 'خطای ناشناخته در پردازش فایل اکسل.');
        setProcessingStatus(ProcessingStatus.ERROR);
      }
    };
    reader.onerror = () => {
        setError('خطا در خواندن فایل.');
        setProcessingStatus(ProcessingStatus.ERROR);
    }
    reader.readAsArrayBuffer(file);
  }, []);

  const processArticles = async (articlesToProcess: Article[]) => {
    for (const article of articlesToProcess) {
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: ArticleStatus.PROCESSING } : a));
      try {
        const content = await fetchArticleContentWithRetry(article.url);
        setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: ArticleStatus.SUCCESS, content } : a));
      } catch (err: any) {
        setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: ArticleStatus.FAILED, error: err.message } : a));
      }
    }
    setProcessingStatus(ProcessingStatus.DONE);
  };
  
  const handleDownload = () => {
    const successfulArticles = articles.filter(a => a.status === ArticleStatus.SUCCESS && a.content);
    if (successfulArticles.length === 0) return;

    const fileContent = successfulArticles.map(article => {
        return `========================================\nنام مقاله: ${article.name}\nآدرس اینترنتی: ${article.url}\n========================================\n\n${article.content}\n\n\n`;
    }).join('');

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'مقالات_استخراج_شده.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="mt-8">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
            {processingStatus === ProcessingStatus.IDLE && (
              <FileUpload onFileProcess={handleFileProcess} />
            )}

            {(processingStatus === ProcessingStatus.PARSING || processingStatus === ProcessingStatus.FETCHING) && (
                 <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-slate-700">
                        {processingStatus === ProcessingStatus.PARSING ? 'در حال تجزیه و تحلیل فایل اکسل...' : 'در حال استخراج متن مقالات...'}
                    </p>
                    <p className="text-slate-500 mt-1">لطفاً صبور باشید. این فرآیند ممکن است چند دقیقه طول بکشد.</p>
                </div>
            )}
            
            {processingStatus === ProcessingStatus.ERROR && error && (
              <div className="text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button 
                  onClick={() => setProcessingStatus(ProcessingStatus.IDLE)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  تلاش مجدد
                </button>
              </div>
            )}
            
            {articles.length > 0 && (processingStatus === ProcessingStatus.FETCHING || processingStatus === ProcessingStatus.DONE) && (
              <>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">وضعیت پردازش مقالات</h2>
                    <DownloadButton 
                        onClick={handleDownload} 
                        disabled={processingStatus !== ProcessingStatus.DONE}
                    />
                </div>
                <ArticleList articles={articles} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
