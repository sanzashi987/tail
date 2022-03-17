import { EdgeBasicProps } from '@app/types';

const PERCENT = 0.25;
const DIST = 30;

type CoordinateArray = [number, number];

export function drawBezier({ sourceX, sourceY, targetX, targetY }: EdgeBasicProps) {
  const dist = Math.sqrt(Math.abs(sourceX - targetX) ** 2 + Math.abs(sourceY - targetY) ** 2);
  const [sourceXDamping, sourceYDamping]: CoordinateArray = [(dist * PERCENT + DIST) * 1, 0];
  const [targetXDamping, targetYDamping]: CoordinateArray = [(dist * PERCENT + DIST) * -1, 0];
  // const [sourceXDamping, sourceYDamping]: CoordinateArray = [100  * 1, 0];
  // const [targetXDamping, targetYDamping]: CoordinateArray = [100  * -1, 0];

  const [sourceXCtrl, sourceYCtrl] = [sourceX + sourceXDamping, sourceY + sourceYDamping];
  const [targetXCtrl, targetYCtrl] = [targetX + targetXDamping, targetY + targetYDamping];
  return `M ${sourceX} ${sourceY} C ${sourceXCtrl} ${sourceYCtrl} ${targetXCtrl} ${targetYCtrl} ${targetX} ${targetY}`;
}
