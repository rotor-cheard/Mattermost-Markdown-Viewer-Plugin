import React, {useEffect, useState} from 'react';
import {Marked} from 'marked';
import DOMPurify from 'dompurify';
import type {FileInfo, PluginRegistry, Store} from './typings/mattermost-webapp';

const marked = new Marked({
    breaks: true,
    gfm: true
});

interface MarkdownPreviewProps {
    fileInfo: FileInfo;
}

function MarkdownPreview({fileInfo}: MarkdownPreviewProps) {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`/api/v4/files/${fileInfo.id}`, {
                    credentials: 'same-origin'
                });
                if (!response.ok) throw new Error('Failed to load file');
                const text = await response.text();
                const html = await marked.parse(text);
                const sanitized = DOMPurify.sanitize(html, {
                    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'code', 'pre', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'img'],
                    ALLOWED_ATTR: ['href', 'src', 'alt', 'class']
                });
                setContent(sanitized);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [fileInfo.id]);

    if (loading) {
        return React.createElement('div', {style: {padding: '20px', textAlign: 'center'}}, 'Loading...');
    }

    if (error) {
        return React.createElement('div', {style: {padding: '20px', color: 'red'}}, `Error: ${error}`);
    }

    return React.createElement('div', {
        className: 'markdown-preview-wrapper',
        style: {
            height: '100%',
            maxHeight: 'calc(100vh - 150px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: '#ffffff',
            padding: '10px 30px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
            color: '#000000'
        },
        dangerouslySetInnerHTML: {__html: `
            <style>
                .markdown-preview-wrapper { color: #000000 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; text-align: left; }
                .markdown-preview-wrapper * { color: #000000 !important; }
                .markdown-preview-wrapper h1 { font-size: 2.2em; font-weight: 600; margin: 0.5em 0 0.7em; color: #000000 !important; text-align: left; }
                .markdown-preview-wrapper h2 { font-size: 1.8em; font-weight: 600; margin: 1.3em 0 0.6em; color: #000000 !important; text-align: left; }
                .markdown-preview-wrapper h3 { font-size: 1.4em; font-weight: 600; margin: 1.2em 0 0.5em; color: #000000 !important; text-align: left; }
                .markdown-preview-wrapper h4 { font-size: 1.2em; font-weight: 600; margin: 1em 0 0.5em; color: #000000 !important; text-align: left; }
                .markdown-preview-wrapper h5 { font-size: 1.05em; font-weight: 600; margin: 1em 0 0.5em; color: #000000 !important; text-align: left; }
                .markdown-preview-wrapper h6 { font-size: 0.95em; font-weight: 600; margin: 1em 0 0.5em; color: #000000 !important; text-align: left; }
                .markdown-preview-wrapper p { margin: 0.8em 0; color: #000000 !important; text-align: left; }
                .markdown-preview-wrapper ul, .markdown-preview-wrapper ol { margin: 1em 0; padding-left: 2.5em; text-align: left; color: #000000 !important; }
                .markdown-preview-wrapper li { margin: 0.4em 0; color: #000000 !important; text-align: left; }
                .markdown-preview-wrapper code { background: #f6f8fa; padding: 3px 6px; border-radius: 3px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 0.9em; color: #d73a49; border: 1px solid #e1e4e8; }
                .markdown-preview-wrapper pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 1.2em 0; border: 1px solid #e1e4e8; }
                .markdown-preview-wrapper pre code { background: none; padding: 0; border: none; color: #24292e; }
                .markdown-preview-wrapper blockquote { border-left: 5px solid #dfe2e5; padding-left: 1em; margin: 1.2em 0; color: #6a737d; font-style: italic; }
                .markdown-preview-wrapper a { color: #0366d6; text-decoration: none; }
                .markdown-preview-wrapper a:hover { text-decoration: underline; }
                .markdown-preview-wrapper table { border-collapse: collapse; width: 100%; margin: 1.2em 0; }
                .markdown-preview-wrapper th, .markdown-preview-wrapper td { border: 1px solid #dfe2e5; padding: 10px 14px; text-align: left; }
                .markdown-preview-wrapper th { background: #f6f8fa; font-weight: 600; }
                .markdown-preview-wrapper tr:nth-child(even) { background: #f6f8fa; }
                .markdown-preview-wrapper hr { border: none; border-top: 3px solid #e1e4e8; margin: 2.5em 0; }
                .markdown-preview-wrapper img { max-width: 100%; height: auto; border-radius: 4px; margin: 1em 0; }
                .markdown-preview-wrapper strong { font-weight: 600; }
                .markdown-preview-wrapper em { font-style: italic; color: #24292e; }
            </style>
            <div style="max-width: 1000px; color: #000000 !important;">
                ${content}
            </div>
        `}
    });
}

class PluginClass {
    initialize(registry: PluginRegistry, store: Store) {
        const state = store.getState();
        const config = state?.entities?.general?.config || {};
        const pluginConfig = config['PluginSettings']?.Plugins?.['com.proudcommerce.markdown-viewer'] || {};
        const extensions = (pluginConfig.extensions || 'md,markdown')
            .split(',')
            .map((ext: string) => ext.trim().toLowerCase());

        registry.registerFilePreviewComponent(
            (fileInfo: FileInfo) => {
                const fileName = fileInfo.name || '';
                const ext = fileName.split('.').pop()?.toLowerCase() || '';
                return extensions.includes(ext);
            },
            MarkdownPreview
        );
    }
}

// @ts-ignore
window.registerPlugin('com.proudcommerce.markdown-viewer', new PluginClass());
