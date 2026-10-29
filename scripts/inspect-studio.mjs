import {chromium} from 'playwright';
import fs from 'node:fs/promises';
await fs.mkdir('analysis/studio',{recursive:true});
const b=await chromium.launch({headless:true});
for(const [name,width,height] of [['desktop',1440,1000],['phone',390,844]]){
 const p=await b.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.BASE_URL||'http://localhost:3001',{waitUntil:'networkidle'});
 await p.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');
 for(const [id,progress] of [['top',null],['experience',.49],['story',null],['design',null],['engineering',.5],['specs',null],['inquire',null]]){
  await p.locator('#'+id).evaluate((e,v)=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY+(v===null?-78:(e.offsetHeight-innerHeight)*v)),progress);
  if(progress!==null)await p.waitForFunction((f)=>Number(document.querySelector('.travelling-car')?.dataset.frame)===f,id==='engineering'?912:792,{timeout:30000});
  await p.waitForTimeout(1000);await p.screenshot({path:`analysis/studio/${name}-${id}.png`});
  console.log(name,id,await p.evaluate(()=>({frame:document.querySelector('.travelling-car')?.dataset.frame,scene:document.querySelector('.travelling-car')?.dataset.scene,overflow:document.documentElement.scrollWidth>innerWidth,wide:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2).slice(0,4).map(e=>e.className)})));
 }
 console.log('ERRORS',name,errors);await p.close();
}
await b.close();
