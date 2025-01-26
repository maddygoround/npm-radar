#!/usr/bin/env node
import { Command } from 'commander';
import { promises as fs, constants } from 'fs';
import path from 'path';
import { fetch } from 'undici';

interface PackageResult {
  name: string;
  current: string;
  latest: string;
  updated: string;
}

const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000;

async function checkUpdates(packagePath: string): Promise<void> {
   let fullPath = path.resolve(process.cwd(), packagePath);
  
  try {

    // Check if path is directory
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      fullPath = path.join(fullPath, 'package.json');
    }

  // Verify file existence and readability
    await fs.access(fullPath, constants.R_OK);
    
    const data = await fs.readFile(fullPath, 'utf8');
    const pkg = JSON.parse(data) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    
    if (!Object.keys(allDeps).length) {
      console.log('No dependencies found in package.json');
      return;
    }

    console.log(`Checking ${Object.keys(allDeps).length} packages in ${fullPath}...`);

    
    const cutoffDate = Date.now() - TWO_MONTHS_MS;
    const results: PackageResult[] = [];

    for (const [name, current] of Object.entries(allDeps)) {
      try {
        const response = await fetch(`https://registry.npmjs.org/${name}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json() as any;
        const modified = new Date(data.time?.modified).getTime();
        const latest = data['dist-tags']?.latest || 'unknown';

        if (modified > cutoffDate) {
          results.push({
            name,
            current,
            latest,
            updated: new Date(modified).toISOString().split('T')[0]
          });
        }
      } catch (error) {
        console.error(`⚠️  Error checking ${name}:`, (error as Error).message);
      }
    }

    console.log('\nRecently updated packages (last 2 months):');
    console.log(
      results
        .sort((a, b) => b.updated.localeCompare(a.updated))
        .map(p => `${p.name.padEnd(25)} ${p.current.padEnd(15)} → ${p.latest.padEnd(10)} (${p.updated})`)
        .join('\n') || 'No recent updates found'
    );

  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`🚨 Error: No package.json found at ${fullPath}`);
      process.exit(1);
    }
    console.error('🚨 Unexpected error:', (error as Error).message);
    process.exit(1);
  }
}

const program = new Command()
  .name('package-checker')
  .description('CLI tool to find recently updated NPM packages')
  .version('1.0.0')
  .argument('[path]', 'Path to package.json file', 'package.json')
  .action(checkUpdates);

program.parseAsync(process.argv).catch(console.error);
