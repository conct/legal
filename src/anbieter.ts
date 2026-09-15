import { type Block, type Inline, br, lines, mail, tel, txt } from './types.js';

/**
 * Die verantwortliche Stelle im Sinne von § 5 DDG und Art. 4 Nr. 7 DSGVO.
 * Für Mandanten-Seiten (z.B. unteruns.io/g/[slug]) wird hier ein anderer
 * Anbieter übergeben als das CONCT-Preset.
 */
export interface Anbieter {
  name: string;
  rechtsform?: string;
  /** Marke, unter der das Angebot auftritt, z.B. "feif.space". Keine eigene Gesellschaft. */
  marke?: string;
  /** Kurze Angabe zur Unternehmensform, z.B. "Einzelunternehmen. Nicht im Handelsregister eingetragen." */
  rechtlicheStellung?: string;
  strasse: string;
  plz: string;
  ort: string;
  land?: string;
  email: string;
  telefon?: string;
  /** Steuernummer — nur angeben, wenn keine USt-IdNr. vorhanden ist. */
  steuernummer?: string;
  ustId?: string;
  registergericht?: { gericht: string; nummer: string };
  /** Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV. Default: name. */
  medienVerantwortlich?: string;
  /** Zuständige Datenschutz-Aufsichtsbehörde, falls konkret benannt. */
  aufsichtsbehoerde?: string;
  /** Wirtschafts-Identifikationsnummer nach § 139c AO. */
  wirtschaftsId?: string;
  /**
   * Angaben zu reglementierten Berufen nach § 5 Abs. 1 Nr. 5 DDG.
   * Nur ausfüllen, wenn der Beruf tatsächlich reglementiert ist —
   * IT-Dienstleistung ist es nicht.
   */
  berufsrecht?: {
    bezeichnung: string;
    verleihungsstaat: string;
    kammer: string;
    /** Bezeichnung der einschlägigen berufsrechtlichen Regelungen. */
    regelungen?: string;
    /** Wo die Regelungen einsehbar sind. */
    regelungenUrl?: string;
  };
  /** Berufshaftpflicht nach § 2 Abs. 1 Nr. 11 DL-InfoV. */
  berufshaftpflicht?: {
    versicherer: string;
    /** Räumlicher Geltungsbereich, z.B. "Deutschland" oder "EU". */
    geltungsraum: string;
  };
  /** Datenschutzbeauftragter — ab 20 ständig mit Verarbeitung befassten Personen Pflicht. */
  datenschutzbeauftragter?: {
    name: string;
    email: string;
    telefon?: string;
  };
}

/** Anschrift als Zeilenblock. */
export function anschrift(a: Anbieter): Block {
  const items: string[] = [];
  if (a.rechtsform) items.push(`${a.name} ${a.rechtsform}`);
  else items.push(a.name);
  if (a.marke) items.push(a.marke);
  items.push(a.strasse, `${a.plz} ${a.ort}`);
  if (a.land) items.push(a.land);
  return lines(...items);
}

/** Kontaktzeilen (Telefon/E-Mail) als Absatz. */
export function kontakt(a: Anbieter): Block {
  const out: Inline[] = [];
  if (a.telefon) {
    out.push(txt('Telefon: '), tel(a.telefon));
  }
  if (out.length > 0) out.push(br);
  out.push(txt('E-Mail: '), mail(a.email));
  return { t: 'p', v: out };
}

/** Anschrift und Kontakt in einem Block — für den Verantwortlichen im Datenschutz. */
export function anschriftMitKontakt(a: Anbieter): Block {
  const out: Inline[] = [];
  // mail()/tel() bestehen aus Label + Link und dürfen nicht durch einen
  // Umbruch getrennt werden — daher zeilenweise zusammensetzen.
  const zeile = (...parts: Inline[]) => {
    if (out.length > 0) out.push(br);
    out.push(...parts);
  };
  zeile(txt(a.rechtsform ? `${a.name} ${a.rechtsform}` : a.name));
  if (a.marke) zeile(txt(a.marke));
  zeile(txt(a.strasse));
  zeile(txt(`${a.plz} ${a.ort}`));
  if (a.land) zeile(txt(a.land));
  zeile(txt('E-Mail: '), mail(a.email));
  if (a.telefon) zeile(txt('Telefon: '), tel(a.telefon));
  return { t: 'p', v: out };
}

/** Das Standard-Preset. Einzige Stelle, an der diese Daten stehen. */
export const CONCT: Anbieter = {
  name: 'Daniel von Lühmann',
  strasse: 'Hauptstraße 154',
  plz: '01833',
  ort: 'Dürrröhrsdorf-Dittersbach',
  email: 'mail@feif.space',
  telefon: '+49 (0) 611 9458 4300',
  steuernummer: '210/246/14465',
  // Amtliche Bezeichnung seit 2023; Umzug aus der Devrientstraße im April 2025
  // (Medieninformation vom 03.04.2025, datenschutz.sachsen.de/kontakt.html).
  aufsichtsbehoerde:
    'Sächsische Datenschutz- und Transparenzbeauftragte, Maternistraße 17, 01067 Dresden',
};
