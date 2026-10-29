import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.BASE_URL||'http://localhost:3002';const out='analysis/chapters';await fs.mkdir(out,{recursive:true});const report=[];
for(const engine of [chromium,webkit]){
 const browser=await engine.launch();
 for(const [name,width,height] of [['desktop',1440,1000],['tablet',834,1194],['phone',390,844],['small-phone',360,740],['landscape',844,390]]){
  const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');
  const seek=async(id,p)=>{await page.locator('#'+id).evaluate((e,p)=>window.scrollTo(0,e.offsetTop+(e.offsetHeight-innerHeight)*p),p);};
  for(const [frame,story] of [[0,'origin'],[180,'form'],[500,'above'],[710,'doors'],[780,'engine']]){
   await seek('experience',.035+.93*.46*frame/792);
   await page.waitForFunction(([f,key])=>Math.abs(Number(document.querySelector('.travelling-car').dataset.frame)-f)<=1&&document.querySelector('#experience .film-narrative').dataset.story===key,[frame,story]);
   await page.waitForTimeout(550);
   await page.screenshot({path:`${out}/${engine.name()}-${name}-${story}.png`});
   const geometry=await page.locator('#experience').evaluate(e=>{const panel=e.querySelector('.film-narrative').getBoundingClientRect(),dock=e.querySelector('.car-dock').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,panelRight:panel.right,dockLeft:dock.left,clipped:[...e.querySelectorAll('h2,.film-key-fact strong')].some(n=>n.scrollWidth>n.clientWidth+1)};});
   assert(!geometry.overflow,'Horizontal overflow');assert(!geometry.clipped,`Clipped text: ${name}/${story}`);if(width>=768)assert(geometry.panelRight<geometry.dockLeft+1,'Text and car columns overlap');
  }
  await seek('experience',.8);await page.waitForFunction(()=>document.querySelector('#experience .film-narrative').dataset.story==='return');
  // Reverse scrolling restores the earlier chapter, not a timer-driven next slide.
  await seek('experience',.035+.93*.46*180/792);await page.waitForFunction(()=>document.querySelector('#experience .film-narrative').dataset.story==='form');
  await seek('engineering',.5);await page.waitForFunction(()=>document.querySelector('.travelling-car').dataset.frame==='912');await page.locator('.part-annotations.visible').waitFor();await page.waitForTimeout(550);
  for(const [button,text] of [['02 Front wheels','20-inch'],['05 V12 engine','764 CV']]){
   await page.getByRole('button',{name:button}).click();await page.waitForFunction(t=>document.querySelector('#part-description')?.textContent.includes(t),text);
  }
  await page.screenshot({path:`${out}/${engine.name()}-${name}-exploded.png`});
  assert(await page.locator('#engineering .film-narrative #part-description').count()===1,'Selected part description must be in the narrative panel');
  assert.deepEqual(errors,[]);report.push({engine:engine.name(),name,width,height,passed:true});console.log('PASS',engine.name(),name);await page.close();
 }
 await browser.close();
}
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
