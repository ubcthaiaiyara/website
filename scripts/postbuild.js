const fs = require('fs');
const path = require('path');
const detailPath = path.join('.next', 'export-detail.json');
// Create export-detail.json with version 2 (unrecognized by builder's
// getExportStatus), which causes it to return false — preventing both
// the ENOENT lstat crash (older builder) and the static-export path
// (newer builder). The builder then falls through to serverless mode.
fs.writeFileSync(detailPath, JSON.stringify({ version: 2 }));
