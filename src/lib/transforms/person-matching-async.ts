import { matchPersons, type PersonMatchCandidate, type MatchResult } from './person-matching';

const WORKER_THRESHOLD = 200;

export async function matchPersonsAsync(
  sources: PersonMatchCandidate[],
  targets: PersonMatchCandidate[],
  threshold?: number
): Promise<MatchResult[]> {
  if (sources.length + targets.length < WORKER_THRESHOLD) {
    return matchPersons(sources, targets, threshold);
  }

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('./person-matching.worker.ts', import.meta.url)
    );
    worker.onmessage = (e: MessageEvent<MatchResult[]>) => {
      resolve(e.data);
      worker.terminate();
    };
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
    worker.postMessage({ sources, targets, threshold });
  });
}

export { WORKER_THRESHOLD };
