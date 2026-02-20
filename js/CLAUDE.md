# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

There is no build step. This is a vanilla JavaScript project with no NPM dependencies. Open `index.html` directly in a browser or serve it with any static file server (e.g., `python -m http.server` from the `js/` directory).

The game requires a running local server for asset loading — opening `index.html` as a `file://` URL will likely fail due to CORS restrictions on script/asset loading.

## Architecture Overview

**Radiance Rising** is a web-based 3D puzzle/action game built on **Babylon.js v8** (loaded from CDN). The entire codebase is vanilla JavaScript — no bundler, no transpiler.

### Initialization Flow

```
index.html
  → Loads Babylon.js from CDN
  → Loads ScriptInitializer (launch/launchsequence/scriptInitializer.js)
      → Verifies Babylon.js, creates WebGL engine with stencil support
      → Loads ScriptManifest (utilities/assetmanifests/scriptManifest.js)
          → Dynamically injects all game scripts via <script> tags (sequential, async=false)
      → Instantiates RadiantEngineManager (launch/launchsequence/radiantEngineManager.js)
          → Wires up all major systems and starts the render loop
```

### Central Registry

`FundamentalSystemBridge` (`launch/launchsequence/fundamentalSystemBridge.js`) is the global singleton that holds references to all major systems: Babylon engine, scene manager, gameplay manager, camera managers, sound systems, level loaders, and UI scenes. All inter-system communication routes through this bridge.

### Script Loading Order

`ScriptManifest` controls load order across 20+ categories. The order matters because classes depend on each other via inheritance — scripts load synchronously to ensure proper prototype chains. When adding new scripts, register them in the correct category in `scriptManifest.js`. Categories run roughly: utilities → assets → systems → gameplay → UI → dev tools.

### Configuration

All global constants live in `launch/launchsequence/config.js` (~126 constants). Key flags:
- `DEVELOPMENT` — enables dev features
- `DEMO_LEVEL` — which level loads by default (`"testLevel0"`)
- Systems can be disabled via skip flags (networking, achievements, items, etc.)
- Debug flags per system: `LEVEL_LOADER_DEBUG`, `MUSIC_DEBUG`, `UI_DEBUG`, etc.

### Major System Directories

| Directory | Purpose |
|-----------|---------|
| `gameplay/` | Player, movement, levels, abilities, triggers, interactions, replay |
| `ui/` | Babylon.js GUI scenes, HUD elements, responsive layout |
| `utilities/` | Asset loaders, sound managers, miscellaneous helpers |
| `animations/` | Programmatic animation system with interpolation |
| `launch/` | Initialization, diagnostics, crash handling |
| `testtools/` | Development testing utilities |

### Key Architectural Patterns

- **Manager/Composite pattern**: Major systems are managers (`CameraManager`, `SoundManager`, `LevelLoaderManager`, `GameplayManagerComposite`)
- **Factory pattern**: Level content created via `LevelFactoryComposite`, `triggerFactory`, `specialOccurrenceFactory`
- **Event-driven**: `MicroEventManager` and `LevelEventSignal` for decoupled game events
- **Data structures**: Complex state objects in dedicated `datastructures/` subdirectories (e.g., `PlayerGameState`, obstacle/trigger definitions)

### Level System

Levels are JSON-defined. Level data specifies obstacles, keys, collectibles, triggers, and victory conditions. `LevelLoaderManager` loads levels; `LevelFactoryComposite` instantiates their content. `LevelAuditor` provides pathfinding analysis. The currently active demo has 9 levels.

### UI

All UI is built with Babylon.js GUI. Scenes extend `BaseGameUIScene`. The HUD includes mana bar, artifact bar, heart bar, FPS counter, and perfection tracker. `WorldLoaderScene` handles the world/level loading transitions.

### Audio

Sound runs through `MusicManager` (songs with mobile unlock support) and a sound effects manager. 3D positional audio attaches to the camera listener. Mobile audio unlock triggers on first user interaction.

### Logging & Diagnostics

`LoggerOmega` provides cooldown-gated logging to avoid spam. `BenchmarkManager` tracks performance. `InitializationDiagnosticsLogger` captures startup sequence timing. Errors route to `catastropheReport.html`.
