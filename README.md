# PC Markdown Viewer

A Mattermost plugin that renders Markdown files (`.md`, `.markdown`) in the file preview modal with proper formatting and styling.

## Features

- Renders Markdown files directly in Mattermost's file preview
- Configurable file extensions
- Sanitized HTML output (DOMPurify)
- Responsive design with Mattermost theme integration
- Support for tables, code blocks, headings, lists, and more

## Installation

1. Download the latest release (`*.tar.gz`) from the releases page
2. Go to Mattermost System Console → Plugins → Management
3. Upload the plugin file
4. Enable the plugin

## Configuration

Navigate to System Console → Plugins → PC Markdown Viewer

**File extensions**: Comma-separated list of extensions to render (default: `md,markdown`)

## Development

### Prerequisites

- Node.js 18+ and npm
- Mattermost Server 10.0.0+

### Build

```bash
make build
```

### Create distribution package

```bash
make dist
```

This creates `dist/com.proudcommerce.markdown-viewer-*.tar.gz`

### Clean build artifacts

```bash
make clean
```

## License

MIT License - see [LICENSE](LICENSE) file for details

---

With ❤️ by [Proud Commerce](https://www.proudcommerce.com).