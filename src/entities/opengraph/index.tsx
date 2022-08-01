import { createEvent, createStore, guard, sample, Store } from 'effector';
import { useStore } from 'effector-react/scope';
import { Hatch } from 'framework';
import React from 'react';
import { Helmet } from 'react-helmet-async';

/** Namespace URI: https://ogp.me/ns/article# */
type Article = {
  /** og:type */
  type: 'article';

  /** article:tag */
  tag: string[];

  /** og:description */
  description: string;

  /** og:title */
  title: string;

  /**
   * Need to be mapped to an og:url and article:publisher
   */
  path: string;
};

/**
 * Add og:site_name = "Cardbox"
 */

type OpenGraph = Article;

const cleanupOpenGraph = createEvent();
const setOpenGraph = createEvent<OpenGraph>();

export const $openGraph = createStore<OpenGraph | null>(null, { serialize: 'ignore' });

$openGraph.on(setOpenGraph, (_, openGraph) => openGraph).reset(cleanupOpenGraph);

export function withOpenGraph({
  hatch,
  openGraph,
}: {
  hatch: Hatch;
  openGraph: Store<OpenGraph | null>;
}) {
  guard({
    source: openGraph,
    clock: [hatch.enter, openGraph, hatch.update],
    filter: (openGraph): openGraph is OpenGraph => Boolean(openGraph),
    target: setOpenGraph,
  });

  sample({
    source: hatch.exit,
    target: cleanupOpenGraph,
  });
}

export const OpenGraphTags: React.FC<{ basePath: string }> = ({ basePath }) => {
  const og = useStore($openGraph);
  if (!og) return null;
  const properties = ogToMeta(og, basePath);
  return (
    <Helmet>
      {properties.map((meta, index) => (
        // Here it is allowed
        // eslint-disable-next-line react/no-array-index-key
        <meta key={index} property={meta.property} content={meta.content} />
      ))}
    </Helmet>
  );
};

type Meta = { property: string; content: string };

function ogToMeta(openGraph: OpenGraph, basePath: string): Meta[] {
  const properties: Meta[] = [];
  if (openGraph.type === 'article') {
    const url = `${basePath}${openGraph.path}`;
    properties.push(
      { property: 'og:type', content: 'article' },
      { property: 'og:description', content: openGraph.description },
      { property: 'og:title', content: openGraph.title },
      { property: 'og:url', content: url },
      { property: 'article:publisher', content: url },
    );
    openGraph.tag.forEach((tag) => {
      properties.push({ property: 'article:tag', content: tag });
    });
  }
  return properties;
}
