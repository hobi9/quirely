import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { X } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  children: React.ReactNode;
  formContent: (
    closeButtonRef: React.RefObject<HTMLButtonElement>,
  ) => React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  title: string;
};

const FormPopover = ({
  children,
  side = 'bottom',
  align,
  sideOffset = 0,
  formContent,
  title,
}: Props) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="w-80 pt-3"
      >
        <span className="mb-4 block text-center text-sm font-medium">
          {title}
        </span>
        <PopoverClose asChild>
          <Button
            variant={'ghost'}
            className="absolute right-2 top-2 h-auto w-auto p-2"
            ref={closeButtonRef}
          >
            <X className="size-4" />
          </Button>
        </PopoverClose>
        {formContent(closeButtonRef)}
      </PopoverContent>
    </Popover>
  );
};

export default FormPopover;
