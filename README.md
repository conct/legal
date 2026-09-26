# @conct/legal

Zentrale Quelle für Impressum und Datenschutzerklärung aller conct-Projekte.
Eine Adressänderung ist ein Commit hier — nicht acht Commits in acht Repos.

## Offen, aber für eigene Projekte

Dieses Repository ist absichtlich öffentlich. Die Texte, die es erzeugt, stehen
ohnehin auf jeder Seite, und die Angaben darin — Name, Anschrift, Telefon,
E-Mail, USt-IdNr. — muss ein Impressum nach § 5 DDG nennen. Wer nachsehen will,
ob auf einer Seite das steht, was hier drin steht, soll das können; für eine
Prüf-Dienstleistung ist das keine Nebensache.

Was daraus **nicht** folgt:

- **Keine Rechtsberatung.** Die Bausteine sind fachlich zusammengetragen, nicht
  anwaltlich geprüft. Sie ordnen ein, sie entscheiden nichts.
- **Nicht jeder Text ist abgenommen.** `PRESETS` führt pro Seite ein Feld
  `geprueft`. Auf `true` steht es nur bei `conct.de`, weil dort gegen die
  Live-Seite abgeglichen wurde. Für die übrigen steht es auf `false` — das sind
  Baukasten-Vermutungen, die vor einem Livegang durchzugehen sind.
  `ungeprueft()` gibt sie aus, und der Sync warnt bei jeder Seite, die ihre
  Rechtstexte von hier bezieht.
- **Für die eigenen Projekte gebaut.** Wer das Paket für ein fremdes Angebot
  einsetzt, übernimmt die Verantwortung für den Text, den es erzeugt — samt der
  Frage, ob die gewählten Bausteine den Sachverhalt dort überhaupt abbilden.

Die Steuernummer steht deshalb nicht in den Stammdaten: § 5 DDG verlangt sie
nicht, die USt-IdNr. erfüllt denselben Zweck, und was hier liegt, liegt auf
GitHub und in jedem Bundle, das das Paket einbindet.

## Warum kein Runtime-Fetch

Das Impressum muss nach § 5 DDG **ständig verfügbar** sein. Ein Impressum, das
per `fetch()` nachgeladen wird, ist weg, sobald der Server hustet oder JS
blockiert ist. Deshalb liefert dieses Paket **Daten**, keine Endpunkte: jede
Seite backt ihr Impressum zur Build-Zeit in ihr eigenes Deployment ein.

Aus demselben Grund verlinkt keine Seite auf das Impressum einer anderen
Domain — jede Domain trägt ihr eigenes.

## Installation

```bash
npm i git+https://github.com/conct/legal.git#v1.3.0
```

> `github:conct/legal#v1.2.0` funktioniert genauso — npm schreibt es beim
> Installieren ohnehin in diese Kurzform, und die Lockdatei vermerkt
> `git+ssh://`. Ein SSH-Key ist trotzdem nicht nötig: npm weicht bei GitHub auf
> HTTPS aus. Geprüft mit blockiertem SSH und leerem Cache, für `npm install`
> und `npm ci`.

Das Paket baut sich beim Installieren selbst (`prepare`-Script), es wird also
kein `dist/` eingecheckt. In Umgebungen, die Install-Scripts abschalten
(`npm ci --ignore-scripts`, gehärtete CI-Images), fehlt dadurch `dist/` —
dort einmalig `npm rebuild @conct/legal` nachschieben.

## Nicht ins Browser-Bundle importieren

Das Paket enthält den **gesamten Stammdatensatz** aller Seiten. Wer es in Code
importiert, der im Browser läuft, liefert diesen Datensatz mit aus — auch
Felder, die eine Seite über `Site.anbieter` bewusst ausblendet. Ein
`telefon: undefined` blendet die Angabe im gerenderten Text aus, aber das
Literal in `CONCT` steht trotzdem im Skript.

So passiert bei rechnungswerk: Ein Widerrufsformular, das im Browser läuft,
importierte `anbieterFuer()`, und die Steuernummer stand im Seitenquelltext.

Deshalb: **nur zur Build-Zeit oder serverseitig importieren** — in Astro im
Frontmatter, in Next in Server Components. Braucht ein Browser-Skript einzelne
Angaben, löst die Seite sie beim Bauen auf und reicht nur diese weiter, etwa
als `data-`Attribut.

React-Native-Apps bündeln das Paket zwangsläufig. Dort gilt: was in `CONCT`
steht, steht in jeder App.

