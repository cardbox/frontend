import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { TraceIdRatioBasedSampler } from '@opentelemetry/core';
import { logger } from '@box/shared/lib/logger';

import pkg from '../../package.json';

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
      port: Number(process.env.OTEL_EXPORTER_JAEGER_AGENT_PORT!),
    }),
  ),
  sampler: new TraceIdRatioBasedSampler(0.5),
});

sdk.start().then(() => logger.info('[OPENTELEMETRY] - started'));
