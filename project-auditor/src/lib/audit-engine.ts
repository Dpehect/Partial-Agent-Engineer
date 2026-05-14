import * as cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

export type AuditIssue = {
  id: string;
  category: 'frontend' | 'backend' | 'seo' | 'security';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
};

export type AuditResult = {
  score: number;
  issues: AuditIssue[];
  stats: {
    frontend: number;
    backend: number;
    seo: number;
    security: number;
  };
};

export async function auditUrl(url: string): Promise<AuditResult> {
  const issues: AuditIssue[] = [];
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const html = response.data;
    const $ = cheerio.load(html);

    // SEO Checks
    const title = $('title').text();
    if (!title) {
      issues.push({
        id: 'seo-no-title',
        category: 'seo',
        severity: 'high',
        title: 'Missing Title Tag',
        description: 'The page does not have a <title> tag, which is critical for SEO.',
        recommendation: 'Add a descriptive <title> tag to the <head> section.',
      });
    } else if (title.length < 30 || title.length > 60) {
      issues.push({
        id: 'seo-title-length',
        category: 'seo',
        severity: 'medium',
        title: 'Suboptimal Title Length',
        description: `Title length is ${title.length} characters. Ideal length is 30-60.`,
        recommendation: 'Adjust the title to be between 30 and 60 characters for better search results.',
      });
    }

    const description = $('meta[name="description"]').attr('content');
    if (!description) {
      issues.push({
        id: 'seo-no-desc',
        category: 'seo',
        severity: 'high',
        title: 'Missing Meta Description',
        description: 'No meta description was found.',
        recommendation: 'Add a <meta name="description" content="..."> tag.',
      });
    }

    // Frontend Checks
    $('img').each((_, el) => {
      if (!$(el).attr('alt')) {
        issues.push({
          id: 'fe-img-no-alt',
          category: 'frontend',
          severity: 'medium',
          title: 'Image Missing Alt Attribute',
          description: 'An image was found without an alt attribute, which impacts accessibility.',
          recommendation: 'Add descriptive alt text to all <img> tags.',
        });
      }
    });

    const h1Count = $('h1').length;
    if (h1Count === 0) {
      issues.push({
        id: 'seo-no-h1',
        category: 'seo',
        severity: 'medium',
        title: 'No H1 Tag Found',
        description: 'H1 tags are important for structure and SEO.',
        recommendation: 'Add exactly one <h1> tag to the page.',
      });
    } else if (h1Count > 1) {
      issues.push({
        id: 'seo-multiple-h1',
        category: 'seo',
        severity: 'low',
        title: 'Multiple H1 Tags',
        description: `Found ${h1Count} H1 tags. Best practice is to have only one.`,
        recommendation: 'Consolidate multiple H1 tags into a single H1 and use H2-H6 for subheadings.',
      });
    }

    // Security Headers (Partial)
    const headers = response.headers;
    if (!headers['strict-transport-security']) {
      issues.push({
        id: 'sec-hsts-missing',
        category: 'security',
        severity: 'medium',
        title: 'HSTS Header Missing',
        description: 'Strict-Transport-Security header is not set.',
        recommendation: 'Enable HSTS to force browsers to use HTTPS.',
      });
    }

  } catch (error: any) {
    issues.push({
      id: 'error-fetch',
      category: 'frontend',
      severity: 'high',
      title: 'Failed to Fetch URL',
      description: `Could not connect to ${url}: ${error.message}`,
      recommendation: 'Check if the URL is correct and the server is reachable.',
    });
  }

  return calculateFinalResult(issues);
}

