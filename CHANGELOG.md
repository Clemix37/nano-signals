# Changelog

All notable changes to NanoSignals will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.0 - 2025-01-XX

### Added

- 🔍 **Debug Mode**: New debug option with detailed logging
    - `new Signal({ debug: true })` enables comprehensive logging
    - `setDebug(enabled)` to toggle debug mode dynamically
    - `getStats()` returns signal statistics (emit count, last args, etc.)
    - `printStats()` prints statistics to console as a table
- ⏸️ **Pause/Resume**: Control signal emissions
    - `pause()` method to temporarily stop emitting signals
    - `resume()` method to resume signal emissions
    - `isPaused` getter to check pause state
    - Emissions are silently ignored when paused
- 🎯 **Once Method**: One-time listeners
    - `once(callback, context)` for callbacks that auto-disconnect after first call
- 🛡️ **Enhanced Error Handling**
    - Configurable error catching with `catchErrors` option (default: `true`)
    - Custom error handlers via `errorHandler` option
    - Prevents one failing listener from breaking others
- 📘 **TypeScript Improvements**
    - `SignalOptions` interface for constructor options
    - `SignalStats` interface for statistics object
    - Full JSDoc documentation for all methods
    - Better type inference for generic signals
- 🔧 **Internal Optimizations**
    - `disconnect()` now uses `findIndex` for better performance
    - `emit()` creates array copy to prevent issues during disconnection
    - Input validation: throws `TypeError` if callback is not a function

### Changed

- 📦 **Package size**: Now ~1.5 KB minified (was ~1 KB)
    - Size increase due to new features, still very lightweight
- 📚 **Documentation**: Completely rewritten README with:
    - TypeScript usage examples
    - Advanced features section
    - Comparison table with other libraries
    - Debug mode examples
    - Pause/Resume examples

### Fixed

- Fixed potential issue where disconnecting during emit could cause problems
- Improved context binding in `once()` method

## 1.0.0 - 2025-01-XX

### Added

- 🎉 **Initial Release**
- ✨ Core signal system
    - `connect(callback, context)` - Connect listeners
    - `disconnect(callback, context)` - Disconnect listeners
    - `emit(...args)` - Emit signals with arguments
    - `clear()` - Remove all listeners
    - `listenerCount` - Get number of listeners
- 🔌 **Context Support**: Preserve `this` binding
- 🎯 **Auto-disconnect**: `connect()` returns a disconnect function
- 📘 **TypeScript Support**: Full type definitions with generics
- 🧪 **Test Suite**: Comprehensive unit tests with Node.js test runner
- 📚 **Examples**:
    - Basic usage
    - Game system
    - Event bus pattern
- 🎮 **Godot-inspired API**: Familiar to Godot Engine users
- 🚀 **Zero Dependencies**: No external packages required
- 🌍 **Universal**: Works in Node.js, Browser, Deno, and Bun

### Philosophy

NanoSignals was created with these principles:

1. **Simplicity**: Easy to learn, easy to use
2. **Performance**: Minimal overhead, maximum speed
3. **Reliability**: Well-tested, predictable behavior
4. **Flexibility**: Works everywhere JavaScript runs
5. **Developer Experience**: Great TypeScript support, helpful errors

---

## Release Notes Format

### Version Types

- **Major (x.0.0)**: Breaking changes
- **Minor (1.x.0)**: New features, backwards compatible
- **Patch (1.1.x)**: Bug fixes, backwards compatible

### Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

---

## Upcoming Features (Roadmap)

### v1.2.0 (Planned)

- 🎯 **Priority System**: Set listener priorities
- 🔄 **Signal Combinators**: Combine multiple signals
- 📊 **Performance Benchmarks**: Official benchmarks vs other libraries

### v2.0.0 (Future)

- ⚡ **Async Support**: `emitAsync()` for async listeners
- 🎪 **Middleware/Interceptors**: Transform args before emission
- 🔌 **Signal Groups**: Manage multiple signals together
- 🎭 **Filtered Signals**: Connect with condition functions

---

## Links

- [GitHub Repository](https://github.com/Clemix37/nano-signals)
- [npm Package](https://www.npmjs.com/package/@cyberwebdev/nanosignals)
- [Issue Tracker](https://github.com/Clemix37/nano-signals/issues)
