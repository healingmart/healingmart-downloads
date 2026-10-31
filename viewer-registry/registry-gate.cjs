#!/usr/bin/env node
"use strict";
/* Viewer registry gate. Metadata validation is NOT a renderer test.
 * Fail closed: no source/license/fixtures/behavioural proof => no production approval.
 * Run: node registry-gate.cjs [--self-test] [--json]
 */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const ROOT = __dirname;
const input = JSON.parse(fs.readFileSync(path.join(ROOT,"engines.json"),"utf8"));
const fmt = JSON.parse(fs.readFileSync(path.join(ROOT,"formats.json"),"utf8"));
const fixt = fs.existsSync(path.join(ROOT,"fixtures.json")) ?
 JSON.parse(fs.readFileSync(path.join(ROOT,"fixtures.json"),"utf8")) : {cases:[]};
const permissible = new Set(["MIT","BSD-2-Clause","BSD-3-Clause","Apache-2.0","ISC","CC0-1.0"]);
const sha256 = s => crypto.createHash("sha256").update(s).digest("hex");
function evaluate(engine, format, examples, opts={}) {
 const reasons=[];
 if (!engine || !format) return {approved:false,reasons:["unknown engine or format"]};
 if (engine.policy === "excluded") reasons.push("engine excluded (paid/noncommercial)");
 if (!engine.upstream || !engine.license_evidence) reasons.push("missing upstream/license evidence");
 if (engine.policy !== "permissive" && engine.policy !== "conditional") reasons.push("license not in accepted class");
 if (engine.policy === "conditional" && !engine.source_offer_complete) reasons.push("conditional-license compliance/source offer incomplete");
 if (engine.policy === "permissive" && !permissible.has(engine.license)) reasons.push("unexpected SPDX license: "+engine.license);
 if (!engine.revision_pin || !/^[0-9A-Za-z._+-]+$/.test(engine.revision_pin)) reasons.push("version/commit not pinned");
 if (!/^[0-9a-f]{64}$/.test(engine.artifact_sha256||"")) reasons.push("published artifact SHA-256 not verified");
 for (const key of ["license_notice_packaged","dependency_sbom_verified","reference_tests_passed","security_tests_passed"]) if(engine[key] !== true) reasons.push("engine gate: "+key);
 for (const key of ["file_signature_verified","reference_output_comparison","malformed_input_test","memory_test","privacy_test","fixture_license_cleared","assertion_suite_complete"]) if(format[key]!==true)reasons.push("format gate: "+key);
 for (const key of ["browser_chrome","browser_edge","browser_firefox","browser_android","browser_ios"]) if(format[key]!=="pass") reasons.push("browser gate: "+key);
 if (format.stage !== "format_verified") reasons.push("not fully format-verified");
 if (format.commercial_production_approved !== true) reasons.push("format commercial approval absent");
 if (engine.release_allowed !== true) reasons.push("engine production release approval absent");
 const positives=examples.filter(x=>x.expected==="accept" && x.status==="pass");
 const negatives=examples.filter(x=>x.expected==="reject" && x.status==="pass");
 if (positives.length<3 || negatives.length<2) reasons.push("need >=3 passing positive and >=2 passing negative fixtures");
 for (const x of [...positives,...negatives]){
   if(!x.fixture_sha256 || !/^[a-f0-9]{64}$/.test(x.fixture_sha256))reasons.push("missing fixture SHA-256");
   if(!x.origin || !["self_generated","CC0-1.0","licensed_internal","CC-BY-4.0"].includes(x.license))reasons.push("missing permitted fixture provenance/license");
   if(x.license==="CC-BY-4.0" && !x.attribution)reasons.push("CC BY fixture missing attribution");
   if(x.redistributed === true && !x.redistribution_cleared)reasons.push("no permission to redistribute fixture");
   if(!x.render_evidence_sha256 || !/^[a-f0-9]{64}$/.test(x.render_evidence_sha256))reasons.push("missing output evidence hash");
 }
 return {approved:reasons.length===0,reasons:[...new Set(reasons)]};
}
function checkRegistry(){
 const errs=[],ids=new Set(),keys=new Set(),engineMap=new Map();
 for(const e of input.engines){
  if(ids.has(e.id))errs.push("duplicate engine id: "+e.id);ids.add(e.id);engineMap.set(e.id,e);
  if(!["permissive","conditional","excluded"].includes(e.policy))errs.push("invalid policy: "+e.id);
  if(e.policy==="excluded" && e.release_allowed)errs.push("EXCLUDED ENGINE MARKED SHIPPABLE: "+e.id);
 }
 const results=[];
 for(const f of fmt.formats){
  const key=f.category+":"+f.extension;
  if(keys.has(key))errs.push("duplicate category/extension: "+key);keys.add(key);
  if(!/^[a-z0-9.]{1,16}$/.test(f.extension))errs.push("invalid extension: "+key);
  if(!engineMap.has(f.engine_id))errs.push("unknown engine: "+key);
  const cases=fixt.cases.filter(x=>x.category===f.category && x.extension===f.extension);
  const gate=evaluate(engineMap.get(f.engine_id),f,cases);
  if(f.commercial_production_approved && !gate.approved)errs.push("UNSUPPORTED PRODUCTION CLAIM: "+key+" -> "+gate.reasons.join("; "));
  results.push({...f,can_ship:gate.approved,missing:gate.reasons.length});
 }
 const approved=results.filter(x=>x.can_ship).length;
 const summary={date:new Date().toISOString(),engines:input.engines.length,
   candidate_extensions:fmt.formats.length,
   sample_pass:results.filter(x=>x.stage==="representative_pass").length,
   isolated_proof:results.filter(x=>x.stage==="isolated_proof").length,
   production_approved:approved,
   unknown_or_candidate:results.filter(x=>x.stage==="candidate").length,
   checked_fixtures:fixt.cases.length,
   errors:errs,passed:errs.length===0};
 return summary;
}
function selfTest(){
 const failures=[];
 const baseE={policy:"permissive",license:"MIT",upstream:"https://example.com",license_evidence:"https://example.com/LICENSE",
  revision_pin:"a1b2c3",artifact_sha256:"a".repeat(64),license_notice_packaged:true,
  dependency_sbom_verified:true,reference_tests_passed:true,security_tests_passed:true,release_allowed:true};
 const baseF={stage:"format_verified",commercial_production_approved:true,file_signature_verified:true,
  reference_output_comparison:true,malformed_input_test:true,memory_test:true,privacy_test:true,
  fixture_license_cleared:true,assertion_suite_complete:true,
  browser_chrome:"pass",browser_edge:"pass",browser_firefox:"pass",browser_android:"pass",browser_ios:"pass"};
 const goodCase=(n,expect)=>({expected:expect,status:"pass",fixture_sha256:sha256("fixture"+n),
   origin:"Generated in project",license:"self_generated",redistributed:false,
   render_evidence_sha256:sha256("render"+n)});
 const goodFixtures=[0,1,2].map(n=>goodCase(n,"accept")).concat([3,4].map(n=>goodCase(n,"reject")));
 const scenarios=[
 ["good full packet",baseE,baseF,goodFixtures,true],
 ["paid engine", {...baseE,policy:"excluded"},baseF,goodFixtures,false],
 ["undocumented license", {...baseE,license_evidence:null},baseF,goodFixtures,false],
 ["missing notice",{...baseE,license_notice_packaged:false},baseF,goodFixtures,false],
 ["LGPL without source", {...baseE,policy:"conditional",license:"LGPL-2.1",source_offer_complete:false},baseF,goodFixtures,false],
 ["missing phone test",baseE,{...baseF,browser_ios:null},goodFixtures,false],
 ["candidate without verified stage",baseE,{...baseF,stage:"candidate"},goodFixtures,false],
 ["no negative fixtures",baseE,baseF,goodFixtures.filter(x=>x.expected==="accept"),false],
 ["unlicensed redistributed fixture",baseE,baseF,[{...goodFixtures[0],redistributed:true,redistribution_cleared:false},...goodFixtures.slice(1)],false]
 ];
 for(const [label,e,f,x,want] of scenarios){const got=evaluate(e,f,x).approved;if(got!==want)failures.push(label);}
 return {scenarios:scenarios.length,passed:scenarios.length-failures.length,failures};
}
const report=checkRegistry();
const self=process.argv.includes("--self-test")?selfTest():null;
if(process.argv.includes("--json"))console.log(JSON.stringify({registry:report,self_test:self},null,2));
else{
 console.log("VIEWER CANDIDATES",report.candidate_extensions,"ENGINES",report.engines,"PRODUCTION APPROVED",report.production_approved);
 console.log("REPRESENTATIVE PASS",report.sample_pass,"ISOLATED PROOF",report.isolated_proof,"CATALOG ERRORS",report.errors.length);
 if(self)console.log("SELF TEST",self.passed+"/"+self.scenarios);
 for(const e of report.errors)console.error("ERROR",e);
}
if(report.errors.length || (self&&self.failures.length))process.exitCode=1;
