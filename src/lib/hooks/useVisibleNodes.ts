import { useContext } from 'react';
import { ViewerContext } from '@lib/contexts';

const useVisibleNodes = () => {
  const viewerValue = useContext(ViewerContext);
};

export default useVisibleNodes;
