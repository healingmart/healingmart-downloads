const fs=require('fs'),path=require('path'),crypto=require('crypto');
const init=require('occt-import-js');
const cases=[
{file:'block.step',want:[40,30,20],label:'rectangular mm block'},
{file:'cylinder.step',want:[20,20,30],label:'10mm radius 30mm height'},
{file:'inch-block.step',want:[25.4,50.8,76.2],label:'inch to millimeter conversion'},
{file:'open-surface.step',want:[20,30,0],label:'planar surface'},
{file:'assembly.step',want:null,label:'multi body assembly'},
{file:'box.iges',want:null,label:'IGES sample geometry'}
];
(async()=>{
 const occt=await init();const report=[];
 for(const spec of cases){
  const bytes=fs.readFileSync(path.join(__dirname,spec.file));
  const result=spec.file.endsWith('.iges')?occt.ReadIgesFile(bytes,null):occt.ReadStepFile(bytes,null);
  let points=0,triangles=0;const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(const m of result.meshes||[]){
   const a=m.attributes?.position?.array||[];
   for(let i=0;i<a.length;i+=3){points++;for(let k=0;k<3;k++){min[k]=Math.min(min[k],a[i+k]);max[k]=Math.max(max[k],a[i+k])}}
   triangles+=(m.index?.array||[]).length/3;
  }
  const bbox=min.map((v,k)=>+(max[k]-v).toFixed(3)),sorted=[...bbox].sort((a,b)=>a-b);
  const expected=spec.want?[...spec.want].sort((a,b)=>a-b):null;
  const bboxMatch=expected?expected.every((v,k)=>Math.abs(v-sorted[k])<=.2):null;
  const output={file:spec.file,success:result.success,meshCount:result.meshes?.length||0,vertexCount:points,triangleCount:triangles,bboxMm:bbox,expectedDimsMm:spec.want,bboxMatch,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),status:result.success&&points>3&&triangles>0&&(bboxMatch!==false)?'geometry-pass':'failed'};
  report.push(output);console.log(JSON.stringify(output));
 }
 fs.writeFileSync(path.join(__dirname,'qa-cad-results.json'),JSON.stringify(report,null,2));
 console.log('TOTAL',report.filter(x=>x.status==='geometry-pass').length+'/'+report.length);
})().catch(e=>{console.error(e.stack);process.exit(1)});
