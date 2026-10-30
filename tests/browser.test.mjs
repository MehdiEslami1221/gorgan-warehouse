import test from 'node:test';
import assert from 'node:assert/strict';
import { openBrowser, runCommand } from '../scripts/browser.mjs';
test('Windows browser opening waits for the first successful command', async () => {
 const calls=[];
 const result=await openBrowser('http://127.0.0.1:3322',{platform:'win32',run:async(...args)=>{calls.push(args);return true;}});
 assert.equal(result,true);assert.equal(calls.length,1);assert.match(calls[0][0],/powershell.exe$/);assert.match(calls[0][1].at(-1),/Start-Process/);
});
test('Windows browser failure invokes quoted cmd fallback', async () => {
 const calls=[];
 const result=await openBrowser('http://127.0.0.1:3322',{platform:'win32',run:async(...args)=>{calls.push(args);return calls.length===2;}});
 assert.equal(result,true);assert.equal(calls.length,2);assert.equal(calls[1][1].at(-1),'start "" "http://127.0.0.1:3322"');assert.equal(calls[1][2].windowsVerbatimArguments,true);
});
test('Browser failures and command spawn errors are handled', async () => {
 assert.equal(await openBrowser('http://127.0.0.1:3322',{platform:'win32',run:async()=>false}),false);
 assert.equal(await runCommand('this-command-does-not-exist-warehouse',[]),false);
 await assert.rejects(()=>openBrowser('https://example.com'));
});
