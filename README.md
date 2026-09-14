# @conct/legal

Zentrale Quelle für Impressum und Datenschutzerklärung aller conct-Projekte.
Eine Adressänderung ist ein Commit hier — nicht acht Commits in acht Repos.

## Warum kein Runtime-Fetch

Das Impressum muss nach § 5 DDG **ständig verfügbar** sein. Ein Impressum, das
per `fetch()` nachgeladen wird, ist weg, sobald der Server hustet oder JS
blockiert ist. Deshalb liefert dieses Paket **Daten**, keine Endpunkte: jede
Seite backt ihr Impressum zur Build-Zeit in ihr eigenes Deployment ein.

Aus demselben Grund verlinkt keine Seite auf das Impressum einer anderen
Domain — jede Domain trägt ihr eigenes.

## Installation

```bash
npm i git+https://github.com/conct/legal.git#v1.1.0
```

> Das npm-Kürzel `github:conct/legal` löst auf `ssh://git@github.com/…` auf und
> scheitert ohne hinterlegten SSH-Key. Entweder die `git+https`-Form oben
> benutzen, oder einmalig global umschreiben:
> `git config --global url."https://github.com/".insteadOf ssh://git@github.com/`

Das Paket baut sich beim Installieren selbst (`prepare`-Script), es wird also
kein `dist/` eingecheckt. In Umgebungen, die Install-Scripts abschalten
(`npm ci --ignore-scripts`, gehärtete CI-Images), fehlt dadurch `dist/` —
dort einmalig `npm rebuild @conct/legal` nachschieben.

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

### Statische Seiten ohne Build (feif.space, pip-boy/docs/landing)

Diese Seiten konsumieren das Paket nicht direkt. Stattdessen rendert der
Workflow [`sync-static.yml`](.github/workflows/sync-static.yml) bei jedem
Release die HTML-Dateien neu und öffnet einen Pull Request im Ziel-Repo.

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
Datenverarbeitung der Seite geprüft. Aktuell ist nur `feif.space` auf `true` —
das ist gegen die Live-Seite abgeglichen und rendert wortgleich.

`ungeprueft()` listet die offenen Seiten, der Sync-Workflow warnt bei ihnen.
Vor dem Livegang einer Seite: Module durchgehen, dann die Flagge setzen.

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
| `rechtsform`, `land` | Firmierung |
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

`art: 'app'` formuliert um, wo Web-Sprache falsch wäre: „Die Server dieser App
werden bei … betrieben", „die dein **Gerät** automatisch übermittelt".

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
