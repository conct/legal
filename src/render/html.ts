import type { Block, Inline, LegalDoc } from '../types.js';

export interface HtmlOptions {
  /** Überschriftenebene des Dokumenttitels. Default: 1. */
  titleLevel?: 1 | 2;
  /** Titel mitrendern. Default: true. */
  includeTitle?: boolean;
}

const escape = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function inline(n: Inline): string {
  switch (n.t) {
    case 'text':
      return escape(n.v);
    case 'br':
      return '<br>';
    case 'link': {
      const rel = n.extern ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${escape(n.href)}"${rel}>${escape(n.v)}</a>`;
    }
  }
}

function block(b: Block, indent: string): string {
  switch (b.t) {
    case 'p':
      return `${indent}<p>${b.v.map(inline).join('')}</p>`;
    case 'ul': {
      const items = b.items
        .map((i) => `${indent}  <li>${i.map(inline).join('')}</li>`)
        .join('\n');
      return `${indent}<ul>\n${items}\n${indent}</ul>`;
    }
  }
}

/**
 * Rendert das Dokument als HTML-Fragment — ohne <html>, <head> oder Layout.
 * Das Fragment wird in das jeweilige Seitentemplate eingesetzt.
 */
export function toHtml(doc: LegalDoc, opts: HtmlOptions = {}): string {
  const titleLevel = opts.titleLevel ?? 1;
  const hLevel = titleLevel + 1;
  const out: string[] = [];

  if (opts.includeTitle !== false) {
    out.push(`<h${titleLevel}>${escape(doc.title)}</h${titleLevel}>`);
  }

  doc.sections.forEach((s, i) => {
    const nr = doc.numbered ? `${i + 1}. ` : '';
    out.push('');
    out.push(`<h${hLevel}>${nr}${escape(s.title)}</h${hLevel}>`);
    for (const b of s.blocks) out.push(block(b, ''));
  });

  return out.join('\n');
}
