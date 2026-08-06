import type { AxSnapshot, Finding } from '../types';

const SERIOUS_THRESHOLD = 0.8;
const MODERATE_THRESHOLD = 0.6;

export function checkDivSoup(snapshot: AxSnapshot): Finding[] {
  const { ratio, genericContainers, totalElements } = snapshot.probes.divSoup;
  if (ratio < MODERATE_THRESHOLD) return [];
  return [
    {
      id: 'div-soup',
      severity: ratio >= SERIOUS_THRESHOLD ? 'serious' : 'moderate',
      category: 'div-soup',
      message: `${genericContainers}/${totalElements} elementos (${Math.round(ratio * 100)}%) são <div>/<span> genéricos sem role/label — sinal de marcação não-semântica.`,
    },
  ];
}