## Was nicht ins Paket gehört

Dieses Repo ist öffentlich, und jedes Feld in `CONCT` landet in jedem Bundle,
das das Paket einbindet. Hier steht nur, was ohnehin öffentlich sein muss.
**Nicht hierher:** Steuernummer, steuerliche Identifikationsnummer (§ 139b AO),
Bankverbindung, Zugangsdaten. Die USt-IdNr. dagegen gehört ins Impressum und
damit hierher, sobald sie vorliegt.

Die Steuernummer stand bis v1.2.0 in `CONCT` und ist in der Git-Historie
weiterhin sichtbar. Sie steht allerdings auch auf jeder ausgestellten Rechnung
(§ 14 Abs. 4 UStG) und ist damit kein Geheimnis im engeren Sinn — die
Historie wurde deshalb nicht umgeschrieben.

## Konzept: Blöcke statt Markup

Das Paket gibt **strukturierte Daten** zurück, kein HTML. Das ist nötig, weil
velvet, rechnungswerk und pip-boy React-Native-Apps haben, in denen HTML
wertlos ist. Drei Renderer setzen die Blöcke in die jeweilige Zielwelt um.

```
impressum(anbieter, site) ─┬─ @conct/legal/html  → HTML-String   (Astro, statische Seiten)
datenschutz(anbieter, ...) ┘  @conct/legal/react → JSX           (Next, React Native)
                              @conct/legal/text  → Markdown/Text (Mails, App-Stores)
```

## Verwendung

### Next.js (choozy, velvet, unteruns)

```tsx
// app/impressum/page.tsx
import { CONCT, SITES, impressum } from '@conct/legal';
import { Legal } from '@conct/legal/react';

export const metadata = { title: 'Impressum' };

export default function Page() {
  return (
    <main className="legal">
      <Legal doc={impressum(CONCT, SITES['choozy.io'])} />
    </main>
  );
}
```

### Astro (rechnungswerk)

```astro
---
import { CONCT, SITES, impressum } from '@conct/legal';
import { toHtml } from '@conct/legal/html';
const html = toHtml(impressum(CONCT, SITES['rechnungswerk.conct.de']));
---
<Layout title="Impressum">
  <section class="legal" set:html={html} />
</Layout>
```

### React Native (velvet/mobile, rechnungswerk/mobile, pip-boy/mobile)

Die Adapter sind der einzige plattformspezifische Teil — rund 30 Zeilen:

```tsx
import { Linking, Text, View } from 'react-native';
import { Legal, type Adapters } from '@conct/legal/react';
import { CONCT, SITES, impressum } from '@conct/legal';

const native: Adapters = {
  Title: ({ children }) => <Text style={s.h1}>{children}</Text>,
  Heading: ({ children }) => <Text style={s.h2}>{children}</Text>,
  Paragraph: ({ children }) => <Text style={s.p}>{children}</Text>,
  List: ({ children }) => <View style={s.ul}>{children}</View>,
  ListItem: ({ children }) => <Text style={s.li}>{'• '}{children}</Text>,
  Link: ({ href, children }) => (
    <Text style={s.a} onPress={() => Linking.openURL(href)}>{children}</Text>
  ),
  Break: () => <Text>{'\n'}</Text>,
};

<Legal doc={impressum(CONCT, SITES['velvet-network.app'])} adapters={native} />
```

### Statische Seiten ohne Build (conct.de, feif.space, pip-boy/docs/landing)

Diese Seiten konsumieren das Paket nicht direkt. Stattdessen rendert der
Workflow [`sync-static.yml`](.github/workflows/sync-static.yml) bei jedem
Release die HTML-Dateien neu und öffnet einen Pull Request im Ziel-Repo.

Was eine Seite bezieht, steht in `STATIC_SITES` in
[`scripts/sync-static.mjs`](scripts/sync-static.mjs) — und es muss nicht alles
sein:

| Seite | Rechtstexte | Anschrift in der Fußzeile | `sameAs` |
|---|---|---|---|
| conct.de | ja, deutsch und englisch | ja | ja, am `#organization`-Knoten |
| feif.space | **nein**, von Hand gepflegt | — | ja, am `#person`-Knoten |

feif.space hat seine Rechtstexte von Hand im Template, und sie sind
ausführlicher als das, was das Preset heute erzeugt. Deshalb steht dort kein
`dateien`-Eintrag. Der Preis dafür ist ausdrücklich: **eine Adressänderung hier
erreicht feif.space nicht** und ist dort nachzuziehen. Wer das umdrehen will,
gleicht erst `PRESETS['feif.space']` an den Live-Text an und trägt `dateien`
danach ein.

