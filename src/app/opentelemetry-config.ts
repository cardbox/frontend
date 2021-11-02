import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
const httpInstrumentation = new HttpInstrumentation();
httpInstrumentation.init();
import { B3Propagator } from '@opentelemetry/propagator-b3';
import {
  BatchSpanProcessor, ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { TraceIdRatioBasedSampler } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

// Configure a tracer provider.
const provider = new NodeTracerProvider({
  sampler: new TraceIdRatioBasedSampler(0.5),
});

// Add a span exporter.
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new JaegerExporter({
      port: Number(process.env.OTEL_EXPORTER_JAEGER_AGENT_PORT!),
    }),
  ),
);

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new ConsoleSpanExporter(),
  ),
);

// Register a global tracer provider.
provider.register({
  propagator: new B3Propagator(),
});

registerInstrumentations({
  instrumentations: [httpInstrumentation],
});
