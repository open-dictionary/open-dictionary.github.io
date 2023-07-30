import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
// @ts-ignore
import _ from 'lodash';
import YAML from 'js-yaml';

const DICTIONARY_PATH = join(process.cwd(), 'node_modules/english-dictionary');
const wordsMapMap = new Map<string, boolean>();
const entries = readFileSync(join(DICTIONARY_PATH, 'index.csv'), 'utf-8').split('\n');
for (const entry of entries) {
  wordsMapMap.set(entry, true);
}

const words = _.uniq([...wordsMapMap.keys()]);

export function getEntries() {
  return _.uniq(words.map((word) => word.split('').slice(0, 2).join('')));
}

export function getWords(entry: string) {
  return words.filter((item) => item.startsWith(entry));
}

export function getDefinitions(word: string) {
  const path = join(DICTIONARY_PATH, word.split('').slice(0, 2).join('/'), word);
  const definitionFiles = readdirSync(path).filter((item) => item.endsWith('.yaml'));
  const definitions = [];
  for (const filename of definitionFiles) {
    const items: { definition: string; pos: string }[] = YAML.load(
      readFileSync(join(path, filename), 'utf-8'),
    ) as any;
    const language = filename.replace('definitions.', '').replace('.yaml', '');
    definitions.push({ language, items });
  }
  return definitions;
}