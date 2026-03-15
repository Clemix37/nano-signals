export class Signal {
	//#region Properties

	debug;
	listeners;
	catchErrors;
	errorHandler;
	paused;

	// Statistiques pour le debug
	_emitCount;
	_lastEmitArgs;
	_lastEmitTime;

	//#endregion

	//#region Constructor

	constructor(options = { debug: false, catchErrors: true }) {
		this.debug = options.debug ?? false;
		this.listeners = [];
		this.catchErrors = options.catchErrors ?? true;
		this.errorHandler = options.errorHandler || this.defaultErrorHandler;
		this.paused = false;

		// Initialiser les stats si debug activé
		if (this.debug) {
			this._emitCount = 0;
			this._lastEmitArgs = null;
			this._lastEmitTime = null;
		}
	}

	//#endregion

	//#region Error Handler

	defaultErrorHandler(error, callback, args) {
		console.error("[NanoSignals] Error in listener:", error);
		console.error("Callback:", callback);
		console.error("Arguments:", args);
	}

	//#endregion

	//#region Connection Management

	connect(callback, context = null) {
		if (typeof callback !== "function") {
			throw new TypeError("Callback must be a function");
		}

		this.listeners.push({ callback, context });

		if (this.debug) {
			console.log(`[NanoSignals Debug] Listener connected. Total listeners: ${this.listeners.length}`);
			console.log("Callback:", callback.name || "anonymous");
			if (context) console.log("Context:", context);
		}

		// Returns a function to disconnect easily
		return () => this.disconnect(callback, context);
	}

	once(callback, context = null) {
		if (typeof callback !== "function") {
			throw new TypeError("Callback must be a function");
		}

		const wrapper = (...args) => {
			this.disconnect(wrapper);
			callback.apply(context || this, args);
		};

		if (this.debug) {
			console.log(
				`[NanoSignals Debug] One-time listener connected. Total listeners: ${this.listeners.length + 1}`,
			);
		}

		return this.connect(wrapper, context);
	}

	disconnect(callback, context = null) {
		const index = this.listeners.findIndex(
			(listener) => listener.callback === callback && listener.context === context,
		);

		if (index !== -1) {
			this.listeners.splice(index, 1);

			if (this.debug) {
				console.log(`[NanoSignals Debug] Listener disconnected. Remaining listeners: ${this.listeners.length}`);
			}
		} else if (this.debug) {
			console.warn("[NanoSignals Debug] Attempted to disconnect non-existent listener");
		}
	}

	//#endregion

	//#region Emit

	emit(...args) {
		// Si en pause, ne rien faire
		if (this.paused) {
			if (this.debug) {
				console.log("[NanoSignals Debug] Signal is paused. Emit ignored.");
				console.log("Arguments:", args);
			}
			return;
		}

		// Debug: log avant l'émission
		if (this.debug) {
			this._emitCount++;
			this._lastEmitArgs = args;
			this._lastEmitTime = new Date();

			console.log(`[NanoSignals Debug] Emitting signal (#${this._emitCount})`);
			console.log("Arguments:", args);
			console.log("Listeners to notify:", this.listeners.length);
		}

		// Avoids problems if disconnect() is called during emit()
		const listeners = [...this.listeners];

		// Catching errors
		if (this.catchErrors) {
			listeners.forEach(({ callback, context }, index) => {
				try {
					if (this.debug) {
						console.log(`[NanoSignals Debug] Calling listener ${index + 1}/${listeners.length}`);
					}

					context ? callback.apply(context, args) : callback(...args);
				} catch (error) {
					this.errorHandler(error, callback, args);
				}
			});
		} else {
			// Without catching errors
			listeners.forEach(({ callback, context }, index) => {
				if (this.debug) {
					console.log(`[NanoSignals Debug] Calling listener ${index + 1}/${listeners.length}`);
				}

				context ? callback.apply(context, args) : callback(...args);
			});
		}

		if (this.debug) {
			console.log(`[NanoSignals Debug] Signal emission completed`);
		}
	}

	//#endregion

	//#region Clear

	clear() {
		const previousCount = this.listeners.length;
		this.listeners = [];

		if (this.debug) {
			console.log(`[NanoSignals Debug] All listeners cleared (${previousCount} removed)`);
		}
	}

	//#endregion

	//#region Pause / Resume

	pause() {
		this.paused = true;

		if (this.debug) {
			console.log("[NanoSignals Debug] Signal paused. Emissions will be ignored.");
		}
	}

	resume() {
		this.paused = false;

		if (this.debug) {
			console.log("[NanoSignals Debug] Signal resumed. Emissions will be processed.");
		}
	}

	//#endregion

	//#region Debug Utilities

	/**
	 * Active ou désactive le mode debug
	 */
	setDebug(enabled) {
		this.debug = enabled;

		if (enabled && !this._emitCount) {
			this._emitCount = 0;
			this._lastEmitArgs = null;
			this._lastEmitTime = null;
		}

		console.log(`[NanoSignals] Debug mode ${enabled ? "enabled" : "disabled"}`);
	}

	/**
	 * Affiche les statistiques du signal (uniquement en mode debug)
	 */
	getStats() {
		if (!this.debug) {
			console.warn("[NanoSignals] Stats are only available in debug mode");
			return null;
		}

		return {
			listenerCount: this.listeners.length,
			emitCount: this._emitCount,
			lastEmitArgs: this._lastEmitArgs,
			lastEmitTime: this._lastEmitTime,
			isPaused: this.paused,
			catchErrors: this.catchErrors,
		};
	}

	/**
	 * Affiche les stats dans la console
	 */
	printStats() {
		const stats = this.getStats();
		if (stats) {
			console.table(stats);
		}
	}

	//#endregion

	//#region Getters

	get listenerCount() {
		return this.listeners.length;
	}

	get isPaused() {
		return this.paused;
	}

	//#endregion
}

export default Signal;
