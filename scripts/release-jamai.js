const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get source directory from args or default
const args = process.argv.slice(2);
const sourceDir = args[0] ? path.resolve(process.cwd(), args[0]) : path.resolve(process.cwd(), '../jamai-mac/releases');
const targetDir = path.join(__dirname, '../public/updates');

console.log(`Source Directory: ${sourceDir}`);
console.log(`Target Directory: ${targetDir}`);

// Validate source directory
if (!fs.existsSync(sourceDir)) {
    console.error(`\x1b[31mError: Source directory not found: ${sourceDir}\x1b[0m`);
    console.log('Please provide a valid source directory as an argument or ensure ../jamai-mac/releases exists.');
    process.exit(1);
}

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    console.log('Creating public/updates directory...');
    fs.mkdirSync(targetDir, { recursive: true });
}

// Find files to copy
const files = fs.readdirSync(sourceDir);
const appcast = files.find(f => f === 'appcast.xml');
const zips = files.filter(f => f.endsWith('.zip') && f.startsWith('JamAI'));

if (!appcast) {
    console.error('\x1b[31mError: appcast.xml not found in source directory.\x1b[0m');
    process.exit(1);
}

if (zips.length === 0) {
    console.warn('\x1b[33mWarning: No JamAI-*.zip files found in source directory.\x1b[0m');
}

// Copy files
console.log('\nCopying files...');

try {
    // Copy appcast.xml
    const srcAppcast = path.join(sourceDir, appcast);
    const destAppcast = path.join(targetDir, appcast);
    fs.copyFileSync(srcAppcast, destAppcast);
    console.log(`✅ Copied ${appcast}`);

    // Copy zips
    zips.forEach(zip => {
        const srcZip = path.join(sourceDir, zip);
        const destZip = path.join(targetDir, zip);
        fs.copyFileSync(srcZip, destZip);
        console.log(`✅ Copied ${zip}`);
    });

    // Git operations
    console.log('\nGit operations...');

    // Check if there are changes
    const status = execSync(`git status --porcelain "${targetDir}"`).toString();

    if (status) {
        console.log('Staging changes...');
        execSync(`git add "${targetDir}"`, { stdio: 'inherit' });

        console.log('Committing changes...');
        execSync(`git commit -m "chore(release): update Sparkle feed and artifacts"`, { stdio: 'inherit' });
        console.log('\x1b[32mSuccessfully updated and committed release artifacts.\x1b[0m');
    } else {
        console.log('No changes detected in public/updates.');
    }

} catch (error) {
    console.error(`\x1b[31mError during release process: ${error.message}\x1b[0m`);
    process.exit(1);
}
