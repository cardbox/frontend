import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { logger } from '@box/shared/lib/logger';

import pkg from '../../../package.json';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: pkg.name,
    [SemanticResourceAttributes.SERVICE_VERSION]: pkg.version,
  }),
  textMapPropagator: new B3Propagator({
    injectEncoding: B3InjectEncoding.MULTI_HEADER,
  }),
  spanProcessor: new BatchSpanProcessor(
    new JaegerExporter({
      endpoint: process.env.OTEL_EXPORTER_JAEGER_AGENT_ENDPOINT,
    }),
  ),
});

sdk
  .start()
  .then(() => logger.info('[OPENTELEMETRY] - started'))
  .catch((error) => logger.log('[OPENTELEMETRY] - Error initializing tracing', error));

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => logger.log('[OPENTELEMETRY] - Tracing terminated'))
    .catch((error) => logger.log('[OPENTELEMETRY] - Error terminating tracing', error))
    .finally(() => process.exit(0));
});