Welcher JSON-LD-Knoten `sameAs` bekommt, sagt `sameAsId` (Default
`#organization`). Geschrieben wird nur die Liste selbst — die Formatierung des
Blocks bleibt, wie die Seite sie gesetzt hat.

## Datenschutz: Bausteine und Tonlage

Die Datenschutzerklärung wird aus Modulen zusammengesetzt, weil sie sich pro
Projekt stärker unterscheidet als das Impressum (Hosting, Cookies, Konten).
Die Abschnitte werden automatisch durchnummeriert.

```ts
import { CONCT, SITES, datenschutz, ds } from '@conct/legal';

const doc = datenschutz(CONCT, SITES['choozy.io'], {
  tone: 'persoenlich',           // 'formell' (Sie, Default) | 'persoenlich' (du)
  module: [
    ds.verantwortlicher,
    ds.hosting,
    ds.nutzerkonto({ daten: 'E-Mail-Adresse, Anzeigename' }),
    ds.technischeCookies({ zweck: 'die Anmeldung und die Sitzungsverwaltung' }),
    ds.betroffenenrechte,
    ds.aktualitaet,
  ],
});
```

Ohne `module` gilt `STANDARD_MODULE`: Verantwortlicher, Datenschutzbeauftragter,
Hosting, Auftragsverarbeitung, keine Cookies, Betroffenenrechte, Aktualität.

Bausteine, für die keine Daten hinterlegt sind, geben `null` zurück und
entfallen samt Abschnittsnummer — `datenschutzbeauftragter` und
`auftragsverarbeitung` stehen deshalb gefahrlos im Standardsatz.

| Baustein | Parameter |
|---|---|
| `verantwortlicher` | — |
| `datenschutzbeauftragter` | — (nutzt `anbieter.datenschutzbeauftragter`) |
| `hosting` | — (nutzt `site.hoster` und `site.art`) |
| `auftragsverarbeitung` | — (nutzt `site.drittdienste`) |
| `kontaktformular({ honeypot })` | Honeypot erwähnen, Default `true` |
| `keineCookies` | — |
| `technischeCookies({ zweck })` | wofür die Cookies nötig sind |
| `nutzerkonto({ daten })` | welche Daten beim Anlegen erhoben werden |
| `externeLinks` | — (nutzt `site.externeLinks`) |
| `betroffenenrechte` | — |
| `aktualitaet` | — |

**Tonlage:** `formell` siezt, `persoenlich` duzt. Die Wahl wirkt nur auf den
Datenschutz — das Impressum ist durchgängig sachlich formuliert und enthält
keine Anrede.

## Presets: eine Seite, ein Aufruf

Damit die Modulliste nicht in jeder App erneut steht — bei velvet und
rechnungswerk sonst zweimal, für Web und App — liegt sie pro Seite in
[`src/presets.ts`](src/presets.ts):

```ts
import { impressumFuer, datenschutzFuer } from '@conct/legal';

impressumFuer('choozy.io');
datenschutzFuer('choozy.io');              // nimmt Tonlage + Module aus dem Preset
datenschutzFuer('choozy.io', CONCT, { tone: 'formell' });  // punktuell abweichen
```

Die Presets liegen bewusst nicht in `sites.ts`: die Registry darf die
Bausteine nicht importieren, sonst entsteht ein Import-Zyklus.

### Die `geprueft`-Flagge

Jedes Preset trägt `geprueft: boolean`. `false` heißt: die Bausteine sind eine
Vermutung aus dem Baukasten, niemand hat gegen die tatsächliche
Datenverarbeitung der Seite geprüft. Aktuell steht nur `conct.de` auf `true`.

`feif.space` stand bis zum 26.09.2026 ebenfalls auf `true`, mit dem Vermerk
„rendert wortgleich". Nachgemessen stimmte das nicht: 13 Abschnitte live gegen
7 aus dem Preset, Du-Form gegen Sie-Form. Aufgefallen war es nicht, weil der
Sync die Rechtstexte dieser Seite ohnehin nicht anfasst — eine Flagge, die
niemand einlöst, wird auch von niemandem widerlegt. Sie steht jetzt auf
`false`.

`ungeprueft()` listet die offenen Seiten, der Sync warnt bei jeder, die ihre
Rechtstexte von hier bezieht. Vor dem Livegang einer Seite: Module durchgehen,
dann die Flagge setzen.

