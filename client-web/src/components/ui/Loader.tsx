import type { FC } from "react";

export const Loader: FC = () => {
    return (
        <div>
            <img
                src="/loader.png"
                alt="Loading..."
                className="mx-auto h-32 w-32 animate-pulse"
            />
            <p className="text-center text-gray-500">Loading...</p>
        </div>
    );
};