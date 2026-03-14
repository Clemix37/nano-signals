import { describe, it } from "node:test";
import assert from "node:assert";
import { Signal } from "../index.js";

describe("Signal", () => {
	describe("constructor", () => {
		it("should create a new signal with no listeners", () => {
			const signal = new Signal();
			assert.strictEqual(signal.listenerCount, 0);
		});
	});

	describe("connect", () => {
		it("should connect a callback", () => {
			const signal = new Signal();
			const callback = () => {};

			signal.connect(callback);

			assert.strictEqual(signal.listenerCount, 1);
		});

		it("should return a disconnect function", () => {
			const signal = new Signal();
			const callback = () => {};

			const disconnect = signal.connect(callback);

			assert.strictEqual(typeof disconnect, "function");
			disconnect();
			assert.strictEqual(signal.listenerCount, 0);
		});

		it("should connect multiple callbacks", () => {
			const signal = new Signal();

			signal.connect(() => {});
			signal.connect(() => {});
			signal.connect(() => {});

			assert.strictEqual(signal.listenerCount, 3);
		});

		it("should preserve context when provided", () => {
			const signal = new Signal();
			const obj = {
				value: 42,
				handler() {
					return this.value;
				},
			};

			let result;
			signal.connect(function () {
				result = obj.handler.call(this);
			}, obj);

			signal.emit();
			assert.strictEqual(result, 42);
		});
	});

	describe("emit", () => {
		it("should call connected callbacks", () => {
			const signal = new Signal();
			let called = false;

			signal.connect(() => {
				called = true;
			});

			signal.emit();

			assert.strictEqual(called, true);
		});

		it("should pass arguments to callbacks", () => {
			const signal = new Signal();
			let receivedArgs = [];

			signal.connect((...args) => {
				receivedArgs = args;
			});

			signal.emit(1, "test", { foo: "bar" });

			assert.deepStrictEqual(receivedArgs, [1, "test", { foo: "bar" }]);
		});

		it("should call all connected callbacks", () => {
			const signal = new Signal();
			const calls = [];

			signal.connect(() => calls.push(1));
			signal.connect(() => calls.push(2));
			signal.connect(() => calls.push(3));

			signal.emit();

			assert.deepStrictEqual(calls, [1, 2, 3]);
		});

		it("should not throw if no callbacks connected", () => {
			const signal = new Signal();

			assert.doesNotThrow(() => {
				signal.emit();
			});
		});
	});

	describe("disconnect", () => {
		it("should disconnect a specific callback", () => {
			const signal = new Signal();
			const callback = () => {};

			signal.connect(callback);
			signal.disconnect(callback);

			assert.strictEqual(signal.listenerCount, 0);
		});

		it("should only disconnect matching callback and context", () => {
			const signal = new Signal();
			const callback = () => {};
			const ctx1 = {};
			const ctx2 = {};

			signal.connect(callback, ctx1);
			signal.connect(callback, ctx2);
			signal.disconnect(callback, ctx1);

			assert.strictEqual(signal.listenerCount, 1);
		});

		it("should not affect other callbacks", () => {
			const signal = new Signal();
			const callback1 = () => {};
			const callback2 = () => {};

			signal.connect(callback1);
			signal.connect(callback2);
			signal.disconnect(callback1);

			assert.strictEqual(signal.listenerCount, 1);
		});
	});

	describe("clear", () => {
		it("should remove all listeners", () => {
			const signal = new Signal();

			signal.connect(() => {});
			signal.connect(() => {});
			signal.connect(() => {});

			signal.clear();

			assert.strictEqual(signal.listenerCount, 0);
		});

		it("should not throw if already empty", () => {
			const signal = new Signal();

			assert.doesNotThrow(() => {
				signal.clear();
			});
		});
	});

	describe("listenerCount", () => {
		it("should return the correct count", () => {
			const signal = new Signal();

			assert.strictEqual(signal.listenerCount, 0);

			signal.connect(() => {});
			assert.strictEqual(signal.listenerCount, 1);

			signal.connect(() => {});
			assert.strictEqual(signal.listenerCount, 2);

			signal.clear();
			assert.strictEqual(signal.listenerCount, 0);
		});
	});

	describe("integration tests", () => {
		it("should work in a game-like scenario", () => {
			class Player {
				constructor() {
					this.health = 100;
					this.onDamaged = new Signal();
					this.onHealed = new Signal();
					this.onDeath = new Signal();
				}

				takeDamage(amount) {
					this.health -= amount;
					this.onDamaged.emit(amount, this.health);

					if (this.health <= 0) {
						this.onDeath.emit();
					}
				}

				heal(amount) {
					this.health += amount;
					this.onHealed.emit(amount, this.health);
				}
			}

			const player = new Player();
			const events = [];

			player.onDamaged.connect((amount, health) => {
				events.push({ type: "damaged", amount, health });
			});

			player.onHealed.connect((amount, health) => {
				events.push({ type: "healed", amount, health });
			});

			player.onDeath.connect(() => {
				events.push({ type: "death" });
			});

			player.takeDamage(30);
			player.heal(10);
			player.takeDamage(90);

			assert.strictEqual(events.length, 4);
			assert.strictEqual(events[0].type, "damaged");
			assert.strictEqual(events[0].amount, 30);
			assert.strictEqual(events[1].type, "healed");
			assert.strictEqual(events[2].type, "damaged");
			assert.strictEqual(events[3].type, "death");
		});

		it("should handle auto-disconnect in component lifecycle", () => {
			const signal = new Signal();
			let callCount = 0;

			const disconnect = signal.connect(() => {
				callCount++;
			});

			signal.emit();
			assert.strictEqual(callCount, 1);

			disconnect();
			signal.emit();
			assert.strictEqual(callCount, 1); // Should not increment
		});
	});
});
