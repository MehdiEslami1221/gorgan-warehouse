import { spawn } from 'node:child_process';
import path from 'node:path';

export function runCommand(file, args, options = {}) {
  return new Promise(resolve => {
    let child;
    let settled = false;
    let timer;
    const finish = ok => { if (settled) return; settled = true; clearTimeout(timer); resolve(ok); };
    try {
      child = spawn(file, args, { stdio: 'ignore', windowsHide: true, ...options });
      child.once('error', () => finish(false));
      child.once('exit', code => finish(code === 0));
      timer = setTimeout(() => { child.kill(); finish(false); }, 10000);
    } catch { finish(false); }
  });
}

export async function openBrowser(url, { platform = process.platform, run = runCommand, systemRoot = process.env.SystemRoot || 'C:\\Windows' } = {}) {
  // Only the fixed local application address can enter a Windows command.
  if (url !== 'http://127.0.0.1:3322') throw new Error('Unexpected browser URL');
  if (platform !== 'win32') { console.log(url); return true; }
  const powershell = path.win32.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
  if (await run(powershell, ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', "$ErrorActionPreference='Stop'; Start-Process -FilePath 'http://127.0.0.1:3322'"])) return true;
  const cmd = path.win32.join(systemRoot, 'System32', 'cmd.exe');
  if (await run(cmd, ['/d', '/s', '/c', 'start "" "http://127.0.0.1:3322"'], { windowsVerbatimArguments: true })) return true;
  console.error('Could not open the default browser. Open this address manually: ' + url);
  return false;
}
