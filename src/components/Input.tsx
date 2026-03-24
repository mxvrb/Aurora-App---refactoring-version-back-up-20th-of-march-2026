import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  name?: string;
  className?: string;
  id?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  style?: React.CSSProperties;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    type = 'text',
    value,
    onChange,
    placeholder,
    name,
    className = '',
    id,
    min,
    max,
    step,
    onKeyDown,
    onBlur,
    onFocus,
    disabled,
    readOnly,
    autoFocus,
    required,
    accept,
    multiple,
    style,
    ...props
  }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        className={className}
        id={id}
        min={min}
        max={max}
        step={step}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        autoFocus={autoFocus}
        required={required}
        accept={accept}
        multiple={multiple}
        style={style}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
