import React from 'react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    fullPage?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    color = 'currentColor',
    fullPage = false
}) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-20 w-20'
    };

    const loaderContent = (
        <div className={`relative ${sizes[size]}`}>
            <span
                className="block w-full h-full border-2 rounded-full animate-spin"
                style={{ borderColor: `${color}20`, borderTopColor: color }}
            />
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-primary/80 backdrop-blur-sm">
                {loaderContent}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            {loaderContent}
        </div>
    );
};

export default Loader;
