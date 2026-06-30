import jsyaml from "js-yaml";

export type ImportFormat = "json" | "yaml" | "po" | "strings" | "xml" | "properties";

export interface ParsedEntry {
  key: string;
  value: string;
}

export function detectFormat(filename: string): ImportFormat | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, ImportFormat> = {
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    po: "po",
    strings: "strings",
    xml: "xml",
    properties: "properties",
  };
  return ext ? map[ext] || null : null;
}

export function parseContent(content: string, format: ImportFormat): ParsedEntry[] {
  switch (format) {
    case "json":
      return parseJSON(content);
    case "yaml":
      return parseYAML(content);
    case "po":
      return parsePO(content);
    case "strings":
      return parseStrings(content);
    case "xml":
      return parseXML(content);
    case "properties":
      return parseProperties(content);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function flattenObject(obj: Record<string, any>, prefix = ""): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      entries.push(...flattenObject(value, fullKey));
    } else {
      entries.push({ key: fullKey, value: String(value ?? "") });
    }
  }
  return entries;
}

function parseJSON(content: string): ParsedEntry[] {
  const parsed = JSON.parse(content);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Invalid JSON: expected an object");
  }
  return flattenObject(parsed as Record<string, any>);
}

function parseYAML(content: string): ParsedEntry[] {
  const parsed = jsyaml.load(content);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Invalid YAML: expected a mapping");
  }
  return flattenObject(parsed as Record<string, any>);
}

function parsePO(content: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const blocks = content.split(/\n\n+/);
  for (const block of blocks) {
    const msgidMatch = block.match(/msgid\s+"((?:[^"\\]|\\.)*)"/);
    const msgstrMatch = block.match(/msgstr\s+"((?:[^"\\]|\\.)*)"/);
    if (msgidMatch && msgstrMatch) {
      const key = msgidMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n");
      const value = msgstrMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n");
      if (key) entries.push({ key, value });
    }
  }
  return entries;
}

function parseStrings(content: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*")) continue;
    const match = trimmed.match(/^"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"/);
    if (match) {
      const key = match[1].replace(/\\"/g, '"').replace(/\\n/g, "\n");
      const value = match[2].replace(/\\"/g, '"').replace(/\\n/g, "\n");
      entries.push({ key, value });
    }
  }
  return entries;
}

function parseXML(content: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  // Parse Android-style XML: <string name="key">value</string>
  const regex = /<string\s+name="([^"]+)"\s*>([^<]*)<\/string>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    entries.push({ key: match[1], value: match[2].trim() });
  }
  // Also support <data><value key="key">value</value></data>
  const regex2 = /<value\s+key="([^"]+)"\s*>([^<]*)<\/value>/g;
  while ((match = regex2.exec(content)) !== null) {
    entries.push({ key: match[1], value: match[2].trim() });
  }
  return entries;
}

function parseProperties(content: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("!")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex > 0) {
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      entries.push({ key, value });
    }
  }
  return entries;
}

// ==================== Exporters ====================

export function exportContent(entries: ParsedEntry[], format: ImportFormat): string {
  switch (format) {
    case "json":
      return exportJSON(entries);
    case "yaml":
      return exportYAML(entries);
    case "po":
      return exportPO(entries);
    case "strings":
      return exportStrings(entries);
    case "xml":
      return exportXML(entries);
    case "properties":
      return exportProperties(entries);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

function unflatten(entries: ParsedEntry[]): Record<string, any> {
  const result: Record<string, any> = {};
  for (const entry of entries) {
    const parts = entry.key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = entry.value;
  }
  return result;
}

function exportJSON(entries: ParsedEntry[]): string {
  return JSON.stringify(unflatten(entries), null, 2);
}

function exportYAML(entries: ParsedEntry[]): string {
  return jsyaml.dump(unflatten(entries), { indent: 2 });
}

function exportPO(entries: ParsedEntry[]): string {
  let output = `msgid ""\nmsgstr ""\n"Content-Type: text/plain; charset=UTF-8\\n"\n\n`;
  for (const entry of entries) {
    const escapedKey = entry.key.replace(/"/g, '\\"').replace(/\n/g, "\\n");
    const escapedValue = entry.value.replace(/"/g, '\\"').replace(/\n/g, "\\n");
    output += `msgid "${escapedKey}"\nmsgstr "${escapedValue}"\n\n`;
  }
  return output;
}

function exportStrings(entries: ParsedEntry[]): string {
  return entries
    .map((e) => {
      const key = e.key.replace(/"/g, '\\"').replace(/\n/g, "\\n");
      const value = e.value.replace(/"/g, '\\"').replace(/\n/g, "\\n");
      return `"${key}" = "${value}";`;
    })
    .join("\n");
}

function exportXML(entries: ParsedEntry[]): string {
  let output = `<?xml version="1.0" encoding="UTF-8"?>\n<resources>\n`;
  for (const entry of entries) {
    const escapedValue = entry.value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    output += `  <string name="${entry.key}">${escapedValue}</string>\n`;
  }
  output += `</resources>`;
  return output;
}

function exportProperties(entries: ParsedEntry[]): string {
  return entries
    .map((e) => `${e.key}=${e.value}`)
    .join("\n");
}
