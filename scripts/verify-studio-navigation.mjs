import {chromium,webkit} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const report=[];
for(const engine of [chromium,webkit]){
 const b=await engine.launch();
 for(const [width,height] of [[1440,1000],[834,1194],[390,844]]){
  const p=await b.newPage({viewport:{width,height}});await p.goto(process.env.BASE_URL||'http://localhost:3002',{waitUntil:'networkidle'});
  if(width<768){await p.getByRole('button',{name:'Open navigation'}).click();await p.locator('#mobile-menu').getByRole('link',{name:/Specs/}).click();}
  else await p.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name:'Specs',exact:true}).click();
  await p.waitForFunction(()=>document.activeElement?.id==='specs');
  assert.equal(await p.evaluate(()=>location.hash),'#specs');
  await p.screenshot({path:`analysis/studio-verification/${engine.name()}-${width}-specs-final.png`});
  await p.locator('.technical-details summary').focus();await p.keyboard.press('Enter');
  assert(await p.locator('.technical-details').getAttribute('open')!==null);
  await p.locator('#specs').evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-78));await p.waitForTimeout(200);
  const bounds=await p.evaluate(()=>{const d=document.querySelector('#specs [data-car-slot]').getBoundingClientRect(),c=document.querySelector('#specs .travel-copy').getBoundingClientRect();return {x:d.x,y:d.y,w:d.width,h:d.height,textX:c.x,overflow:document.documentElement.scrollWidth>innerWidth};});
  assert(!bounds.overflow);if(width>=768){assert(bounds.x+bounds.w<bounds.textX+12);assert(bounds.y+bounds.h<height+200);}
  await p.screenshot({path:`analysis/studio-verification/${engine.name()}-${width}-specs-expanded-final.png`});
  report.push({engine:engine.name(),width,height,navigation:true,keyboardDetails:true,bounds});await p.close();
 }
 await b.close();
}
await fs.writeFile('analysis/studio-verification/navigation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
