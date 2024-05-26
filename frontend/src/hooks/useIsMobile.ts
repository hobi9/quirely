import { useMediaQuery } from '@uidotdev/usehooks';

const useIsMobile = (width = 768) => {
  return useMediaQuery(`(max-width : ${width}px)`);
};

export default useIsMobile;
