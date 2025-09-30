import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECC0E]';
  const variantStyles = {
    primary: 'bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 shadow-sm',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  const disabledStyles = props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className || ''}`;
  return <button className={buttonStyles} {...props}>
      {children}
    </button>;
};
export default Button;