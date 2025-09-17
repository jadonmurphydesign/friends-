import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    label?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    color?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

const colorClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    secondary: 'bg-white hover:bg-gray-100 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
};

const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-3 text-base',
};

export default function Button({
    onClick,
    label,
    type = 'button',
    disabled,
    color = 'primary',
    size = 'medium',
    fullWidth,
    startIcon,
    endIcon,
    className = '',
    children,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                rounded-md font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2
                ${colorClasses[color]}
                ${sizeClasses[size]}
                ${fullWidth ? 'w-full' : ''}
                disabled:opacity-50
                ${className}
            `}
        >
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {label || children}
            {endIcon && <span className="ml-2">{endIcon}</span>}
        </button>
    );
}