## Fremde Anbieter

`impressum()` und `datenschutz()` bekommen den Anbieter übergeben statt ihn zu
importieren. Seiten mit fremden Betreibern — etwa `unteruns.io/g/[slug]`, wo
jede Gruppe ihr eigenes Impressum trägt — nutzen dieselben Textbausteine mit
anderen Stammdaten:

```ts
impressum({ name: gruppe.betreiber, strasse: …, email: … }, site);
```

## Die Interfaces erweitern

`Anbieter` und `Site` sind offene Interfaces. Neue Felder **immer optional**
anlegen — dann ist es ein Minor-Release und kein Konsument muss nachziehen.
Ein Pflichtfeld ist ein Breaking Change.

Das Muster: Feld ergänzen, Abschnitt nur rendern, wenn es gesetzt ist. Die
Renderer bleiben unberührt, sie kennen nur Blöcke.

`Anbieter` — neben den Stammdaten:

| Feld | Wofür |
|---|---|
| `rechtsform`, `land`, `marke`, `rechtlicheStellung` | Firmierung |
| `ustId` / `steuernummer` / `wirtschaftsId` | § 27a UStG, § 139c AO |
| `registergericht` | Handels-/Vereinsregister |
| `medienVerantwortlich` | § 18 Abs. 2 MStV, falls abweichend |
| `berufsrecht` | § 5 Abs. 1 Nr. 5 DDG, nur bei reglementierten Berufen |
| `berufshaftpflicht` | § 2 Abs. 1 Nr. 11 DL-InfoV |
| `datenschutzbeauftragter` | ab 20 ständig mit Verarbeitung befassten Personen |
| `aufsichtsbehoerde` | falls konkret benannt |

`Site`:

| Feld | Wofür |
|---|---|
| `art` | `'website'` (Default) \| `'app'` \| `'angebot'` — steuert die Formulierung |
| `hoster` | Baustein `hosting` |
| `externeLinks` | Haftung für Links, Externe Links |
| `drittdienste` | Baustein `auftragsverarbeitung` (Name, Zweck, Ort) |
| `anbieter` | abweichende Stammdaten nur für diese Seite, siehe unten |

`art: 'app'` formuliert um, wo Web-Sprache falsch wäre: „Die Server dieser App
werden bei … betrieben", „die dein **Gerät** automatisch übermittelt".

## Abweichende Stammdaten pro Seite

Nicht jede Seite zeigt dieselben Stammdaten. `Site.anbieter` legt Abweichungen
über `CONCT`; ein Feld mit `undefined` entfernt die Angabe:

```ts
'rechnungswerk.conct.de': {
  anbieter: {
    email: 'mail@conct.de',   // Kaufmails kommen von hier
    marke: 'feif.space',
  },
},
```

`impressumFuer` und `datenschutzFuer` wenden das automatisch an. Für Texte
außerhalb der beiden Seiten — Widerrufsformular, Bestellmails, ein eigener
Datenschutztext — liefert `anbieterFuer('rechnungswerk.conct.de')` dieselben
zusammengeführten Stammdaten.

## Keine OS-Plattform mehr

Die EU-Plattform zur Online-Streitbeilegung ist seit dem 20.07.2025
abgeschaltet (VO (EU) 2024/3228). Seit v1.2.0 rendert das Impressum nur noch
den Abschnitt „Verbraucherstreitbeilegung" ohne Link. Seiten, die noch einen
älteren Stand ausliefern, zeigen einen toten und abmahnfähigen Verweis.

## Neue Seite eintragen

`src/sites.ts` ist eine offene Map. Ein Eintrag genügt:

```ts
'webtik.example': {
  domain: 'webtik.example',
  name: 'Webtik',
  hoster: 'Uberspace Entwicklungen GbR',
},
```

Eine App kann auch ohne Registry-Eintrag ein eigenes `Site`-Objekt übergeben.

## Release

```bash
npm version minor && git push --follow-tags
```

Konsumenten ziehen per Renovate/Dependabot nach; die statischen Seiten bekommen
automatisch einen PR.

## Kein Rechtsrat

Die Textbausteine sind sorgfältig formuliert, ersetzen aber keine
Rechtsberatung. Vor dem ersten Einsatz auf einer neuen Seite prüfen, ob die
gewählten Module die dort tatsächlich stattfindende Datenverarbeitung
vollständig abbilden.
