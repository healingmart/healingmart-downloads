#!/usr/bin/env python3
"""Static verification of synthetic test files. NOT a viewer rendering certification."""
import json, hashlib, pathlib, struct, zipfile, gzip, wave, csv, tarfile, sys
from xml.etree import ElementTree as ET
root=pathlib.Path(__file__).resolve().parent
manifest=json.loads((root/'generated-fixtures-manifest.json').read_text(encoding='utf8'))
ok=0;errors=[];negative=0
def expect(condition,reason):
    if not condition:raise AssertionError(reason)
for item in manifest['cases']:
    p=root/item['path'];b=p.read_bytes();name=item['id'];expected=item['expected']
    try:
        expect(hashlib.sha256(b).hexdigest()==item['sha256'],'SHA-256 mismatch')
        expect(len(b)==item['size'],'wrong size')
        if name=='owned-alpha.png':
            expect(b.startswith(b'\x89PNG\r\n\x1a\n'),'PNG signature')
            expect(struct.unpack_from('>II',b,16)==(96,64),'PNG dimensions')
        elif name=='owned-alpha-corrupt.png':
            expect(not b.startswith(b'\x89PNG\r\n\x1a\n'),'bad PNG incorrectly accepted')
        elif name=='owned-shape.svg':
            expect(ET.fromstring(b).tag.endswith('svg'),'valid SVG')
        elif name=='owned-script.svg':
            e=ET.fromstring(b);expect(any(t.tag.endswith('script') for t in e.iter()),'active SVG fixture missing')
        elif name=='owned-table.csv':
            rows=list(csv.DictReader(p.open(encoding='utf8')));expect(len(rows)==2,'CSV rows')
        elif name=='owned-table.tsv':
            rows=list(csv.DictReader(p.open(encoding='utf8'),delimiter='\t'));expect(len(rows)==2,'TSV rows')
        elif name=='owned-data.json':
            expect(json.loads(b)['count']==2,'JSON content')
        elif name=='owned-data-corrupt.json':
            try:json.loads(b);raise AssertionError('invalid JSON unexpectedly accepted')
            except json.JSONDecodeError:pass
        elif name=='owned-tone.wav':
            with wave.open(str(p),'rb') as w:expect((w.getnchannels(),w.getframerate(),w.getnframes())==(1,16000,1600),'WAV metadata')
        elif name=='owned-files.zip':
            with zipfile.ZipFile(p) as z:
                expect(z.testzip() is None,'ZIP CRC')
                expect(len(z.namelist())==2,'ZIP file count')
        elif name=='owned-traversal.zip':
            with zipfile.ZipFile(p) as z:
                expect(any('..' in pathlib.PurePosixPath(n).parts for n in z.namelist()),'ZIP traversal fixture missing')
        elif name=='owned-truncated.zip':
            try:
                with zipfile.ZipFile(p):raise AssertionError('corrupt ZIP unexpectedly accepted')
            except zipfile.BadZipFile:pass
        elif name=='owned-files.tar':
            with tarfile.open(p) as t:expect(len(t.getmembers())==1,'TAR file count')
        elif name=='owned-gzip.gz':
            with gzip.open(p,'rb') as g:expect(hashlib.sha256(g.read()).hexdigest()==item['properties']['decompressed_sha256'],'GZIP bytes')
        # Other files verified by SHA-256; a real viewer needs visual comparison too.
        if expected=='reject':negative+=1
        ok+=1
    except Exception as e:errors.append({'file':name,'error':str(e)})
print(json.dumps({'checked':len(manifest['cases']),'integrity_pass':ok,'negative_inputs':negative,
 'viewer_visual_tests_run':0,'errors':errors},ensure_ascii=False))
if errors:sys.exit(1)
