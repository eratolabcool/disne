export interface MarkdownHeading {
  id: string;
  level: number;
  text: string;
}

function normalizeHeadingText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyHeadingText(value: string) {
  const normalized = normalizeHeadingText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return normalized || "section";
}

export function extractMarkdownHeadings(
  content: string,
  minLevel: number = 1,
  maxLevel: number = 6
): MarkdownHeading[] {
  const seen = new Map<string, number>();

  return content
    .split("\n")
    .map((line) => line.match(/^(#{1,6})\s+(.+?)\s*$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => {
      const level = match[1].length;
      const text = normalizeHeadingText(match[2]);
      const baseId = slugifyHeadingText(text);
      const occurrence = seen.get(baseId) || 0;
      seen.set(baseId, occurrence + 1);

      return {
        level,
        text,
        id: occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`,
      };
    })
    .filter((heading) => heading.level >= minLevel && heading.level <= maxLevel);
}
