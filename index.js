// NanoSignals
export class Signal {
	constructor() {
		this.listeners = [];
	}

	connect(callback, context = null) {
		this.listeners.push({ callback, context });

		// Returns a function to disconnect easily
		return () => this.disconnect(callback, context);
	}

	disconnect(callback, context = null) {
		this.listeners = this.listeners.filter(
			(listener) => listener.callback !== callback || listener.context !== context,
		);
	}

	emit(...args) {
		this.listeners.forEach(({ callback, context }) => {
			if (context) {
				callback.apply(context, args);
			} else {
				callback(...args);
			}
		});
	}

	clear() {
		this.listeners = [];
	}

	get listenerCount() {
		return this.listeners.length;
	}
}

export default Signal;
