import { forwardRef } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};
const FormTextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      className,
      onBlur,
      onClick,
      onKeyDown,
      onChange,
      value,
    },
    ref,
  ) => {
    return (
      <div className="w-full space-y-2">
        <div className="w-full space-y-1">
          {label && (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          )}
          <Textarea
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            onClick={onClick}
            required={required}
            ref={ref}
            placeholder={placeholder}
            name={id}
            onChange={onChange}
            id={id}
            disabled={disabled}
            className={cn(
              'resize-none ring-0 shadow-sm outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
              className,
            )}
            aria-describedby={`${id}-error`}
            value={value}
          />
        </div>
      </div>
    );
  },
);

export default FormTextArea;
