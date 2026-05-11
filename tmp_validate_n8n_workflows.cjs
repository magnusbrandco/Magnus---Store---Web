const fs = require('fs');
const path = require('path');
const { Workflow } = require('./node_modules/n8n-workflow/dist/cjs/workflow.js');
const nodeTypes = { getByNameAndVersion: () => undefined };
const dir = path.join('n8n', 'workflows');
for (const fname of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const filepath = path.join(dir, fname);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  try {
    const wf = new Workflow({ ...data, nodeTypes });
    console.log(fname, 'OK', Object.keys(wf.nodes).length);
  } catch (e) {
    console.error(fname, 'ERROR', e && e.stack ? e.stack : e);
  }
}
