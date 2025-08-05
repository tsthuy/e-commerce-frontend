import { memo } from 'react';

import { useHistory } from 'react-router-dom';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export const MarkdownMessage = memo<MarkdownMessageProps>(({ content, className = '' }) => {
  const history = useHistory();

  // Parse markdown-style links [text](url) and convert to clickable elements
  const parseMarkdownLinks = (text: string): (string | JSX.Element)[] => {
    // Regex to match [text](url) pattern
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    // Find all markdown links
    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, linkText, url] = match;
      const startIndex = match.index;

      // Add text before link
      if (startIndex > lastIndex) {
        parts.push(text.substring(lastIndex, startIndex));
      }

      // Handle internal product links
      const handleLinkClick = (e: React.MouseEvent): void => {
        e.preventDefault();

        // Check if it's an internal product link
        if (url.includes('/products/')) {
          // Extract product ID from URL
          const productIdMatch = url.match(/\/products\/([a-f0-9-]+)/);
          if (productIdMatch) {
            const productId = productIdMatch[1];
            // eslint-disable-next-line no-console
            console.log('🔗 Navigating to product:', productId);
            history.push(`/products/${productId}`);
          }
        } else {
          // For external links, open in new tab
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      };

      // Create clickable link element
      parts.push(
        <button key={`link-${startIndex}`} className="cursor-pointer font-medium text-blue-600 underline transition-colors hover:text-blue-800" type="button" onClick={handleLinkClick}>
          {linkText}
        </button>
      );

      lastIndex = startIndex + fullMatch.length;
    }

    // Add remaining text after last link
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  const parsedContent = parseMarkdownLinks(content);

  return <div className={className}>{parsedContent.map((part, index) => (typeof part === 'string' ? <span key={index}>{part}</span> : part))}</div>;
});

MarkdownMessage.displayName = 'MarkdownMessage';
