import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const b=await chromium.launch();const report=[];
for(const [name,width,height,motion] of [['desktop',1440,1000,'reduce'],['phone',390,844,'reduce'],['exploded',1440,1000,'no-preference'],['phone-exploded',390,844,'no-preference']]){
 const context=await b.newContext({viewport:{width,height},reducedMotion:motion});const p=await context.newPage();await p.goto(process.env.BASE_URL||'http://localhost:3002',{waitUntil:'networkidle'});
 await p.locator('.reveal').evaluateAll(nodes=>nodes.forEach(e=>{e.style.opacity='1';e.style.transform='none';}));
 if(motion==='no-preference'){
  await p.locator('#engineering').evaluate(e=>window.scrollTo(0,e.offsetTop+(e.offsetHeight-innerHeight)*.5));
  await p.waitForFunction(()=>document.querySelector('.travelling-car')?.dataset.frame==='912');
  await p.locator('.part-annotations.visible').waitFor();
 }
 const r=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 report.push({name,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});await context.close();
}
await b.close();await fs.mkdir('analysis/studio-verification',{recursive:true});await fs.writeFile('analysis/studio-verification/accessibility.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.some(r=>r.violations.length))process.exitCode=1;
