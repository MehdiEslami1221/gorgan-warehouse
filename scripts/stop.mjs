import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try{const pid=Number(readFileSync(path.join(root,'data','server.pid'),'utf8'));const r=await fetch('http://127.0.0.1:3322/api/health',{signal:AbortSignal.timeout(2000)});const h=await r.json();if(h.app!=='gorgan-warehouse'||h.pid!==pid)throw Error('Server identity mismatch. Close its original window manually.');process.kill(pid,'SIGTERM');console.log('Warehouse stopped.')}catch(e){console.log('No matching running server found:',e.message)}
