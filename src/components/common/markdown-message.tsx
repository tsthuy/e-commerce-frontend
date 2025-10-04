import { memo } from 'react';

import { useHistory } from 'react-router-dom';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export const MarkdownMessage = memo<MarkdownMessageProps>(({ content, className = '' }) => {
  const history = useHistory();
  const parseMarkdownLinks = (text: string): (string | JSX.Element)[] => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      const [fullMatch, linkText, url] = match;
      const startIndex = match.index;
      if (startIndex > lastIndex) {
        parts.push(text.substring(lastIndex, startIndex));
      }
      const handleLinkClick = (e: React.MouseEvent): void => {
        e.preventDefault();
        if (url.includes('/products/')) {
          const productIdMatch = url.match(/\/products\/([a-f0-9-]+)/);
          if (productIdMatch) {
            const productId = productIdMatch[1];

            console.log('🔗 Navigating to product:', productId);
            history.push(`/products/${productId}`);
          }
        } else {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      };

      parts.push(
        <button key={`link-${startIndex}`} className="cursor-pointer font-medium text-blue-600 underline transition-colors hover:text-blue-800" type="button" onClick={handleLinkClick}>
          {linkText}
        </button>
      );

      lastIndex = startIndex + fullMatch.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  const parsedContent = parseMarkdownLinks(content);

  return <div className={className}>{parsedContent.map((part, index) => (typeof part === 'string' ? <span key={index}>{part}</span> : part))}</div>;
});

MarkdownMessage.displayName = 'MarkdownMessage';
