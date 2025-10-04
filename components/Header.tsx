
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                استخراج کننده متن مقاله
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                به سادگی یک فایل اکسل حاوی لینک مقالات را بارگذاری کنید تا هوش مصنوعی متن کامل آن‌ها را برای شما استخراج کند.
            </p>
        </header>
    );
};

export default Header;
