import { tracer } from '@box/app/opentelemetry/tracer';

const getPerformance = (): Performance => {
  if (process.env.BUILD_TARGET === 'server') {
    return require('perf_hooks').performance;
  }
  return global.performance;
};

export function measurement(name: string, commonLog = console.log) {
  const span = tracer.startSpan(name);
  const performance = getPerformance();
  const timeStart = performance.now();
  return {
    measure(log = commonLog, text = name) {
      const difference = performance.now() - timeStart;
      log(`[PERF] ${text} for %sms`, difference.toFixed(2));
      span.end();
      return difference;
    },
    span,
  };
}
