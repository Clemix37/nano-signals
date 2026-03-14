// Simple examples demonstrating core features
import { Signal } from "../index.js";

console.log("🔔 NanoSignals - Basic Examples\n");

// Example 1: Simple signal
console.log("--- Example 1: Simple Signal ---");
const buttonClicked = new Signal();

buttonClicked.connect(() => {
	console.log("Button was clicked!");
});

buttonClicked.emit();
console.log("");

// Example 2: Signal with arguments
console.log("--- Example 2: Signal with Arguments ---");
const messageReceived = new Signal();

messageReceived.connect((sender, message) => {
	console.log(`Message from ${sender}: ${message}`);
});

messageReceived.emit("Alice", "Hello World!");
messageReceived.emit("Bob", "How are you?");
console.log("");

// Example 3: Multiple listeners
console.log("--- Example 3: Multiple Listeners ---");
const temperatureChanged = new Signal();

temperatureChanged.connect((temp) => {
	console.log(`Display: ${temp}°C`);
});

temperatureChanged.connect((temp) => {
	if (temp > 30) {
		console.log(`Warning: Temperature too high!`);
	}
});

temperatureChanged.connect((temp) => {
	console.log(`Log: Temperature recorded at ${new Date().toLocaleTimeString()}`);
});

temperatureChanged.emit(25);
console.log("");
temperatureChanged.emit(35);
console.log("");

// Example 4: Auto-disconnect
console.log("--- Example 4: Auto-Disconnect ---");
const counter = new Signal();
let count = 0;

const disconnect = counter.connect(() => {
	count++;
	console.log(`Count: ${count}`);
});

counter.emit();
counter.emit();
console.log("Disconnecting...");
disconnect();
counter.emit(); // This won't trigger the callback
console.log(`Final count: ${count} (should be 2)`);
console.log("");

// Example 5: Context preservation
console.log("--- Example 5: Context Preservation ---");
class Counter {
	constructor() {
		this.value = 0;
		this.onIncrement = new Signal();
	}

	increment() {
		this.value++;
		this.onIncrement.emit(this.value);
	}

	displayValue() {
		console.log(`Counter value: ${this.value}`);
	}
}

const myCounter = new Counter();
myCounter.onIncrement.connect(myCounter.displayValue, myCounter);

myCounter.increment();
myCounter.increment();
myCounter.increment();
console.log("");

// Example 6: Clear all listeners
console.log("--- Example 6: Clear All Listeners ---");
const dataUpdated = new Signal();

dataUpdated.connect(() => console.log("Listener 1"));
dataUpdated.connect(() => console.log("Listener 2"));
dataUpdated.connect(() => console.log("Listener 3"));

console.log(`Listeners before clear: ${dataUpdated.listenerCount}`);
dataUpdated.emit();

dataUpdated.clear();
console.log(`Listeners after clear: ${dataUpdated.listenerCount}`);
dataUpdated.emit(); // Nothing happens
console.log("");

// Example 7: Practical use case - Form validation
console.log("--- Example 7: Form Validation ---");
class FormField {
	constructor(name) {
		this.name = name;
		this.value = "";
		this.onChange = new Signal();
		this.onValidate = new Signal();
	}

	setValue(value) {
		this.value = value;
		this.onChange.emit(this.name, value);

		const isValid = value.length >= 3;
		this.onValidate.emit(this.name, isValid);
	}
}

const emailField = new FormField("email");

emailField.onChange.connect((fieldName, value) => {
	console.log(`Field '${fieldName}' changed to: ${value}`);
});

emailField.onValidate.connect((fieldName, isValid) => {
	const status = isValid ? "✅ Valid" : "❌ Invalid";
	console.log(`Field '${fieldName}': ${status}`);
});

emailField.setValue("ab");
console.log("");
emailField.setValue("alice@example.com");
console.log("");

console.log("✅ All examples completed!");
