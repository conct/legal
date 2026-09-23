import { CONCT, type Anbieter } from './anbieter.js';
import * as ds from './datenschutz.js';
import { type DatenschutzOptions, type Modul, datenschutz } from './datenschutz.js';
import { type ImpressumOptions, impressum } from './impressum.js';
import { SITES, type Site, type SiteKey } from './sites.js';
import type { LegalDoc, Tone } from './types.js';

/**
 * Welche Datenschutz-Bausteine eine Seite braucht, an einer Stelle statt in
 * jeder App einzeln. Liegt bewusst hier und nicht in `sites.ts`: die Registry
 * darf die Bausteine nicht importieren, sonst entsteht ein Import-Zyklus.
 */
export interface Preset {
  tone: Tone;
  module: Modul[];
  /**
   * Wurde für diese Seite geprüft, dass die Bausteine die tatsächlich
   * stattfindende Datenverarbeitung abbilden?
   *
   * `false` heißt: das ist eine Vermutung aus dem Baukasten, kein geprüfter
   * Text. Vor dem Livegang durchgehen und auf `true` setzen — die Flagge ist
   * dazu da, dass ungeprüfte Seiten sichtbar bleiben statt still zu wirken.
   */
  geprueft: boolean;
}

export const PRESETS: Record<SiteKey, Preset> = {
  // Gegen die Live-Seite abgeglichen — rendert wortgleich.
  'feif.space': {
    tone: 'formell',
    geprueft: true,
    module: [
      ds.verantwortlicher,
      ds.hosting,
      ds.kontaktformular(),
      ds.keineCookies,
      ds.externeLinks,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },

  // Ab hier: Baukasten-Vermutungen. Vor dem Livegang prüfen.
  'choozy.io': {
    tone: 'persoenlich',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
  'velvet-network.app': {
    tone: 'persoenlich',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
  'unteruns.io': {
    tone: 'persoenlich',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
  // conct.de traegt einen eigenen Datenschutztext im Repo: Er beschreibt den
  // Schnellcheck und die Uebergabe an audit.conct.de, und er nennt die
  // Speicherdauer und die Kuerzung der Adressen, die am 23.09.2026 am Server
  // nachgemessen wurden. Von hier kommen die Stammdaten - Anschrift,
  // Telefon, E-Mail - damit eine Adressaenderung ein Commit bleibt.
  //
  // Das Preset steht trotzdem hier: Es ist die Vorlage, falls der Text
  // spaeter doch erzeugt werden soll, und es zeigt, welche Bausteine
  // einschlaegig waeren.
  'conct.de': {
    tone: 'formell',
    geprueft: false,
    module: [
      ds.verantwortlicher,
      ds.keinDatenschutzbeauftragter,
      ds.hostingMit({ logsTage: 7, adresseGekuerzt: true }),
      ds.keineCookies,
      ds.drittland,
      ds.einwilligungWiderruf,
      ds.externeLinks,
      ds.betroffenenrechte,
      ds.aktualitaet,
    ],
  },

  // Nutzt dieses Preset nicht: der Datenschutztext von rechnungswerk ist am
  // Quelltext belegt und bleibt im Repo. Von hier kommen nur die Stammdaten
  // (anbieterFuer). Steht hier für den Fall, dass sich das ändert.
  'rechnungswerk.conct.de': {
    tone: 'formell',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
  'pip-boy.feif.space': {
    tone: 'persoenlich',
    geprueft: false,
    module: ds.STANDARD_MODULE,
  },
};

/** Alle Seiten, deren Preset noch nicht geprüft wurde. */
export function ungeprueft(): SiteKey[] {
  return (Object.keys(PRESETS) as SiteKey[]).filter((k) => !PRESETS[k].geprueft);
}

function siteOf(key: SiteKey): Site {
  return SITES[key];
}

/**
 * Stammdaten für eine Seite: CONCT, überlagert mit den Abweichungen aus der
 * Registry. Auch für Texte außerhalb von Impressum und Datenschutz gedacht —
 * Widerrufsformular, Bestellmails, Verantwortlicher im eigenen Datenschutztext.
 */
export function anbieterFuer(key: SiteKey, basis: Anbieter = CONCT): Anbieter {
  return { ...basis, ...siteOf(key).anbieter };
}

/**
 * Impressum für eine registrierte Seite.
 *
 *   impressumFuer('choozy.io')
 */
export function impressumFuer(
  key: SiteKey,
  anbieter: Anbieter = anbieterFuer(key),
  opts?: ImpressumOptions,
): LegalDoc {
  return impressum(anbieter, siteOf(key), opts);
}

/**
 * Datenschutzerklärung für eine registrierte Seite, mit den in `PRESETS`
 * hinterlegten Bausteinen und der dort gewählten Tonlage.
 *
 *   datenschutzFuer('choozy.io')
 *   datenschutzFuer('choozy.io', CONCT, { tone: 'formell' })
 */
export function datenschutzFuer(
  key: SiteKey,
  anbieter: Anbieter = anbieterFuer(key),
  overrides: DatenschutzOptions = {},
): LegalDoc {
  const preset = PRESETS[key];
  return datenschutz(anbieter, siteOf(key), {
    tone: overrides.tone ?? preset.tone,
    module: overrides.module ?? preset.module,
  });
}
