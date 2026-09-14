/** Ein Inline-Knoten innerhalb eines Absatzes. */
export type Inline =
  | { t: 'text'; v: string }
  | { t: 'link'; v: string; href: string; extern?: boolean }
  | { t: 'br' };

/** Ein Block innerhalb eines Abschnitts. */
export type Block =
  | { t: 'p'; v: Inline[] }
  | { t: 'ul'; items: Inline[][] };

/** Ein Abschnitt mit Überschrift. */
export interface Section {
  title: string;
  blocks: Block[];
}

/** Ein vollständiges Rechtsdokument. */
export interface LegalDoc {
  /** Seitentitel, z.B. "Impressum". */
  title: string;
  /** Abschnitte werden beim Rendern durchnummeriert ("1. Verantwortlicher"). */
  numbered: boolean;
  sections: Section[];
}

/** Ansprache. Wirkt sich nur auf die Datenschutzerklärung aus. */
export type Tone = 'formell' | 'persoenlich';

// --- Hilfsfunktionen zum Bauen von Inline-Inhalten ---

export const txt = (v: string): Inline => ({ t: 'text', v });

export const br: Inline = { t: 'br' };

export const link = (v: string, href: string, extern = false): Inline => ({
  t: 'link',
  v,
  href,
  extern,
});

export const mail = (address: string): Inline => link(address, `mailto:${address}`);

/**
 * Telefonnummer als tel:-Link. `display` bleibt menschenlesbar.
 * Die in deutschen Schreibweisen übliche Verkehrsausscheidungsziffer "(0)"
 * wird entfernt — sie gehört nicht in die wählbare Nummer.
 */
export const tel = (display: string): Inline =>
  link(display, `tel:${display.replace(/\(0\)/g, '').replace(/[^\d+]/g, '')}`);

export const p = (...v: Inline[]): Block => ({ t: 'p', v });

/** Absatz aus mehreren Zeilen, getrennt durch Zeilenumbrüche. */
export const lines = (...items: (string | Inline)[]): Block => {
  const out: Inline[] = [];
  for (const item of items) {
    if (out.length > 0) out.push(br);
    out.push(typeof item === 'string' ? txt(item) : item);
  }
  return { t: 'p', v: out };
};

export const ul = (...items: (string | Inline[])[]): Block => ({
  t: 'ul',
  items: items.map((i) => (typeof i === 'string' ? [txt(i)] : i)),
});

/**
 * Verbindet eine Aufzählung im deutschen Satzbau:
 * "a, b sowie c". Einzelelemente bleiben unverändert.
 */
export const aufzaehlung = (items: readonly string[]): string => {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} sowie ${items[items.length - 1]}`;
};
