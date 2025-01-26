# Package Checker CLI

A professional tool to identify recently updated dependencies in your Node.js projects.

## Installation

```bash
npm install -g @yourusername/package-checker
```

## Usage

```bash
package-checker [path/to/package.json]
```

## Examples

Check current directory's package.json:
```bash
package-checker
```

Check specific package.json:
```bash
package-checker ./path/to/package.json
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
