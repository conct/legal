import { createElement, Fragment, type ComponentType, type ReactNode } from 'react';
import type { Block, Inline, LegalDoc } from '../types.js';

type WithChildren = { children?: ReactNode };

/**
 * Plattform-Adapter. Web nutzt die Defaults unten, React Native übergibt
 * eigene Komponenten auf Basis von <Text>/<View>.
 */
export interface Adapters {
  Title: ComponentType<WithChildren>;
  Heading: ComponentType<WithChildren>;
  Paragraph: ComponentType<WithChildren>;
  List: ComponentType<WithChildren>;
  ListItem: ComponentType<WithChildren>;
  Link: ComponentType<WithChildren & { href: string; extern: boolean }>;
  Break: ComponentType<Record<string, unknown>>;
}

export const webAdapters: Adapters = {
  Title: ({ children }) => createElement('h1', null, children),
  Heading: ({ children }) => createElement('h2', null, children),
  Paragraph: ({ children }) => createElement('p', null, children),
  List: ({ children }) => createElement('ul', null, children),
  ListItem: ({ children }) => createElement('li', null, children),
  Link: ({ href, extern, children }) =>
    createElement(
      'a',
      extern ? { href, target: '_blank', rel: 'noopener' } : { href },
      children,
    ),
  Break: () => createElement('br'),
};

function renderInline(nodes: Inline[], a: Adapters): ReactNode[] {
  return nodes.map((n, i) => {
    switch (n.t) {
      case 'text':
        return createElement(Fragment, { key: i }, n.v);
      case 'br':
        return createElement(a.Break, { key: i });
      case 'link':
        return createElement(
          a.Link,
          { key: i, href: n.href, extern: n.extern ?? false },
          n.v,
        );
    }
  });
}

function renderBlock(b: Block, a: Adapters, key: number): ReactNode {
  switch (b.t) {
    case 'p':
      return createElement(a.Paragraph, { key }, renderInline(b.v, a));
    case 'ul':
      return createElement(
        a.List,
        { key },
        b.items.map((item, i) =>
          createElement(a.ListItem, { key: i }, renderInline(item, a)),
        ),
      );
  }
}

export interface LegalProps {
  doc: LegalDoc;
  /** Default: webAdapters. */
  adapters?: Adapters;
  /** Titel mitrendern. Default: true. */
  includeTitle?: boolean;
}

/**
 * Rendert ein Rechtsdokument. Ohne `adapters` kommt Web-HTML heraus;
 * React Native übergibt eigene Adapter.
 */
export function Legal({ doc, adapters, includeTitle }: LegalProps): ReactNode {
  const a = adapters ?? webAdapters;
  const children: ReactNode[] = [];

  if (includeTitle !== false) {
    children.push(createElement(a.Title, { key: 'title' }, doc.title));
  }

  doc.sections.forEach((s, i) => {
    const nr = doc.numbered ? `${i + 1}. ` : '';
    children.push(createElement(a.Heading, { key: `h${i}` }, `${nr}${s.title}`));
    s.blocks.forEach((b, j) => {
      const node = renderBlock(b, a, j);
      children.push(createElement(Fragment, { key: `b${i}-${j}` }, node));
    });
  });

  return createElement(Fragment, null, ...children);
}
