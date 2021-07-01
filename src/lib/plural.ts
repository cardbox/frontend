export function plural(count: number, single: string, multi: string) {
  return count === 1 ? single : multi;
}
