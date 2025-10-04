
import React from 'react';
import { Article, ArticleStatus } from '../types';

interface ArticleItemProps {
  article: Article;
}

const StatusIndicator: React.FC<{ status: ArticleStatus }> = ({ status }) => {
    switch (status) {
        case ArticleStatus.PROCESSING:
            return (
                <div className="flex items-center text-sm text-blue-600">
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال پردازش...
                </div>
            );
        case ArticleStatus.SUCCESS:
            return (
                <div className="flex items-center text-sm text-green-600">
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    موفق
                </div>
            );
        case ArticleStatus.FAILED:
            return (
                <div className="flex items-center text-sm text-red-600">
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    ناموفق
                </div>
            );
        case ArticleStatus.PENDING:
        default:
            return (
                <div className="flex items-center text-sm text-slate-500">
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    در انتظار
                </div>
            );
    }
};

const ArticleItem: React.FC<ArticleItemProps> = ({ article }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-md font-semibold text-slate-800 truncate" title={article.name}>
            {article.name}
          </p>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-indigo-600 truncate block" title={article.url}>
            {article.url}
          </a>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
          <StatusIndicator status={article.status} />
        </div>
      </div>
      {article.status === ArticleStatus.FAILED && article.error && (
        <p className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded">{article.error}</p>
      )}
    </div>
  );
};

export default ArticleItem;
