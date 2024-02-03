import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';

const MobileSidebar = () => {
  const [isOpened, setIsOpened] = useState(false);
  const isMediumDevice = useMediaQuery('(min-width : 768px)');

  return (
    <Sheet open={isOpened && !isMediumDevice} onOpenChange={setIsOpened}>
      <SheetTrigger>
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
