import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// import { logger } from '@box/shared/lib/logger';
import pkg from '../../../package.json';

const sdk = new NodeSDK({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error TS2322
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: pkg.name,
    [SemanticResourceAttributes.SERVICE_VERSION]: pkg.version,
  }),
  textMapPropagator: new B3Propagator({
    injectEncoding: B3InjectEncoding.MULTI_HEADER,
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error TS2322
  spanProcessor: new BatchSpanProcessor(
    new JaegerExporter({
      endpoint: process.env.OTEL_EXPORTER_JAEGER_AGENT_ENDPOINT,
    }),
  ),
});

sdk
  .start()
  .then(() => console.info('[OPENTELEMETRY] - started'))
  .catch((error) => console.log('[OPENTELEMETRY] - Error initializing tracing', error));

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('[OPENTELEMETRY] - Tracing terminated'))
    .catch((error) => console.log('[OPENTELEMETRY] - Error terminating tracing', error))
    .finally(() => process.exit(0));
});
