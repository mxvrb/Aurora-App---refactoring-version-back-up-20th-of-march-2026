import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  title?: string;
  'aria-label'?: string;
  'data-state'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    onClick,
    type = 'button',
    disabled,
    children,
    className = '',
    id,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    style,
    title,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={className}
        id={id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        style={style}
        title={title}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
