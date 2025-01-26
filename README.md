# npm-radar

A CLI tool to identify recently updated dependencies in your Node.js projects.

## Installation

```bash
npm install -g @maddygoround/npm-radar
```

## Usage

```bash
npm-radar [path/to/package.json]
```

## Examples

Check current directory's package.json:
```bash
npm-radar
```

Check specific package.json:
```bash
npm-radar ./path/to/package.json
```

## Features

- Scans both dependencies and devDependencies
- Shows packages updated in the last 2 months
- Displays current and latest versions
- Handles errors gracefully

## Development

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Publishing

1. Build the package:
```bash
npm run build
```

2. Publish to npm:
```bash
npm publish --access public
```

## License
MIT
