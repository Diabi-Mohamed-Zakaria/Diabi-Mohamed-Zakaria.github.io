import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../js/i18n.js', import.meta.url), 'utf8');
const content = runInNewContext(`${source}\nSITE_CONTENT` , { window: {} });
const knowledge = Object.fromEntries(Object.entries(content).map(([lang, page]) => [lang, {
  profile: {
    name: page.hero.name,
    description: page.hero.bio,
    location: page.hero.location,
    // Status text may become stale; the dated experience below is the reliable record.
  },
  education: page.path.education,
  experience: page.path.experience,
  projects: page.projects.items,
  skills: page.skills.categories,
  languages: page.skills.languages,
  contact: {
    email: 'mohamedzakariadiabi@gmail.com',
    github: 'https://github.com/Diabi-Mohamed-Zakaria',
    linkedin: 'https://www.linkedin.com/in/m-zakaria-diabi-11042a352'
  }
}]));
writeFileSync(new URL('../chat/knowledge.json', import.meta.url), `${JSON.stringify(knowledge, null, 2)}\n`);
