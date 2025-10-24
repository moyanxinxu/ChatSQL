const WeatherKit = ({ content }: { content: string }) => {
    // 上下左右居中对齐
    return (
        <div className="flex items-center justify-center border-1 p-3 rounded-2xl border-blue-500 bg-blue-100 dark:bg-blue-400/80 w-full">
            <h3 className="font-bold">{content}</h3>
        </div>
    );
};

export { WeatherKit };
