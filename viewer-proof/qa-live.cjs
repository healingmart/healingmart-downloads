const {chromium}=require(require('path').join(process.env.TEMP,'hm3d-qa/node_modules/playwright'));const path=require('path'),fs=require('fs');
const url='https://healingmart-viewer-proof-lab-20261101.eternityland34.workers.dev/';
const cases=[['block.step',[40,30,20]],['cylinder.step',[20,20,30]],['inch-block.step',[25.4,50.8,76.2]],['open-surface.step',[20,30,0]],['assembly.step',null],['box.iges',null]];
(async()=>{
 for(const [browserName,exe] of [['Chrome','C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'],['Edge','C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe']]){
 const browser=await chromium.launch({executablePath:exe,headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 let failures=[],rows=[];page.on('pageerror',e=>failures.push(e.message));
 await page.goto(url,{waitUntil:'domcontentloaded'});
 for(const [file,dims] of cases){
  if(file.endsWith('.iges'))await page.locator('#upload').setInputFiles(path.join(__dirname,file));
  else await page.locator('[data-file="'+file+'"]').click();
  await page.waitForFunction(name=>window.__cadTestResult?.filename===name,file,{timeout:20000});
  let r=await page.evaluate(()=>window.__cadTestResult);
  let pixels=await page.locator('#viewport canvas').evaluate(c=>{const z=document.createElement('canvas');z.width=c.width;z.height=c.height;const ctx=z.getContext('2d');ctx.drawImage(c,0,0);let v=ctx.getImageData(0,0,z.width,z.height).data,count=0;for(let i=0;i<v.length;i+=40){if(Math.abs(v[i]-21)+Math.abs(v[i+1]-32)+Math.abs(v[i+2]-37)>90)count++}return count});
  let match=dims?[...dims].sort((a,b)=>a-b).every((e,i)=>Math.abs(e-[...r.dimsMm].sort((a,b)=>a-b)[i])<=.25):null;
  rows.push({file,pass:r.success===true&&pixels>100&&(match!==false),pixels,meshes:r.meshes,dimensionsMatch:match});
  if(file==='block.step')await page.screenshot({path:path.join(__dirname,'live-'+browserName.toLowerCase()+'-block.png')});
 }
 console.log('LIVE_BROWSER',browserName,JSON.stringify(rows),'PAGE_ERRORS',JSON.stringify(failures));
 await browser.close();
 }
})().catch(e=>{console.error('FAILED',e.stack);process.exit(1)});
