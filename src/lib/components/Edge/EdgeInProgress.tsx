import { EdgeInProgressAtom } from '@app/atoms/edges';
import { useRecoilValue } from 'recoil';

const EdgeInProgress = () => {
  const state = useRecoilValue(EdgeInProgressAtom);
  return null;
};


export default EdgeInProgress
