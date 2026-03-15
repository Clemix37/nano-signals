/**
 * Ultra-lightweight signal system inspired by Godot
 */

/**
 * Configuration options for Signal
 */
export interface SignalOptions {
	/**
	 * Enable debug mode with detailed logging
	 * @default false
	 */
	debug?: boolean;

	/**
	 * Catch errors in listeners to prevent one failing listener from stopping others
	 * @default true
	 */
	catchErrors?: boolean;

	/**
	 * Custom error handler function
	 * @param error - The error that was thrown
	 * @param callback - The callback function that threw the error
	 * @param args - The arguments that were passed to the callback
	 */
	errorHandler?: (error: Error, callback: Function, args: any[]) => void;
}

/**
 * Statistics about signal usage (only available in debug mode)
 */
export interface SignalStats {
	/**
	 * Number of currently connected listeners
	 */
	listenerCount: number;

	/**
	 * Total number of times emit() has been called
	 */
	emitCount: number;

	/**
	 * Arguments from the last emit() call
	 */
	lastEmitArgs: any[] | null;

	/**
	 * Timestamp of the last emit() call
	 */
	lastEmitTime: Date | null;

	/**
	 * Whether the signal is currently paused
	 */
	isPaused: boolean;

	/**
	 * Whether error catching is enabled
	 */
	catchErrors: boolean;
}

/**
 * Signal class - Ultra-lightweight event system
 * @template T - Tuple type representing the arguments passed to emit()
 */
export class Signal<T extends any[] = []> {
	/**
	 * Debug mode flag
	 */
	debug: boolean;

	/**
	 * Internal listeners array
	 */
	private listeners: Array<{ callback: (...args: T) => void; context: any }>;

	/**
	 * Whether errors should be caught
	 */
	catchErrors: boolean;

	/**
	 * Error handler function
	 */
	errorHandler: (error: Error, callback: Function, args: any[]) => void;

	/**
	 * Whether the signal is paused
	 */
	paused: boolean;

	/**
	 * Emit count (debug only)
	 */
	private _emitCount?: number;

	/**
	 * Last emit arguments (debug only)
	 */
	private _lastEmitArgs?: any[] | null;

	/**
	 * Last emit timestamp (debug only)
	 */
	private _lastEmitTime?: Date | null;

	/**
	 * Creates a new Signal
	 * @param options - Configuration options
	 */
	constructor(options?: SignalOptions);

	/**
	 * Default error handler implementation
	 * @param error - The error that occurred
	 * @param callback - The callback that threw the error
	 * @param args - Arguments passed to the callback
	 */
	defaultErrorHandler(error: Error, callback: Function, args: any[]): void;

	/**
	 * Connects a callback to this signal
	 * @param callback - Function to call when signal is emitted
	 * @param context - Optional context for 'this' binding
	 * @returns A function that disconnects this callback when called
	 * @throws {TypeError} If callback is not a function
	 */
	connect(callback: (...args: T) => void, context?: any): () => void;

	/**
	 * Connects a callback that will only be called once
	 * @param callback - Function to call when signal is emitted (will auto-disconnect after first call)
	 * @param context - Optional context for 'this' binding
	 * @returns A function that disconnects this callback when called
	 * @throws {TypeError} If callback is not a function
	 */
	once(callback: (...args: T) => void, context?: any): () => void;

	/**
	 * Disconnects a specific callback from this signal
	 * @param callback - The callback to disconnect
	 * @param context - Optional context used when connecting
	 */
	disconnect(callback: (...args: T) => void, context?: any): void;

	/**
	 * Emits the signal, calling all connected callbacks
	 * Does nothing if the signal is paused
	 * @param args - Arguments to pass to all callbacks
	 */
	emit(...args: T): void;

	/**
	 * Removes all connected listeners
	 */
	clear(): void;

	/**
	 * Pauses the signal - emit() calls will be ignored until resume() is called
	 */
	pause(): void;

	/**
	 * Resumes the signal after being paused
	 */
	resume(): void;

	/**
	 * Enables or disables debug mode
	 * @param enabled - Whether debug mode should be enabled
	 */
	setDebug(enabled: boolean): void;

	/**
	 * Gets statistics about the signal (only available in debug mode)
	 * @returns Statistics object or null if debug mode is disabled
	 */
	getStats(): SignalStats | null;

	/**
	 * Prints statistics to the console using console.table()
	 */
	printStats(): void;

	/**
	 * Returns the number of connected listeners
	 */
	readonly listenerCount: number;

	/**
	 * Returns whether the signal is currently paused
	 */
	readonly isPaused: boolean;
}

export default Signal;
