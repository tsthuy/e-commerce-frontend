export function renderPlaceholderImage({ width = 400, height = 400, color, text }: { width?: number; height?: number; color?: { background: string; text: string }; text: string }): string {
  return `https://placehold.co/${width === height ? width : `${width}x${height}`}${!!color ? `/${color.background}/${color.text}` : ''}.webp${text ? `?text=${text}` : ''}`;
}
