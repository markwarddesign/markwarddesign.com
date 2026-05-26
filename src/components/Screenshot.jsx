import React from 'react';

/**
 * Screenshot — image when `src` exists, gradient placeholder otherwise.
 * Tints (warm/sage/ink/paper) drive the placeholder background.
 */
export default function Screenshot({
  src,
  alt,
  label,
  tint = 'paper',
  aspect = 'aspect-[16/10]',
  size = 'normal',
}) {
  const tintClass =
    tint === 'warm'
      ? 'from-warm-50 to-warm-100'
      : tint === 'sage'
      ? 'from-sage-50 to-sage-100'
      : tint === 'ink'
      ? 'from-ink-900 to-ink-700'
      : 'from-paper-200 to-paper-300';
  const isInk = tint === 'ink';
  const borderClass = isInk ? 'border-paper-50/10' : 'border-ink-900/10';

  if (src) {
    return (
      <div className={`relative w-full ${aspect} overflow-hidden rounded-sm border ${borderClass} bg-paper-200 transition-transform duration-500 group-hover:scale-[1.01]`}>
        <img
          src={src}
          alt={alt || label || ''}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspect} overflow-hidden rounded-sm border ${borderClass} bg-gradient-to-br ${tintClass} flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.01]`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px)',
        }}
      />
      <div className={`relative font-mono ${size === 'large' ? 'text-xs' : 'text-[10px]'} uppercase tracking-[0.22em] ${isInk ? 'text-paper-200/70' : 'text-ink-quiet'}`}>
        {label}
      </div>
    </div>
  );
}
