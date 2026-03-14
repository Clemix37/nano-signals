// A simple game example showing signal usage
import { Signal } from "../index.js";

class Player {
	constructor(name) {
		this.name = name;
		this.health = 100;
		this.score = 0;

		// Signals
		this.onDamaged = new Signal();
		this.onHealed = new Signal();
		this.onDeath = new Signal();
		this.onScoreChanged = new Signal();
	}

	takeDamage(amount) {
		this.health = Math.max(0, this.health - amount);
		this.onDamaged.emit(amount, this.health);

		if (this.health === 0) {
			this.onDeath.emit();
		}
	}

	heal(amount) {
		const oldHealth = this.health;
		this.health = Math.min(100, this.health + amount);
		const actualHealed = this.health - oldHealth;

		if (actualHealed > 0) {
			this.onHealed.emit(actualHealed, this.health);
		}
	}

	addScore(points) {
		this.score += points;
		this.onScoreChanged.emit(this.score);
	}
}

class UI {
	constructor(player) {
		this.player = player;

		// Connect to player signals
		player.onDamaged.connect(this.showDamage, this);
		player.onHealed.connect(this.showHealing, this);
		player.onDeath.connect(this.showGameOver, this);
		player.onScoreChanged.connect(this.updateScore, this);
	}

	showDamage(amount, health) {
		console.log(`💥 ${this.player.name} took ${amount} damage! Health: ${health}/100`);
	}

	showHealing(amount, health) {
		console.log(`💚 ${this.player.name} healed ${amount} HP! Health: ${health}/100`);
	}

	showGameOver() {
		console.log(`☠️  ${this.player.name} has died! Final score: ${this.player.score}`);
	}

	updateScore(score) {
		console.log(`⭐ Score: ${score}`);
	}
}

class AudioManager {
	constructor(player) {
		player.onDamaged.connect(this.playDamageSound, this);
		player.onHealed.connect(this.playHealSound, this);
		player.onDeath.connect(this.playDeathSound, this);
	}

	playDamageSound(amount) {
		console.log(`🔊 Playing damage sound (intensity: ${amount})`);
	}

	playHealSound() {
		console.log(`🔊 Playing heal sound`);
	}

	playDeathSound() {
		console.log(`🔊 Playing death sound`);
	}
}

class GameStats {
	constructor(player) {
		this.totalDamageTaken = 0;
		this.totalHealing = 0;

		player.onDamaged.connect((amount) => {
			this.totalDamageTaken += amount;
		});

		player.onHealed.connect((amount) => {
			this.totalHealing += amount;
		});

		player.onDeath.connect(() => {
			this.printStats();
		});
	}

	printStats() {
		console.log("\n📊 Game Statistics:");
		console.log(`   Total damage taken: ${this.totalDamageTaken}`);
		console.log(`   Total healing: ${this.totalHealing}`);
	}
}

// Run the game
console.log("🎮 Starting game...\n");

const player = new Player("Hero");
const ui = new UI(player);
const audio = new AudioManager(player);
const stats = new GameStats(player);

console.log("--- Combat begins ---\n");

player.addScore(100);
player.takeDamage(25);
player.takeDamage(30);
player.heal(20);
player.addScore(50);
player.takeDamage(40);
player.heal(15);
player.addScore(75);
player.takeDamage(60);

console.log("\n--- Game Over ---");
