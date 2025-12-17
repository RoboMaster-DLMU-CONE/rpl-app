'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeHighlightProps {
  code: string;
  lang: string; // Using string instead of Lang due to type issues
}

export function CodeHighlight({ code, lang }: CodeHighlightProps) {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false; // To prevent state updates on unmounted components

    const initializeHighlighter = async () => {
      try {
        // Get the appropriate theme based on current mode
        const isDarkMode = document.documentElement.classList.contains('dark');
        const currentTheme = isDarkMode ? 'github-dark' : 'github-light';

        const highlightedCode = await codeToHtml(code, {
          lang,
          theme: currentTheme,
        });

        if (!isCancelled) {
          setHtml(highlightedCode);
          setError(null);
        }
      } catch (err) {
        console.error('Error highlighting code:', err);
        if (!isCancelled) {
          setError('Failed to highlight code');
          setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    initializeHighlighter();

    // Function to update theme based on current mode
    const updateTheme = async () => {
      if (!loading) {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const currentTheme = isDarkMode ? 'github-dark' : 'github-light';

        try {
          const highlightedCode = await codeToHtml(code, {
            lang,
            theme: currentTheme,
          });
          if (!isCancelled) {
            setHtml(highlightedCode);
          }
        } catch (err) {
          console.error('Error updating theme:', err);
        }
      }
    };

    // Set up a MutationObserver to watch for theme class changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateTheme();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Clean up
    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [code, lang, loading]);

  return (
    <div className="overflow-auto">
      {loading ? (
        <div className="p-4 text-xs font-mono">Loading...</div>
      ) : error ? (
        <div className="p-4 text-xs font-mono text-red-500">{error}</div>
      ) : (
        <div
          className="p-4 text-xs font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}

// Helper function to escape HTML
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}