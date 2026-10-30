import { NextRequest, NextResponse } from 'next/server';
import { all, one, entity, listMaster, saveMaster, createDoc, cancelDoc, getDoc, makeBackup, report, filters, db } from '@/lib/db';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const json=(x:unknown,status=200)=>NextResponse.json(x,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req:NextRequest,ctx:{params:Promise<{path:string[]}>}){return handle(req,ctx);}
export async function POST(req:NextRequest,ctx:{params:Promise<{path:string[]}>}){return handle(req,ctx);}
async function handle(req:NextRequest,ctx:{params:Promise<{path:string[]}>}){try{
const host=req.headers.get('host')||'';if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host))return json({error:'دسترسی فقط از همین رایانه مجاز است'},403);
if(req.method==='POST'&&req.headers.get('origin')!==`http://${host}`)return json({error:'مبدأ درخواست معتبر نیست'},403);
const {path}=await ctx.params,p=req.nextUrl.searchParams;const page=Math.min(100000,Math.max(1,parseInt(p.get('page')||'1')||1));
let b:any={};if(req.method==='POST'){if(!req.headers.get('content-type')?.includes('application/json'))return json({error:'نوع درخواست نامعتبر'},415);const raw=await req.text();if(raw.length>256000)return json({error:'سند بیش از حد بزرگ است'},413);b=JSON.parse(raw);await makeBackup();}
if(path[0]==='health')return json({app:'gorgan-warehouse',version:'2.0.0',pid:process.pid});
if(path[0]==='master'){const e=entity(path[1]);return json(req.method==='POST'?saveMaster(e,b):listMaster(e,(p.get('q')||'').slice(0,150),page,p.get('active')==='1'));}
if(path[0]==='documents'){
if(req.method==='POST'){if(path[1]==='cancel')return json(cancelDoc(Number(b.id),b.reason));return json(createDoc(b));}
if(path[1])return json(getDoc(Number(path[1])));
const clauses:string[]=[],args:any[]=[];if(p.get('kind')){clauses.push('kind=?');args.push(p.get('kind'));}if(p.get('q')){clauses.push('(CAST(id AS TEXT) LIKE ? OR party LIKE ?)');args.push('%'+p.get('q')+'%','%'+p.get('q')+'%');}const where=clauses.length?'WHERE '+clauses.join(' AND '):'';return json({rows:all(`SELECT * FROM documents ${where} ORDER BY id DESC LIMIT 25 OFFSET ?`,...args,(page-1)*25),total:one(`SELECT COUNT(*) n FROM documents ${where}`,...args).n});}
if(path[0]==='dashboard')return json({products:one('SELECT COUNT(*) n FROM products WHERE active=1').n,low:one('SELECT COUNT(*) n FROM products WHERE active=1 AND stock<=threshold').n,employees:one('SELECT COUNT(*) n FROM employees WHERE active=1').n,documents:one("SELECT COUNT(*) n FROM documents WHERE status='posted'").n,lowRows:all('SELECT p.id,p.name,p.stock/1000.0 stock,p.threshold/1000.0 threshold,u.name unit_name FROM products p JOIN units u ON u.id=p.unit_id WHERE p.active=1 AND p.stock<=p.threshold ORDER BY p.stock,p.id LIMIT 10'),recent:all('SELECT * FROM documents ORDER BY id DESC LIMIT 6')});
if(path[0]==='reports')return json(report(p,page));
if(path[0]==='export'){
const {where,args}=filters(p);const iterator=db.prepare(`SELECT d.id,d.date,d.kind,d.party,l.name,l.unit,l.qty/1000.0 qty,l.note FROM lines l JOIN documents d ON d.id=l.document_id WHERE ${where} AND d.status='posted' AND d.kind!='order' ORDER BY d.date,d.id,l.id`).iterate(...args);const encoder=new TextEncoder();const cell=(v:unknown)=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};const labels:Record<string,string>={initial:'موجودی اولیه',in:'ورود',out:'خروج'};
const stream=new ReadableStream({start(c){c.enqueue(encoder.encode('\uFEFFشناسه,تاریخ میلادی,نوع,طرف سند,کالا,واحد,مقدار,توضیحات\r\n'));},pull(c){const next=iterator.next();if(next.done){c.close();return;}const r=next.value as any;c.enqueue(encoder.encode([r.id,r.date,labels[r.kind],r.party,r.name,r.unit,r.qty,r.note].map(cell).join(',')+'\r\n'));},cancel(){iterator.return?.();}});return new Response(stream,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="warehouse-report.csv"','Cache-Control':'no-store'}});}
if(path[0]==='backup'){const file=await makeBackup(true);return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream,{headers:{'Content-Type':'application/octet-stream','Content-Disposition':'attachment; filename="warehouse-backup.sqlite"','Cache-Control':'no-store'}});}
if(path[0]==='audit')return json({rows:all('SELECT * FROM audit ORDER BY id DESC LIMIT 25 OFFSET ?',(page-1)*25),total:one('SELECT COUNT(*) n FROM audit').n});
return json({error:'مسیر پیدا نشد'},404);
}catch(e){const m=e instanceof Error?e.message:'خطای نامشخص';console.error(m);return json({error:m.includes('UNIQUE')?'این نام یا سند قبلاً ثبت شده است':m.includes('FOREIGN KEY')?'رکورد وابسته معتبر نیست':m.includes('SQLITE')?'خطای پایگاه داده؛ فضای دیسک و فایل اطلاعات را بررسی کنید':m},400);}}
