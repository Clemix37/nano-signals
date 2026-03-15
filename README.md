# 🔔 NanoSignals

An ultra-lightweight signal system inspired by Godot for JavaScript. Zero dependencies, modular and simple.

[![npm version](https://badge.fury.io/js/@cyberwebdev%2Fnanosignals.svg)](https://www.npmjs.com/package/@cyberwebdev/nanosignals)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Size](https://img.shields.io/badge/size-<4kb-green.svg)](https://github.com/Clemix37/nanosignals)

## ✨ Why NanoSignals?

- 🪶 **Ultra-lightweight**: Less than 2 KB minified
- 🎯 **Simple**: Intuitive API with just a few methods
- 🔌 **Modular**: Zero dependencies, ES6 modules
- 🎮 **Godot-inspired**: If you know Godot, you already know how to use it
- 🚀 **Zero config**: Works everywhere (Node, Browser, Deno, Bun)
- 🛡️ **Type-safe**: Full TypeScript support with generics
- 🔍 **Debug mode**: Built-in debugging tools for development
- ⏸️ **Pausable**: Pause and resume signal emissions
- 🎯 **Error handling**: Prevents one failing listener from breaking others

## 📦 Installation

```bash
npm install @cyberwebdev/nanosignals
```

Or with a CDN:

```javascript
import { Signal } from "https://esm.sh/@cyberwebdev/nanosignals";
```

## 🚀 Quick Start

```javascript
import { Signal } from "@cyberwebdev/nanosignals";

class Player {
	constructor() {
		this.health = 100;
		this.onDamaged = new Signal();
		this.onDeath = new Signal();
	}

	takeDamage(amount) {
		this.health -= amount;
		this.onDamaged.emit(amount, this.health);

		if (this.health <= 0) {
			this.onDeath.emit();
		}
	}
}

// Connect to signals
const player = new Player();

player.onDamaged.connect((amount, health) => {
	console.log(`-${amount} HP | Health: ${health}`);
});

player.onDeath.connect(() => {
	console.log("Game Over!");
});

player.takeDamage(30); // -30 HP | Health: 70
player.takeDamage(80); // -80 HP | Health: -10
// Game Over!
```

## 📚 API

### `new Signal(options?)`

Creates a new signal with optional configuration.

```javascript
// Default configuration
const signal = new Signal();

// With options
const signal = new Signal({
	debug: false, // Enable debug logging
	catchErrors: true, // Catch errors in listeners
	errorHandler: (error, callback, args) => {
		// Custom error handler
		console.error("Custom handler:", error);
	},
});
```

### `signal.connect(callback, context?)`

Connects a function to the signal. Returns a disconnect function.

```javascript
// Simple callback
const disconnect = signal.connect(() => console.log("Signal received!"));

// With context (to preserve 'this')
signal.connect(this.handleSignal, this);

// Auto-disconnect
const disconnect = signal.connect(callback);
disconnect(); // Disconnects the callback
```

### `signal.once(callback, context?)`

Connects a callback that will only be called once, then automatically disconnected.

```javascript
signal.once(() => {
	console.log("This will only run once");
});

signal.emit(); // "This will only run once"
signal.emit(); // (nothing happens)
```

### `signal.emit(...args)`

Emits the signal with optional arguments. Does nothing if the signal is paused.

```javascript
signal.emit();
signal.emit(42);
signal.emit("data", { x: 10, y: 20 });
```

### `signal.disconnect(callback, context?)`

Disconnects a specific callback.

```javascript
signal.disconnect(myCallback);
signal.disconnect(this.handleSignal, this);
```

### `signal.clear()`

Disconnects all listeners.

```javascript
signal.clear();
```

### `signal.pause()` / `signal.resume()`

Pause and resume signal emissions.

```javascript
signal.pause();
signal.emit("ignored"); // Will not call any listeners

signal.resume();
signal.emit("processed"); // Will call all listeners
```

### `signal.setDebug(enabled)`

Enable or disable debug mode dynamically.

```javascript
signal.setDebug(true); // Enable debug logging
signal.setDebug(false); // Disable debug logging
```

### `signal.getStats()` / `signal.printStats()`

Get or print signal statistics (only available in debug mode).

```javascript
const stats = signal.getStats();
// {
//   listenerCount: 3,
//   emitCount: 10,
//   lastEmitArgs: ['hello', 42],
//   lastEmitTime: Date,
//   isPaused: false,
//   catchErrors: true
// }

signal.printStats(); // Prints stats to console as a table
```

### Properties

```javascript
signal.listenerCount; // Number of connected listeners
signal.isPaused; // Whether the signal is paused
```

## 📘 TypeScript Support

NanoSignals includes full TypeScript type definitions with generics!

### Typed Signals

```typescript
import { Signal } from "@cyberwebdev/nanosignals";

// Signal with specific argument types
const onScoreChanged = new Signal<[score: number]>();

onScoreChanged.connect((score) => {
	// TypeScript knows 'score' is a number
	console.log(score.toFixed(2));
});

onScoreChanged.emit(42); // ✅ OK
onScoreChanged.emit("42"); // ❌ TypeScript error
```

### Generic Signals

```typescript
// Signal with multiple typed arguments
const onDamaged = new Signal<[amount: number, health: number]>();

// Signal with no arguments
const onReady = new Signal<[]>();

// Signal with complex types
interface User {
	id: number;
	name: string;
}
const onUserLogin = new Signal<[user: User]>();
```

### With Options

```typescript
import { Signal, SignalOptions } from "@cyberwebdev/nanosignals";

const options: SignalOptions = {
	debug: true,
	catchErrors: true,
	errorHandler: (error, callback, args) => {
		console.error("Error:", error);
	},
};

const signal = new Signal<[string, number]>(options);
```

## 🎯 Use Cases

### Observer Pattern without Coupling

```javascript
// events.js
import { Signal } from "@cyberwebdev/nanosignals";

export const userLoggedIn = new Signal();
export const userLoggedOut = new Signal();
```

```javascript
// auth.js
import { userLoggedIn, userLoggedOut } from "./events.js";

function login(username) {
	// ... login logic
	userLoggedIn.emit(username);
}

function logout() {
	// ... logout logic
	userLoggedOut.emit();
}
```

```javascript
// ui.js
import { userLoggedIn, userLoggedOut } from "./events.js";

userLoggedIn.connect((username) => {
	document.querySelector(".welcome").textContent = `Hello ${username}`;
});

userLoggedOut.connect(() => {
	document.querySelector(".welcome").textContent = "";
});
```

### Component Communication

```javascript
class Game {
	constructor() {
		this.onScoreChanged = new Signal();
		this.score = 0;
	}

	addPoints(points) {
		this.score += points;
		this.onScoreChanged.emit(this.score);
	}
}

class ScoreDisplay {
	constructor(game) {
		game.onScoreChanged.connect(this.update, this);
	}

	update(score) {
		this.element.textContent = `Score: ${score}`;
	}
}
```

### Automatic Cleanup

```javascript
class Component {
	constructor(emitter) {
		this.disconnectors = [];

		// Store disconnect functions
		this.disconnectors.push(
			emitter.onUpdate.connect(this.handleUpdate, this),
			emitter.onDestroy.connect(this.handleDestroy, this),
		);
	}

	destroy() {
		// Automatically disconnect everything
		this.disconnectors.forEach((disconnect) => disconnect());
	}
}
```

### Game Loop with Pause

```javascript
class Game {
	constructor() {
		this.onUpdate = new Signal();
		this.isPaused = false;
	}

	pause() {
		this.isPaused = true;
		this.onUpdate.pause();
	}

	resume() {
		this.isPaused = false;
		this.onUpdate.resume();
	}

	update(deltaTime) {
		// Will only emit if not paused
		this.onUpdate.emit(deltaTime);
	}
}

const game = new Game();

game.onUpdate.connect((dt) => {
	console.log("Game updating:", dt);
});

game.update(0.016); // "Game updating: 0.016"
game.pause();
game.update(0.016); // (nothing happens)
game.resume();
game.update(0.016); // "Game updating: 0.016"
```

### Debug Mode for Development

```javascript
// Development
const signal = new Signal({ debug: true });

signal.connect(() => console.log("Listener 1"));
signal.connect(() => console.log("Listener 2"));

signal.emit("test");
// [NanoSignals Debug] Emitting signal (#1)
// Arguments: ['test']
// Listeners to notify: 2
// [NanoSignals Debug] Calling listener 1/2
// Listener 1
// [NanoSignals Debug] Calling listener 2/2
// Listener 2
// [NanoSignals Debug] Signal emission completed

signal.printStats();
// ┌─────────────────┬────────┐
// │ listenerCount   │ 2      │
// │ emitCount       │ 1      │
// │ isPaused        │ false  │
// └─────────────────┴────────┘
```

## 🆚 Comparison

| Feature           | NanoSignals | EventEmitter (Node) | Custom Events (DOM) |
| ----------------- | ----------- | ------------------- | ------------------- |
| Size              | < 4 KB      | ~10 KB              | Built-in            |
| Dependencies      | 0           | 0                   | 0                   |
| Simple API        | ✅          | ❌                  | ❌                  |
| Auto-disconnect   | ✅          | ❌                  | ❌                  |
| Context (this)    | ✅          | ❌                  | ❌                  |
| TypeScript        | ✅          | ✅                  | ❌                  |
| Error Handling    | ✅          | ❌                  | ❌                  |
| Pause/Resume      | ✅          | ❌                  | ❌                  |
| Debug Mode        | ✅          | ❌                  | ❌                  |
| Once Method       | ✅          | ✅                  | ✅                  |
| Browser/Node/Deno | ✅          | Node only           | Browser only        |

## 🔧 Advanced Features

### Error Handling

By default, NanoSignals catches errors in listeners to prevent one failing listener from breaking others:

```javascript
const signal = new Signal({ catchErrors: true });

signal.connect(() => {
	console.log("Listener 1");
});

signal.connect(() => {
	throw new Error("Oops!");
});

signal.connect(() => {
	console.log("Listener 3 still runs!");
});

signal.emit();
// Listener 1
// [NanoSignals] Error in listener: Error: Oops!
// Listener 3 still runs!
```

### Custom Error Handler

```javascript
const signal = new Signal({
	catchErrors: true,
	errorHandler: (error, callback, args) => {
		// Send to your error tracking service
		sendToSentry(error);
		console.log("Error handled:", error.message);
	},
});
```

### Performance Mode

Disable error catching for maximum performance in production:

```javascript
const signal = new Signal({ catchErrors: false });
// Slightly faster, but errors will stop execution
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request on [GitHub](https://github.com/Clemix37/nanosignals).

## 📄 License

MIT © CyberWebDev

---

**Inspired by Godot Engine's signal system** 🎮
