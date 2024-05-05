export function hexToRgba(hexColor: string, alpha: number): string {
  if (!/^#[0-9A-F]{6}$/i.test(hexColor)) {
    return hexColor;
  }

  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  if (alpha < 0 || alpha > 1) {
    return hexColor;
  }

  const rgbaColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  return rgbaColor;
}
