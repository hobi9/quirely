import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

const Drawer: React.FC<{
  handleClose: () => void;
  children: React.ReactNode;
}> = ({ handleClose, children }) => {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    setIsOpened(true);
  }, []);

  const close = () => {
    setIsOpened(false);
    setTimeout(() => {
      handleClose();
    }, 150);
  };

  return (
    <div className="absolute z-10 h-full w-full" onClick={close}>
      <Card
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'h-full w-min translate-x-[-1000px] shadow-2xl transition-transform',
          isOpened && 'translate-x-[0px]',
        )}
      >
        {children}
      </Card>
    </div>
  );
};

export default Drawer;
