/**
 * Marschpat.UI.Components installation script
 * Installs dependencies for all components and modules.
 * Run this script after your root projects install process.
 */

const fs = require('fs');
const { exec } = require('child_process');

// Install all "Modules" dependencies
const modules = [
    'MusicsheetUpload',
].forEach(module => {
    if (!fs.existsSync(`${__dirname}/modules/${module}/package.json`)) return;
    exec(`cd ${__dirname}/modules/${module} && yarn install`);
});

// Install all "Components" dependencies
const components = [].forEach(component => { });
