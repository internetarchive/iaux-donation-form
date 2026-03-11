export function promisedSleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
