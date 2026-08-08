export interface ParsedStreamConfig {
  title: string;
  titles: string[]; // Multiple title choices if provided
  description: string;
  tags: string[];
  categoryId: string;
  privacyStatus: string;
}


/**
 * Parsers file configurations (JSON, Markdown, or raw YAML/YML text).
 * Automatically extracts Titles (including lists of title options), Descriptions, Categories, Tags, and Privacy levels.
 */
export function parseStreamFile(text: string, filename?: string): ParsedStreamConfig {
  const result: ParsedStreamConfig = {
    title: '',
    titles: [],
    description: '',
    tags: [],
    categoryId: '28', // default: Science & Tech (28)
    privacyStatus: 'public',
  };

  const normalizedText = text.trim();
  
  if (!normalizedText) {
    return result;
  }

  // 1. Check if the file is JSON
  if (normalizedText.startsWith('{') && normalizedText.endsWith('}')) {
    try {
      const json = JSON.parse(normalizedText);
      
      // Parse titles
      if (Array.isArray(json.titles)) {
        result.titles = json.titles.map((t: any) => String(t).trim());
        result.title = result.titles[0] || '';
      } else if (Array.isArray(json.title)) {
        result.titles = json.title.map((t: any) => String(t).trim());
        result.title = result.titles[0] || '';
      } else if (json.title) {
        result.title = String(json.title).trim();
        result.titles = [result.title];
      }

      result.description = json.description ? String(json.description) : '';
      
      if (Array.isArray(json.tags)) {
        result.tags = json.tags.map((t: any) => String(t).trim());
      } else if (typeof json.tags === 'string') {
        result.tags = json.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      }

      if (json.categoryId) result.categoryId = String(json.categoryId);
      if (json.category) result.categoryId = String(json.category);
      if (json.privacyStatus) result.privacyStatus = String(json.privacyStatus).toLowerCase();
      if (json.privacy) result.privacyStatus = String(json.privacy).toLowerCase();

      return result;
    } catch (e) {
      console.warn('File has JSON markers but failed parsing, falling back to plaintext:', e);
    }
  }

  // 2. Otherwise treat it as Markdown or YAML
  // If it starts with YAML frontmatter boundaries
  let yamlSection = '';
  let bodySection = '';

  if (normalizedText.startsWith('---')) {
    const parts = normalizedText.split('---');
    if (parts.length >= 3) {
      yamlSection = parts[1];
      bodySection = parts.slice(2).join('---').trim();
    } else {
      yamlSection = normalizedText.replace(/^---/, '');
    }
  } else {
    // If it's a raw .yaml/.yml file or plaintext
    const isYamlFile = filename && (filename.endsWith('.yaml') || filename.endsWith('.yml'));
    if (isYamlFile) {
      yamlSection = normalizedText;
    } else {
      bodySection = normalizedText;
    }
  }

  result.description = bodySection;

  if (yamlSection) {
    const lines = yamlSection.split('\n');
    let insideTitleList = false;
    let insideTagList = false;
    const accumulatedTitles: string[] = [];
    const accumulatedTags: string[] = [];

    for (const line of lines) {
      const trimLine = line.trim();
      if (!trimLine || trimLine.startsWith('#')) continue;

      // Handle list-item lines under list keys
      if (trimLine.startsWith('-')) {
        const itemVal = trimLine.slice(1).trim().replace(/^['"]|['"]$/g, '');
        if (insideTitleList) {
          accumulatedTitles.push(itemVal);
          continue;
        }
        if (insideTagList) {
          accumulatedTags.push(itemVal);
          continue;
        }
      }

      // Check key-value split
      const colonIndex = trimLine.indexOf(':');
      if (colonIndex === -1) continue;

      const key = trimLine.slice(0, colonIndex).trim().toLowerCase();
      let val = trimLine.slice(colonIndex + 1).trim();

      // Reset list statuses
      insideTitleList = false;
      insideTagList = false;

      // If val is empty, it might be starting a multiline array
      if (!val) {
        if (key === 'title' || key === 'titles') {
          insideTitleList = true;
        } else if (key === 'tags') {
          insideTagList = true;
        }
        continue;
      }

      // Clean simple quotes from value
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      switch (key) {
        case 'title':
        case 'titles':
          // Check JSON array format: ["title1", "title2"]
          if (val.startsWith('[') && val.endsWith(']')) {
            try {
              const parsedArray = JSON.parse(val.replace(/'/g, '"'));
              result.titles = Array.isArray(parsedArray) ? parsedArray.map(String) : [String(parsedArray)];
            } catch (e) {
              result.titles = val.slice(1, -1).split(',').map((t) => t.trim().replace(/^['"]|['"]$/g, ''));
            }
          } else {
            result.titles = [val];
          }
          break;

        case 'type':
        case 'category':
        case 'categoryid':
          result.categoryId = val;
          break;

        case 'privacy':
        case 'privacystatus':
          result.privacyStatus = val.toLowerCase();
          break;

        case 'tags':
          if (val.startsWith('[') && val.endsWith(']')) {
            try {
              const parsedArray = JSON.parse(val.replace(/'/g, '"'));
              result.tags = Array.isArray(parsedArray) ? parsedArray.map(String) : [String(parsedArray)];
            } catch (e) {
              result.tags = val.slice(1, -1).split(',').map((t) => t.trim().replace(/^['"]|['"]$/g, ''));
            }
          } else {
            result.tags = val.split(',').map((t) => t.trim()).filter(Boolean);
          }
          break;
      }
    }

    // Merge multi-line lists if any were found
    if (accumulatedTitles.length > 0) {
      result.titles = accumulatedTitles;
    }
    if (accumulatedTags.length > 0) {
      result.tags = accumulatedTags;
    }
  }

  // Populate primary title
  result.title = result.titles?.[0] || '';

  return result;
}
