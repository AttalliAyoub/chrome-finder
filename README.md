# chrome-finder

A Deno library to find Chrome browser installations across different operating systems (Windows, macOS, and Linux).

The code for this has been adapted from npm [chrome-finder](https://github.com/gwuhaolin/chrome-finder)

## Features

- 🔍 Automatically detects Chrome installations
- 🌐 Cross-platform support (Windows, macOS, Linux)
- ⚡ Lightweight and fast
- 🔒 Type-safe with TypeScript

## Installation

```bash
# Using Deno
import { findChrome } from "jsr:@attalliayoub/chrome-finder@0.1.0";
```

## Usage

```typescript
import { findChrome } from "@attalliayoub/chrome-finder";

try {
  const chromePath = findChrome();
  console.log("Chrome found at:", chromePath);
} catch (error) {
  if (error.message === "no chrome installations found") {
    console.log("No Chrome installation found on your system");
  } else if (error.message === "platform not support") {
    console.log("Your operating system is not supported");
  }
}
```

## API

### `findChrome()`

Returns the path to the first found Chrome installation.

#### Returns
- `string`: The full path to the Chrome executable

#### Throws
- `Error`: "no chrome installations found" - When no Chrome installation is detected
- `Error`: "platform not support" - When running on an unsupported operating system

## Supported Platforms

- Windows
  - Chrome Stable
  - Chrome Beta
  - Chrome SxS (Canary)
  - Chromium
- macOS
  - Chrome Stable
  - Chrome Beta
  - Chrome SxS (Canary)
  - Chromium
- Linux
  - Chrome Stable
  - Chrome Beta
  - Chrome SxS (Canary)
  - Chromium

## Development

```bash
# Run tests in watch mode
deno task dev
```

## License

[MIT](http://github.com/AttalliAyoub/chrome-finder/blob/main/LICENSE)

## Dependencies

- [@attalliayoub/fs-access](https://jsr.io/@attalliayoub/fs-access) - File system access utilities
- [@std/path](https://jsr.io/@std/path) - Path manipulation utilities
- [@std/assert](https://jsr.io/@std/assert) - Assertion utilities 