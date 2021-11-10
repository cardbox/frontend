import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

const httpInstrumentation = new HttpInstrumentation();
httpInstrumentation.init();

const fastifyInstrumentation = new FastifyInstrumentation();
fastifyInstrumentation.init();
