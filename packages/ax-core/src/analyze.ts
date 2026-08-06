import { checkDivSoup } from './checks/divSoup';
import { checkForms } from './checks/forms';
import { checkHeadings } from './checks/headings';
import { checkLandmarks } from './checks/landmarks';
import { checkLinks } from './checks/links';
import { checkNames } from './checks/names';
import { checkNoise } from './checks/noise';
import { scoreFindings } from './score';
import type { AxFindings, AxSnapshot } from './types';

export function analyze(snapshot: AxSnapshot): AxFindings {
  const findings = [
    ...checkLandmarks(snapshot),
    ...checkHeadings(snapshot),
    ...checkNames(snapshot),
    ...checkDivSoup(snapshot),
    ...checkLinks(snapshot),
    ...checkForms(snapshot),
    ...checkNoise(snapshot),
  ];
  const { score, band } = scoreFindings(findings);
  return { schema: 'ax-findings/1', url: snapshot.url, score, band, findings };
}
