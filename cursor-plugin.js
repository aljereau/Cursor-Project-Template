// cursor-plugin.js
// This file acts as a lightweight behavior enforcer inside Cursor

module.exports = {
  activate: (context) => {
    const fs = require('fs');
    const path = require('path');

    const projectRoot = process.cwd();
    const docsPath = path.join(projectRoot, 'docs', 'phases');
    const srcPath = path.join(projectRoot, 'src');

    const isPhaseApproved = (phaseFile) => {
      const contents = fs.readFileSync(path.join(docsPath, phaseFile), 'utf8');
      return contents.includes('Status: Approved') || contents.includes('Status: Done');
    };

    const preventPrematureCoding = () => {
      const phases = fs.readdirSync(docsPath).filter(f => f.endsWith('.md') && f !== '_template.md');
      const unapprovedPhases = phases.filter(f => !isPhaseApproved(f));

      if (fs.existsSync(srcPath) && unapprovedPhases.length > 0) {
        console.warn('🚫 Warning: You are editing /src before all required phases are approved!');
      }
    };

    // Run on activation
    try {
      preventPrematureCoding();
    } catch (err) {
      console.error('Cursor plugin error:', err.message);
    }
  }
};
