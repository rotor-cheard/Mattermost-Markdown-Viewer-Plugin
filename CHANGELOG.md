# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-09-02

### Security
- upgraded DOMPurify from 3.3.0 to 3.4.14, remediating known XSS vulnerabilities (incl. CVE-2026-0540, affecting 3.1.3–3.3.1)
- restricted `<img>` rendering to embedded base64 `data:` raster images (png/jpeg/gif/webp/bmp); remote/relative image URLs and SVG data URIs are stripped, so Markdown files can no longer force clients to fetch remote hosts (tracking pixels / IP disclosure) or smuggle script via SVG
- hardened rendered links with `target="_blank"` and `rel="noopener noreferrer nofollow"`

### Changed
- removed deprecated `@types/dompurify` devDependency (DOMPurify 3.x ships its own type definitions)

## [1.0.0] - 2025-11-05

### Added
- initial release with markdown file preview functionality
- support for .md and .markdown files
- configurable file extensions via plugin settings
- sanitized HTML rendering with DOMPurify
- responsive styling with Mattermost theme integration

