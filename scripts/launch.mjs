import { openBrowser } from './browser.mjs';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync,existsSync,rmSync,appendFileSync,statSync,renameSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=3322,url=`http://127.0.0.1:${port}`,data=path.join(root,'data'),lock=path.join(data,'launch.lock');
mkdirSync(data,{recursive:true});

async function health(){try{const r=await fetch(url+'/api/health',{signal:AbortSignal.timeout(1000)});return await r.json()}catch{return null}}
const existing=await health();
if(existing){if(existing.app==='gorgan-warehouse'){await openBrowser(url);process.exit(0)}console.error('Port 3322 is occupied by another application.');process.exit(1)}
if(existsSync(lock)){try{const pid=Number(readFileSync(path.join(lock,'pid'),'utf8'));process.kill(pid,0);console.error('Warehouse is starting. Wait a few seconds, then try again.');process.exit(1)}catch{rmSync(lock,{recursive:true,force:true})}}
try{mkdirSync(lock);writeFileSync(path.join(lock,'pid'),String(process.pid))}catch{console.error('Another launch is in progress.');process.exit(1)}
const app=path.join(root,'app-runtime'),server=path.join(app,'server.js');
if(!existsSync(server)){console.error('Missing app-runtime/server.js. Extract the complete ZIP first.');rmSync(lock,{recursive:true,force:true});process.exit(1)}
const log=path.join(data,'server.log');
function logChunk(chunk){process.stdout.write(chunk);try{if(existsSync(log)&&statSync(log).size>2*1024*1024){rmSync(log+'.1',{force:true});renameSync(log,log+'.1')}appendFileSync(log,chunk)}catch{}}
console.log('GORGAN WAREHOUSE 2.0 | Offline | http://127.0.0.1:3322');
console.log('Keep this window open. Use STOP.cmd or Ctrl+C to stop safely.');
const child=spawn(process.execPath,['--max-old-space-size=512',server],{cwd:app,env:{...process.env,NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',HOSTNAME:'127.0.0.1',PORT:String(port),WAREHOUSE_DATA:data},stdio:['ignore','pipe','pipe']});
writeFileSync(path.join(data,'server.pid'),String(child.pid));
child.stdout.on('data',logChunk);child.stderr.on('data',logChunk);
function cleanup(){rmSync(lock,{recursive:true,force:true});rmSync(path.join(data,'server.pid'),{force:true})}
child.on('error',e=>{console.error(e);cleanup();process.exitCode=1});
child.on('exit',code=>{cleanup();process.exitCode=code||0;console.log('Warehouse stopped.')});
for(const event of ['SIGINT','SIGTERM'])process.on(event,()=>child.kill('SIGTERM'));
let ready=false;
for(let i=0;i<60;i++){if(child.exitCode!==null)break;const h=await health();if(h?.app==='gorgan-warehouse'&&h.pid===child.pid){ready=true;await openBrowser(url);break}await new Promise(r=>setTimeout(r,500))}
if(!ready){console.error('Server did not become ready. See data/server.log.');child.kill('SIGTERM')}
