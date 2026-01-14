import platformPerimeter from '@/perimeters/platform.perimeter';

const DEFAULT_LAYOUT = 'total, prev, pager, next, sizes';
const NAFMII_LAYOUT = 'total, sizes, prev, pager, next, jumper';

export function getPaginationLayout(layout) {
  if (platformPerimeter.isNafmiiEnv()) {
    return NAFMII_LAYOUT;
  }
  return layout || DEFAULT_LAYOUT;
}
