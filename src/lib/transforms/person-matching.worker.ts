import { matchPersons, type PersonMatchCandidate } from './person-matching';

self.onmessage = (e: MessageEvent<{ sources: PersonMatchCandidate[]; targets: PersonMatchCandidate[]; threshold?: number }>) => {
  const { sources, targets, threshold } = e.data;
  const results = matchPersons(sources, targets, threshold);
  self.postMessage(results);
};
