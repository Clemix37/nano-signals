// Global event bus pattern - decoupled communication
import { Signal } from "../index.js";

// events.js - Central event definitions
export const Events = {
	userLoggedIn: new Signal(),
	userLoggedOut: new Signal(),
	themeChanged: new Signal(),
	notificationReceived: new Signal(),
};

// auth.js - Authentication module
class AuthService {
	constructor() {
		this.currentUser = null;
	}

	login(username, email) {
		this.currentUser = { username, email };
		console.log(`✅ User logged in: ${username}`);
		Events.userLoggedIn.emit(this.currentUser);
	}

	logout() {
		const username = this.currentUser?.username;
		this.currentUser = null;
		console.log(`👋 User logged out: ${username}`);
		Events.userLoggedOut.emit();
	}
}

// ui.js - UI module
class UIManager {
	constructor() {
		this.theme = "light";

		// Listen to events
		Events.userLoggedIn.connect(this.onUserLogin, this);
		Events.userLoggedOut.connect(this.onUserLogout, this);
		Events.themeChanged.connect(this.onThemeChanged, this);
		Events.notificationReceived.connect(this.showNotification, this);
	}

	onUserLogin(user) {
		console.log(`🎨 UI: Displaying welcome for ${user.username}`);
		console.log(`🎨 UI: Showing user dashboard`);
	}

	onUserLogout() {
		console.log(`🎨 UI: Hiding user dashboard`);
		console.log(`🎨 UI: Showing login screen`);
	}

	onThemeChanged(newTheme) {
		this.theme = newTheme;
		console.log(`🎨 UI: Theme changed to ${newTheme}`);
	}

	showNotification(message, type) {
		const emoji = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
		console.log(`${emoji} Notification: ${message}`);
	}

	changeTheme(theme) {
		Events.themeChanged.emit(theme);
	}
}

// analytics.js - Analytics module
class AnalyticsService {
	constructor() {
		Events.userLoggedIn.connect(this.trackLogin, this);
		Events.userLoggedOut.connect(this.trackLogout, this);
		Events.themeChanged.connect(this.trackThemeChange, this);
	}

	trackLogin(user) {
		console.log(`📊 Analytics: Login event tracked for ${user.username}`);
	}

	trackLogout() {
		console.log(`📊 Analytics: Logout event tracked`);
	}

	trackThemeChange(theme) {
		console.log(`📊 Analytics: Theme change tracked (${theme})`);
	}
}

// notification.js - Notification service
class NotificationService {
	constructor() {
		Events.userLoggedIn.connect((user) => {
			Events.notificationReceived.emit(`Welcome back, ${user.username}!`, "success");
		});

		Events.userLoggedOut.connect(() => {
			Events.notificationReceived.emit("You have been logged out", "info");
		});
	}
}

// storage.js - Local storage sync
class StorageService {
	constructor() {
		Events.userLoggedIn.connect(this.saveUser, this);
		Events.userLoggedOut.connect(this.clearUser, this);
		Events.themeChanged.connect(this.saveTheme, this);
	}

	saveUser(user) {
		console.log(`💾 Storage: Saving user data for ${user.username}`);
	}

	clearUser() {
		console.log(`💾 Storage: Clearing user data`);
	}

	saveTheme(theme) {
		console.log(`💾 Storage: Saving theme preference (${theme})`);
	}
}

// Run the application
console.log("🚀 Application starting...\n");

const auth = new AuthService();
const ui = new UIManager();
const analytics = new AnalyticsService();
const notifications = new NotificationService();
const storage = new StorageService();

console.log("--- User logs in ---\n");
auth.login("alice", "alice@example.com");

console.log("\n--- User changes theme ---\n");
ui.changeTheme("dark");

console.log("\n--- User logs out ---\n");
auth.logout();

console.log("\n--- Another user logs in ---\n");
auth.login("bob", "bob@example.com");

console.log("\n✅ Application running");
console.log(`📡 Total active signals: ${Object.keys(Events).length}`);