export async function auditLocalPath(dirPath: string): Promise<AuditResult> {
  const issues: AuditIssue[] = [];
  try {
    const files = await getAllFiles(dirPath);
    
    for (const file of files) {
      const ext = path.extname(file);
      const content = await fs.readFile(file, 'utf-8');

      // Backend / Security Checks
      if (ext === '.c' || ext === '.cpp' || ext === '.js' || ext === '.py') {
        if (content.includes('password =') || content.includes('api_key =')) {
          issues.push({
            id: 'sec-hardcoded-secret',
            category: 'security',
            severity: 'high',
            title: 'Hardcoded Secret Detected',
            description: `A potential secret was found in ${path.basename(file)}.`,
            recommendation: 'Use environment variables (.env) instead of hardcoding secrets.',
          });
        }
        
        if (ext === '.c' && content.includes('gets(')) {
          issues.push({
            id: 'sec-unsafe-function',
            category: 'security',
            severity: 'high',
            title: 'Unsafe Function Usage',
            description: 'The use of gets() is dangerous as it is vulnerable to buffer overflows.',
            recommendation: 'Use fgets() instead.',
          });
        }
      }

      // Frontend Checks in Local Files
      if (ext === '.html' || ext === '.jsx' || ext === '.tsx') {
        if (content.includes('<img') && !content.includes('alt=')) {
          issues.push({
            id: 'fe-img-no-alt-local',
            category: 'frontend',
            severity: 'medium',
            title: 'Missing Alt in Component',
            description: `Found an <img> tag without alt text in ${path.basename(file)}.`,
            recommendation: 'Ensure all images have accessibility labels.',
          });
        }
      }
    }

    const gitignorePath = path.join(dirPath, '.gitignore');
    // Check for node_modules in gitignore
    try {
      const gitignore = await fs.readFile(gitignorePath, 'utf-8');
      if (!gitignore.includes('.env')) {
        issues.push({
          id: 'sec-env-not-ignored',
          category: 'security',
          severity: 'high',
          title: '.env Not Ignored',
          description: '.env files are not listed in your .gitignore.',
          recommendation: 'Add .env to your .gitignore to prevent leaking secrets to Git.',
        });
      }
      if (!gitignore.includes('node_modules')) {
        issues.push({
          id: 'backend-node-modules-not-ignored',
          category: 'backend',
          severity: 'medium',
          title: 'node_modules Not Ignored',
          description: 'It seems node_modules is not in your .gitignore.',
          recommendation: 'Add node_modules to .gitignore to avoid committing heavy dependencies.',
        });
      }
    } catch (e) {
      issues.push({
        id: 'backend-no-gitignore',
        category: 'backend',
        severity: 'low',
        title: 'Missing .gitignore',
        description: 'No .gitignore file found in the project root.',
        recommendation: 'Create a .gitignore file to keep your repository clean.',
      });
    }

    // Check package.json for scripts
    const pkgPath = path.join(dirPath, 'package.json');
    try {
      const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
      if (!pkg.scripts || !pkg.scripts.test) {
        issues.push({
          id: 'backend-no-tests',
          category: 'backend',
          severity: 'medium',
          title: 'No Tests Found',
          description: 'No test script found in package.json.',
          recommendation: 'Add unit tests (e.g., using Jest or Vitest) to ensure code reliability.',
        });
      }
    } catch (e) {}

  } catch (error: any) {
    issues.push({
      id: 'error-local',
      category: 'backend',
      severity: 'high',
      title: 'Directory Audit Failed',
      description: error.message,
      recommendation: 'Ensure the path is correct and accessible.',
    });
  }

  return calculateFinalResult(issues);
}

async function getAllFiles(dir: string): Promise<string[]> {
  let results: string[] = [];
  const list = await fs.readdir(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.next') continue;
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(await getAllFiles(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}

function calculateFinalResult(issues: AuditIssue[]): AuditResult {
  const categories = ['frontend', 'backend', 'seo', 'security'] as const;
  const stats = { frontend: 100, backend: 100, seo: 100, security: 100 };
  
  issues.forEach(issue => {
    const penalty = issue.severity === 'high' ? 20 : issue.severity === 'medium' ? 10 : 5;
    stats[issue.category] -= penalty;
    if (stats[issue.category] < 0) stats[issue.category] = 0;
  });

  const score = Math.round((stats.frontend + stats.backend + stats.seo + stats.security) / 4);

  return {
    score,
    issues,
    stats
  };
}
