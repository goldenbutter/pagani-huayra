import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.BASE_URL||'http://localhost:3002';
const out='analysis/studio-verification';await fs.mkdir(out,{recursive:true});
const report={base,cases:[],reducedMotion:null,recovery:null};
async function ready(p){await p.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');}
async function seek(p,id,progress){
 await p.locator('#'+id).evaluate((e,v)=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY+(e.offsetHeight-innerHeight)*v),progress);
 await p.waitForTimeout(220);
}
async function frame(p,n){await p.waitForFunction(n=>Math.abs(Number(document.querySelector('.travelling-car')?.dataset.frame)-n)<=1,n,{timeout:30000});}
async function noOverflow(p){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow');}
for(const [engine,cases] of [[chromium,[['desktop',1440,1000],['laptop',1280,800],['tablet',834,1194],['phone',390,844],['small-phone',360,740],['landscape',844,390]]],[webkit,[['safari-desktop',1440,900],['safari-phone',390,844]]]]){
 const b=await engine.launch({headless:true});
 for(const [name,width,height] of cases){
  const p=await b.newPage({viewport:{width,height},deviceScaleFactor:2});const errors=[],requests=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>requests.push(r.url()));
  await p.goto(base,{waitUntil:'networkidle'});await ready(p);await noOverflow(p);
  assert.equal(await p.locator('canvas.travelling-car').count(),1);
  assert(!await p.getByRole('button',{name:/Switch to|Choose (Bianco|Verde)/}).count());
  assert(requests.filter(u=>/studio\/(mobile|desktop)\/\d/.test(u)).length<45,'Hero should not preload whole film');
  await p.screenshot({path:`${out}/${name}-hero.png`});
  await seek(p,'experience',.035);await frame(p,0);
  await seek(p,'experience',.25);
  const middle=Number(await p.locator('.travelling-car').getAttribute('data-frame'));assert(middle>200&&middle<600);
  await seek(p,'experience',.49);await frame(p,792);
  assert.equal(await p.locator('.part-annotations.visible').count(),0,'First film must not explode');
  await p.screenshot({path:`${out}/${name}-open.png`});
  await seek(p,'experience',.8);
  assert(Number(await p.locator('.travelling-car').getAttribute('data-frame'))<middle,'Reverse must progress toward assembled car');
  await seek(p,'experience',.97);await frame(p,0);
  const travel=[];
  for(const id of ['story','design']){
   await p.locator(`#${id} [data-car-slot]`).evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY+e.offsetHeight/2-innerHeight/2));
   await p.waitForFunction(()=>{const c=document.querySelector(".travelling-car");return c.dataset.frame===c.dataset.targetFrame&&Number(c.dataset.frame)<=552;});await p.waitForTimeout(160);await noOverflow(p);
   travel.push(await p.locator('.travelling-car').getAttribute('data-x'));
   await p.screenshot({path:`${out}/${name}-${id}.png`});
  }
  if(width>=768)assert.notEqual(travel[0],travel[1],'Car must travel to alternating docks');
  await seek(p,'engineering',.035);await frame(p,0);
  await seek(p,'engineering',.5);await frame(p,912);await p.locator('.part-annotations.visible').waitFor();await noOverflow(p);
  assert.equal(await p.locator('.part-label').count(),6);
  await p.getByRole('button',{name:'02 Front wheels'}).click();
  assert.equal(await p.getByRole('button',{name:'02 Front wheels'}).getAttribute('aria-pressed'),'true');
  assert.match(await p.locator('#part-description').innerText(),/20-inch/);
  await p.getByRole('button',{name:'05 V12 engine'}).focus();
  assert.match(await p.locator('#part-description').innerText(),/764 CV/);
  await p.screenshot({path:`${out}/${name}-exploded.png`});
  await seek(p,'engineering',.97);await frame(p,0);
  await seek(p,'engineering',.5);await frame(p,912);
  await seek(p,'engineering',.035);await frame(p,0);
  await p.locator('#specs').evaluate(e=>window.scrollTo(0,e.offsetTop-78));await p.waitForTimeout(300);
  const specs=await p.locator('.red-specs').innerText();for(const value of ['764','1,000','1,218','XTRAC','RWD'])assert(specs.includes(value));
  await p.locator('.technical-details summary').click();assert(await p.locator('.technical-details').getAttribute('open')!==null);await noOverflow(p);
  await p.screenshot({path:`${out}/${name}-specs.png`});
  const detailsEnd=await p.locator('.technical-details').evaluate(e=>e.getBoundingClientRect().bottom);
  const craftStart=await p.locator('#craftsmanship').evaluate(e=>e.getBoundingClientRect().top);assert(detailsEnd<craftStart,'Expanded specs must fit section');
  if(width<768){
   await p.getByRole('button',{name:'Open navigation'}).click();assert(await p.locator('dialog').isVisible());await p.keyboard.press('Escape');assert(!await p.locator('dialog').isVisible());
  }
  assert.match(await p.locator('.finale-links a').first().getAttribute('href'),/^mailto:bithun@ibithun.com/);
  assert(!requests.some(u=>/assets\/(sequences|images\/exploded)/.test(u)),'Legacy media requested');
  assert.deepEqual(errors,[]);report.cases.push({name,width,height,passed:true,frameRequests:requests.filter(u=>/studio\/(mobile|desktop)\/\d/.test(u)).length});
  console.log('PASS',name);await p.close();
 }
 await b.close();
}
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const requested=[];p.on('request',r=>requested.push(r.url()));
await p.goto(base,{waitUntil:'networkidle'});assert.equal(await p.locator('.travelling-car').isVisible(),false);
assert(requested.filter(u=>/studio\/(desktop|mobile)\/\d/.test(u)).length<=3,'Reduced motion must load only editorial stills');
assert(await p.locator('.reduced-assembly').isVisible());report.reducedMotion={passed:true,frameRequests:requested.filter(u=>/studio\/(desktop|mobile)\/\d/.test(u)).length};await p.close();
const f=await b.newPage({viewport:{width:1440,height:1000}});await f.route('**/assets/studio/desktop/*.webp',route=>route.abort());
await f.goto(base,{waitUntil:'networkidle'});await f.locator('.studio-recovery').first().waitFor({state:'visible'});await ready(f);
await f.unroute('**/assets/studio/desktop/*.webp');await f.locator('.studio-recovery button').first().evaluate(e=>e.click());
await f.locator('.studio-recovery').first().waitFor({state:'hidden'});await seek(f,'engineering',.5);await frame(f,912);report.recovery={passed:true};
await f.setViewportSize({width:390,height:844});await seek(f,'engineering',.5);await frame(f,912);await noOverflow(f);
await f.close();await b.close();
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
