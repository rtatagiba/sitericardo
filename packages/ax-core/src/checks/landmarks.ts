import type { AxSnapshot, Finding } from '../types';

export function checkLandmarks(snapshot: AxSnapshot): Finding[] {
  const { landmarkCount } = snapshot.probes.pageMeta;
  const hasMainRole = snapshot.nodes.some((n) => !n.ignored && n.role === 'main');

  if (landmarkCount === 0) {
    return [
      {
        id: 'landmarks-none',
        severity: 'serious',
        category: 'landmarks',
        message:
          'A página não tem nenhum landmark (header/nav/main/aside/footer ou role equivalente) — um agente não consegue pular direto pro conteúdo principal.',
      },
    ];
  }
  if (!hasMainRole) {
    return [
      {
        id: 'landmarks-no-main',
        severity: 'moderate',
        category: 'landmarks',
        message: 'Não há landmark "main" — falta o ponto de entrada óbvio pro conteúdo central da página.',
      },
    ];
  }
  return [];
}
