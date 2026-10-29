import {chromium,webkit} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://localhost:3002';
const report={base,cases:[]};await fs.mkdir('analysis/release',{recursive:true});
for(const engine of [chromium,webkit]){
 const browser=await engine.launch();
 for(const [width,height] of [[1440,1000],[390,844]]){
  const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/teaser',{waitUntil:'networkidle'});
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://demo-pagani.ibithun.com/teaser');
  assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),'https://demo-pagani.ibithun.com/teaser');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const video=page.locator('video');await page.waitForFunction(()=>document.querySelector('video').readyState>=1);
  const duration=await video.evaluate(v=>v.duration);assert(Math.abs(duration-18.7667)<.2);
  await video.evaluate(v=>v.play());await page.waitForFunction(()=>document.querySelector('video').currentTime>.4);await video.evaluate(v=>v.pause());
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  await page.screenshot({path:`analysis/release/${engine.name()}-${width}-teaser.png`});
  await page.goto(base,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');
  assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).href,'https://demo-pagani.ibithun.com/');
  await page.locator('#engineering').evaluate(e=>window.scrollTo(0,e.offsetTop+(e.offsetHeight-innerHeight)*.5));await page.waitForFunction(()=>document.querySelector('.travelling-car')?.dataset.frame==='912',null,{timeout:45000});
  assert.deepEqual(errors,[]);report.cases.push({engine:engine.name(),width,height,videoDuration:duration,videoPlayback:true,metadata:true,explosion:true,axeViolations:0});await context.close();
 }
 await browser.close();
}
await fs.writeFile('analysis/release/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
