import { chromium } from 'playwright';
import fs from 'node:fs/promises';
await fs.mkdir('analysis/exploded',{recursive:true});
const browser=await chromium.launch();
for (const [name,width,height] of [['desktop',1440,1000],['phone',390,844]]){
 const p=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://localhost:3001',{waitUntil:'networkidle'});await p.waitForSelector('.exploded-stage[data-state="ready"]');
 for(const progress of [.62,.68,.73,.8,.9,1]){
  await p.locator('#experience').evaluate((el,v)=>window.scrollTo(0,el.offsetTop+(el.offsetHeight-innerHeight)*v),progress);
  await p.waitForTimeout(200);await p.screenshot({path:`analysis/exploded/${name}-${progress}.png`});
 }
 console.log(name,errors,await p.locator('.exploded-canvas').evaluate(c=>({...c.dataset,width:c.width,height:c.height})));await p.close();
}await browser.close();
