# 🔔 NanoSignals

An ultra-lightweight signal system inspired by Godot for JavaScript. Zero dependencies, modular and simple.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Size](https://img.shields.io/badge/size-<1kb-green.svg)](https://github.com/your-username/nanosignals)

## ✨ Why NanoSignals?

- 🪶 **Ultra-lightweight**: Less than 1 KB minified
- 🎯 **Simple**: Intuitive 3-method API
- 🔌 **Modular**: No dependencies, ES6 modules
- 🎮 **Godot-inspired**: If you know Godot, you already know how to use it
- 🚀 **Zero config**: Works everywhere (Node, Browser, Deno, Bun)

## 📦 Installation

```bash
npm install nanosignals
```

Or with a CDN:

```javascript
import { Signal } from "https://esm.sh/nanosignals";
```

## 🚀 Quick Start

```javascript
import { Signal } from "nanosignals";

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

### `new Signal()`

Creates a new signal.

```javascript
const signal = new Signal();
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

### `signal.emit(...args)`

Emits the signal with optional arguments.

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

### `signal.listenerCount`

Returns the number of connected listeners.

```javascript
console.log(signal.listenerCount); // 3
```

## 🎯 Use Cases

### Observer Pattern without Coupling

```javascript
// events.js
import { Signal } from "nanosignals";

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

## 🆚 Comparison

| Feature         | NanoSignals | EventEmitter (Node) | Custom Events (DOM) |
| --------------- | ----------- | ------------------- | ------------------- |
| Size            | < 1 KB      | ~10 KB              | Built-in            |
| Dependencies    | 0           | 0                   | 0                   |
| Simple API      | ✅          | ❌                  | ❌                  |
| Auto-disconnect | ✅          | ❌                  | ❌                  |
| Context (this)  | ✅          | ❌                  | ❌                  |
| Browser/Node    | ✅          | Node only           | Browser only        |

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or pull request.

## 📄 License

MIT © CyberWebDev

---

**Inspired by Godot Engine's signal system** 🎮
