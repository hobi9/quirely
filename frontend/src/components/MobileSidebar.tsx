import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Sidebar from './Sidebar';
import { useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';

const MobileSidebar = () => {
  const [isOpened, setIsOpened] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Sheet open={isOpened && isMobile} onOpenChange={setIsOpened}>
      <SheetTrigger asChild>
        <Button variant={'ghost'}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="pt-10">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
export default MobileSidebar;
