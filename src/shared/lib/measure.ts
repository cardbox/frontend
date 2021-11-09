export function measurement(name: string, commonLog = console.log) {
  const timeStart = performance.now();
  return {
    measure(log = commonLog, text = name) {
      const difference = performance.now() - timeStart;
      log(`[PERF] ${text} for %sms`, difference.toFixed(2));
      return difference;
    },
  };
}
