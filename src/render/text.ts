import type { Block, Inline, LegalDoc } from '../types.js';

export interface TextOptions {
  /** Links als "Text (URL)" ausschreiben. Default: true. */
  urlsAusschreiben?: boolean;
}

function inline(n: Inline, opts: TextOptions): string {
  switch (n.t) {
    case 'text':
      return n.v;
    case 'br':
      return '\n';
    case 'link':
      if (opts.urlsAusschreiben === false) return n.v;
      return n.v === n.href ? n.v : `${n.v} (${n.href})`;
  }
}

function block(b: Block, opts: TextOptions): string {
  switch (b.t) {
    case 'p':
      return b.v.map((n) => inline(n, opts)).join('');
    case 'ul':
      return b.items
        .map((i) => `- ${i.map((n) => inline(n, opts)).join('')}`)
        .join('\n');
  }
}

/** Rendert das Dokument als Markdown — für READMEs, Mails, App-Stores. */
export function toMarkdown(doc: LegalDoc, opts: TextOptions = {}): string {
  const out: string[] = [`# ${doc.title}`];

  doc.sections.forEach((s, i) => {
    const nr = doc.numbered ? `${i + 1}. ` : '';
    out.push('', `## ${nr}${s.title}`, '');
    out.push(s.blocks.map((b) => block(b, opts)).join('\n\n'));
  });

  return out.join('\n') + '\n';
}

/** Rendert das Dokument als reinen Text — für Plaintext-Mails. */
export function toPlainText(doc: LegalDoc, opts: TextOptions = {}): string {
  const out: string[] = [doc.title.toUpperCase(), ''];

  doc.sections.forEach((s, i) => {
    const nr = doc.numbered ? `${i + 1}. ` : '';
    out.push(`${nr}${s.title}`, '');
    out.push(s.blocks.map((b) => block(b, opts)).join('\n\n'), '');
  });

  return out.join('\n');
}
