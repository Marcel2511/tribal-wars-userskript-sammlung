# Die Stämme – Scriptpaket / Userscript Loader

Dieses Repository enthält ein modulares **Tampermonkey-Scriptpaket** für *Die Stämme / Tribal Wars*.

Ziel des Projekts ist es, bestehende und eigene Userscripts **zentral zu bündeln**, übersichtlich zu konfigurieren und kontextabhängig auszuführen, ohne dass jedes Script einzeln installiert werden muss.

Die Verwaltung erfolgt über eine **Ingame-Einstellungsseite**, die vom Loader bereitgestellt wird.

---

## Repository-Struktur

Das Repository ist bewusst in zwei Bereiche aufgeteilt:

**/scripts/**
- `own/` – Eigene Skripte  
- `mirrored/` – Gespiegelte Skripte von Drittanbietern


### Eigene Skripte (`/scripts/own`)
- Enthält selbst entwickelte Userscripts.
- Je nach Komplexität des jeweiligen Skripts existiert eine **separate Anleitung** (README oder Dokumentation).
- Diese Anleitungen sind in der Modultabelle verlinkt.

### Gespiegelte Skripte (`/scripts/mirrored`)
- Enthält **unveränderte Spiegelungen** von Userscripts anderer Autoren.
- Die Skripte werden **ausschließlich aus technischen Gründen** hier gehostet, um eine Einbindung in das Scriptpaket zu ermöglichen.
- **Autor, Originalquelle und ggf. Lizenz** bleiben vollständig erhalten und unverändert im Script-Header.

> Alle Rechte an gespiegelten Skripten liegen bei den jeweiligen Originalautoren.

---

## Wichtiger Hinweis zu Drittanbieter-Skripten

Einige in diesem Repository enthaltene Skripte stammen von Drittanbietern.

- Diese Skripte werden **nicht als eigene Werke ausgegeben**.
- Es erfolgt **keine inhaltliche Veränderung**.
- Die Spiegelung dient **ausschließlich der technischen Integration** in das Scriptpaket.
- Falls ein Autor eine Entfernung seines Skripts wünscht, wird diesem Wunsch selbstverständlich entsprochen.

---

## Nutzung auf eigene Verantwortung

### Einteilung der Skripte

Die enthaltenen Skripte sind in der Dokumentation in zwei Kategorien unterteilt:

1. **Von InnoGames explizit erlaubte Userscripts**
2. **Nicht explizit erlaubte Userscripts**

> Die Nutzung von **nicht explizit erlaubten Skripten wird ausdrücklich nicht empfohlen**.

Langfristig ist geplant, getrennte Versionen des Scriptpakets bereitzustellen:
- eine Version mit **ausschließlich erlaubten Skripten**
- eine optionale Version, die auch **nicht explizit erlaubte Skripte** enthält

Aktuell existiert **nur eine gemeinsame Version**.

---

## Haftungsausschluss

Die Nutzung aller in diesem Repository enthaltenen Skripte erfolgt **auf eigene Verantwortung**.

- Es wird **keine Garantie** für Regelkonformität, Funktionalität oder Kompatibilität übernommen.
- Änderungen an den Spielregeln oder der Auslegung durch InnoGames können jederzeit erfolgen.
- Auch bei als „erlaubt“ eingestuften Skripten gilt: Nutzung erfolgt ohne Gewähr.

---

## Enthaltene Module

Die folgende Tabelle gibt eine Übersicht über die im Scriptpaket enthaltenen Module.

**Hinweis:**  
Auch bei als „erlaubt“ gekennzeichneten Skripten erfolgt die Nutzung auf eigene Verantwortung.  
Bei „nicht explizit erlaubten“ Skripten wird von der Nutzung ausdrücklich abgeraten.

### Von InnoGames explizit erlaubte Userscripts

| Modul | Beschreibung | Herkunft | Anleitung |
|------|--------------|----------|-----------|
| Inc DC Reminder via Webhook | Benachrichtigung bei Inc/DC über Webhook | Eigenes Skript | [Anleitung](./scripts/own/inc-dc-reminder/README.md) |
| *weitere Module* |  |  |  |

---

### Nicht explizit erlaubte Userscripts

| Modul | Beschreibung | Herkunft | Anleitung |
|------|--------------|----------|-----------|
| Tribal Wars Mass Rekru | Massenrekrutierung über train/mass | Gespiegelt | — |
| *weitere Module* |  |  |  |

---

### Legende

- **Herkunft**
  - *Eigenes Skript*: Im Verzeichnis `/scripts/own`
  - *Gespiegelt*: Unveränderte Spiegelung eines Drittanbieter-Skripts in `/scripts/mirrored`
- **Anleitung**
  - Verlinkt auf eine separate Dokumentation, sofern vorhanden
  - „—“ bedeutet: keine gesonderte Anleitung

---

## Ziel des Projekts

Dieses Projekt versteht sich als **Baukasten**:
- modular
- transparent
- erweiterbar
- ohne Zwang, bestehende Skripte umzuschreiben

Es richtet sich an erfahrene Spieler, die bewusst mit Userscripts umgehen und deren Einsatz selbstständig verantworten.
