import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const VAULT_DIR = "C:\\Users\\fitne\\Documents\\Obsidian Vault\\3Tree Digital Sport IA Sede\\02_Agent_Skills";
const MASTER_INDEX_PATH = path.join(VAULT_DIR, "00_MASTER_SKILLS_INDEX.md");

/**
 * JIT Skills Router for 3Tree Digital Sport IA
 * Compliant with Corporate Directive DIR-SKILLS-001
 * Standard: 100% US English (en-US)
 */

export class JITSkillLoader {
  constructor(vaultDir = VAULT_DIR) {
    this.vaultDir = vaultDir;
    this.masterIndexPath = path.join(this.vaultDir, "00_MASTER_SKILLS_INDEX.md");
    this.cachedIndex = null;
  }

  /**
   * Load and parse all skill references from Master Index & Agent Prompts
   */
  loadSkillsDatabase() {
    if (this.cachedIndex) return this.cachedIndex;

    const skillsMap = new Map();

    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          this._extractSkillsFromFile(fullPath, skillsMap);
        }
      }
    };

    scanDirectory(this.vaultDir);
    this.cachedIndex = skillsMap;
    return skillsMap;
  }

  _extractSkillsFromFile(filePath, skillsMap) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      let currentSkill = null;
      let skillBuffer = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const skillMatch = line.match(/^###\s+🔧\s+([a-zA-Z0-9_\-]+)/);

        if (skillMatch) {
          if (currentSkill && skillBuffer.length > 0) {
            this._storeSkill(currentSkill, skillBuffer.join("\n"), filePath, skillsMap);
          }
          currentSkill = skillMatch[1].trim();
          skillBuffer = [line];
        } else if (currentSkill) {
          if (line.startsWith("### 🔧 ") || line.startsWith("## ") || line.startsWith("---") && lines[i+1]?.startsWith("### 🔧 ")) {
            if (line.startsWith("---") && lines[i+1]?.startsWith("### 🔧 ")) {
              skillBuffer.push(line);
              this._storeSkill(currentSkill, skillBuffer.join("\n"), filePath, skillsMap);
              currentSkill = null;
              skillBuffer = [];
            } else if (line.startsWith("## ")) {
              this._storeSkill(currentSkill, skillBuffer.join("\n"), filePath, skillsMap);
              currentSkill = null;
              skillBuffer = [];
            } else {
              skillBuffer.push(line);
            }
          } else {
            skillBuffer.push(line);
          }
        }
      }

      if (currentSkill && skillBuffer.length > 0) {
        this._storeSkill(currentSkill, skillBuffer.join("\n"), filePath, skillsMap);
      }
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err.message);
    }
  }

  _storeSkill(skillName, content, sourceFile, skillsMap) {
    const whatMatch = content.match(/- \*\*What it does:\*\*\s*([^\n]+)/i);
    const whenMatch = content.match(/- \*\*When to trigger:\*\*\s*([^\n]+)/i);
    const howMatch = content.match(/- \*\*How to execute:\*\*\s*([^\n]+)/i);
    const outputMatch = content.match(/- \*\*Expected Output:\*\*\s*([^\n]+)/i);

    const relPath = path.relative(this.vaultDir, sourceFile);

    skillsMap.set(skillName.toLowerCase(), {
      name: skillName,
      sourceFile: relPath,
      rawBlock: content.trim(),
      whatItDoes: whatMatch ? whatMatch[1].trim() : "See skill definition",
      whenToTrigger: whenMatch ? whenMatch[1].trim() : "See skill definition",
      howToExecute: howMatch ? howMatch[1].trim() : "See skill definition",
      expectedOutput: outputMatch ? outputMatch[1].trim() : "See skill definition"
    });
  }

  /**
   * Search skills by name or keyword
   */
  searchSkills(query, limit = 10) {
    const db = this.loadSkillsDatabase();
    const q = query.toLowerCase();
    const results = [];

    for (const [name, data] of db.entries()) {
      let score = 0;
      if (name === q) score += 100;
      else if (name.includes(q)) score += 50;
      if (data.whatItDoes.toLowerCase().includes(q)) score += 20;
      if (data.whenToTrigger.toLowerCase().includes(q)) score += 15;

      if (score > 0) {
        results.push({ ...data, score });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Extract a single skill block for dynamic agent injection
   */
  getSkill(skillName) {
    const db = this.loadSkillsDatabase();
    return db.get(skillName.toLowerCase()) || null;
  }
}

// CLI test runner support
if (process.argv[1] && process.argv[1].endsWith("jit_skill_loader.js")) {
  const query = process.argv[2] || "kinematic";
  console.log(`[JIT Skill Router] Searching for '${query}'...`);
  const loader = new JITSkillLoader();
  const results = loader.searchSkills(query, 5);
  console.log(`Found ${results.length} matching skills:`);
  for (const r of results) {
    console.log(`\n========================================`);
    console.log(`Skill: ${r.name} (Source: ${r.sourceFile})`);
    console.log(`========================================`);
    console.log(r.rawBlock);
  }
}
