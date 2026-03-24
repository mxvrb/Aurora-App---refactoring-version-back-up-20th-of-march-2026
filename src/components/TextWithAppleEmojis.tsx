import React, { useMemo } from 'react';

interface TextWithAppleEmojisProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TextWithAppleEmojis: React.FC<TextWithAppleEmojisProps> = ({ text, className, style }) => {
  const parts = useMemo(() => {
    // Check for Intl.Segmenter support (modern browsers)
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text)).map(s => s.segment);
    }
    // Fallback for older environments: simple split (might break ZWJ sequences)
    return text.split(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu);
  }, [text]);

  // Regex to detect if a segment is an emoji
  // We look for Extended_Pictographic. 
  // Note: This might match some non-emoji characters or numbers if not careful, 
  // but usually in chat context it's fine. 
  // A tighter check: /\p{Emoji_Presentation}/u 
  const isEmoji = (str: string) => {
    return /\p{Extended_Pictographic}/u.test(str);
  };

  return (
    <span className={className} style={style}>
      {parts.map((part, index) => {
        if (isEmoji(part)) {
          return (
            <img 
              key={index}
              src={`https://emojicdn.elk.sh/${part}?style=apple`}
              alt={part}
              className="inline-block w-[1.3em] h-[1.3em] align-text-bottom mx-0.5 select-none pointer-events-none"
              loading="lazy"
            />
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
