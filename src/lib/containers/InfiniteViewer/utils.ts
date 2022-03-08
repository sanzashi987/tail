export function getCSSVar(x: number, y: number, scale: number) {
  const bg = 96 * scale,
    bgs = 24 * scale,
    posX = (1 + x) % 96,
    posY = (1 + y) % 96;
  const cssvar: any = {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--scale': scale,
    '--bgsize': `${bg}px ${bg}px, ${bg}px ${bg}px, ${bgs}px ${bgs}px, ${bgs}px ${bgs}px`,
    '--bgpos': `${posX}px ${posY}px, ${posX}px ${posY}px, ${posX}px ${posY}px, ${posX}px ${posY}px`,
  };
  return cssvar;
}
