import { describe, expect, it } from 'vitest';
import { EXPERIENCE } from '../src/data/experience';
import { SKILLS } from '../src/data/skills';

describe('experience', () => {
  it('has 8 entries', () => expect(EXPERIENCE).toHaveLength(8));
  it('every entry has all required fields filled', () => {
    for (const job of EXPERIENCE) {
      expect(job.company).toBeTruthy();
      expect(job.role).toBeTruthy();
      expect(job.range).toBeTruthy();
      expect(job.location).toBeTruthy();
      expect(job.summary).toBeTruthy();
    }
  });
});

describe('skills', () => {
  it('has 5 groups', () => expect(SKILLS).toHaveLength(5));
  it('every group has at least one chip', () => {
    for (const group of SKILLS) {
      expect(group.name).toBeTruthy();
      expect(group.chips.length).toBeGreaterThan(0);
    }
  });
});
