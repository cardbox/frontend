import * as React from 'react';
import { Event, createEvent } from 'effector-root';
import { MatchedRoute } from 'react-router-config';

const START = `☄️/start-event`;

export interface StartParams {
  params: Record<string, string>;
  query: Record<string, string>;
}

/**
 * Creates event to handle universal page loading
 */
export function createStart(...params: string[]): Event<StartParams> {
  const start = createEvent<StartParams>(...params);
  return start;
}

/**
 * Loads start event on browser side and pass params and query
 */
export function useStart(_startEvent: Event<StartParams>) {
  console.warn('[deprecated] `useStart` is deprecated. Please, use `withStart` as HOC instead');
}

/**
 * Ejects start event from component
 */
export function getStart<T>(component: T): undefined | Event<StartParams> {
  return component[START];
}

/**
 * Assign start event to component
 */
export function withStart<P extends Record<string, unknown>>(
  event: Event<StartParams>,
  component: React.FC<P>,
): React.FC<P> {
  component[START] = event;
  return component;
}

export function lookupStartEvent<P>(match: MatchedRoute<P>): Event<StartParams> | undefined {
  if (match.route.component) {
    return getStart(match.route.component);
  }
  return undefined;
}

export function routeWithEvent(event: Event<StartParams>) {
  return function <P>(route: MatchedRoute<P>) {
    return lookupStartEvent(route) === event;
  };
}
