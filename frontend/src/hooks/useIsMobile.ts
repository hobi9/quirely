import { useMediaQuery } from '@uidotdev/usehooks';

const useIsMobile = () => {
  return useMediaQuery('(max-width : 768px)');
};

export default useIsMobile;
