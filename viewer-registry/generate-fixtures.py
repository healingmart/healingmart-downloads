#!/usr/bin/env python3
"""HealingMart ORIGINAL fixtures: no third-party copied image/model content.
No license inference. Creates regression inputs, not pass claims.
Standard-library-only Python 3.10+. Run: python generate-fixtures.py
"""
from pathlib import Path
import hashlib, json, struct, wave, math, zlib, zipfile, tarfile, gzip, csv
from io import BytesIO

base=Path(__file__).resolve().parent
out=base/"generated-fixtures";out.mkdir(exist_ok=True)
cases=[]
def sha(b):return hashlib.sha256(b).hexdigest()
def register(name,category,extension,intent,expected,notes=""):
    b=(out/name).read_bytes()
    cases.append(dict(id=name,category=category,extension=extension,
        path="generated-fixtures/"+name,sha256=sha(b),size=len(b),expected=intent,
        properties=expected,origin="original HealingMart code",license="self_generated",
        redistribution_cleared=True,notes=notes,render_test_status="not_run"))
def chunk(kind,body):return struct.pack(">I",len(body))+kind+body+struct.pack(">I",zlib.crc32(kind+body)&0xffffffff)
width,height=96,64
rgba=bytes(channel for y in range(height) for x in range(width)
    for channel in ((15,167,158,255) if 10<x<85 and 10<y<55 else (0,0,0,0)))
raw=b"".join(b"\0"+rgba[y*width*4:(y+1)*width*4] for y in range(height))
png=b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",struct.pack(">IIBBBBB",width,height,8,6,0,0,0))+chunk(b"IDAT",zlib.compress(raw))+chunk(b"IEND",b"")
(out/"owned-alpha.png").write_bytes(png)
register("owned-alpha.png","image","png","accept",{"width":96,"height":64,"alpha":True})
(out/"owned-alpha-corrupt.png").write_bytes(b"not a PNG")
register("owned-alpha-corrupt.png","image","png","reject",{"reason":"header-invalid"})
svg='<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64"><rect width="96" height="64" fill="#0FA79E"/></svg>'
(out/"owned-shape.svg").write_text(svg,encoding="utf8")
register("owned-shape.svg","image","svg","accept",{"width":96,"height":64})
(out/"owned-script.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',encoding="utf8")
register("owned-script.svg","image","svg","reject",{"reason":"unsafe-active-content"}, "Must be sanitized or sandboxed")
(out/"owned-table.csv").write_text("item,count\nbox,2\nsphere,3\n",encoding="utf8")
register("owned-table.csv","data","csv","accept",{"rows":2,"columns":2})
(out/"owned-table.tsv").write_text("item\tcount\nbox\t2\nsphere\t3\n",encoding="utf8")
register("owned-table.tsv","data","tsv","accept",{"rows":2,"columns":2})
(out/"owned-data.json").write_text(json.dumps({"valid":True,"count":2}),encoding="utf8")
register("owned-data.json","data","json","accept",{"count":2})
(out/"owned-data-corrupt.json").write_text("{bad json:",encoding="utf8")
register("owned-data-corrupt.json","data","json","reject",{"reason":"syntax error"})
(out/"owned-readme.md").write_text("# Heading\n\n**Original text**, Korean: 안녕하세요.\n",encoding="utf8")
register("owned-readme.md","text","md","accept",{"headings":1})
(out/"owned-hello.txt").write_text("Hello\n안녕하세요\n",encoding="utf8")
register("owned-hello.txt","text","txt","accept",{"lines":2})
with wave.open(str(out/"owned-tone.wav"),"wb") as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(16000)
    w.writeframes(b"".join(struct.pack("<h",int(15000*math.sin(2*math.pi*440*i/16000))) for i in range(1600)))
register("owned-tone.wav","audio","wav","accept",{"channels":1,"sample_rate":16000,"frames":1600})
with zipfile.ZipFile(out/"owned-files.zip","w",zipfile.ZIP_DEFLATED) as z:
    z.write(out/"owned-hello.txt","root/hello.txt");z.write(out/"owned-data.json","root/data.json")
register("owned-files.zip","archive","zip","accept",{"files":2})
with zipfile.ZipFile(out/"owned-traversal.zip","w",zipfile.ZIP_DEFLATED) as z:
    z.writestr("../evil.txt","escape")
register("owned-traversal.zip","archive","zip","reject",{"reason":"zip-slip traversal"})
(out/"owned-truncated.zip").write_bytes(b"PK\x03\x04bad")
register("owned-truncated.zip","archive","zip","reject",{"reason":"truncated central directory"})
with tarfile.open(out/"owned-files.tar","w") as t:t.add(out/"owned-hello.txt",arcname="hello.txt")
register("owned-files.tar","archive","tar","accept",{"files":1})
with gzip.open(out/"owned-gzip.gz","wb") as g:g.write(b"hello\x0a")
register("owned-gzip.gz","archive","gz","accept",{"decompressed_sha256":sha(b"hello\x0a")})
ledger={"schema_version":"1.0","copyright":"Original HealingMart-owned synthetic fixtures",
"rights":"May be redistributed by HealingMart; data contains no copied third-party media",
"warning":"Do not count as viewer-rendered until target format decoder tests pass",
"cases":cases}
(base/"generated-fixtures-manifest.json").write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
print(json.dumps({"fixtures_created":len(cases),
  "positive":sum(c["expected"]=="accept" for c in cases),
  "negative":sum(c["expected"]=="reject" for c in cases)},ensure_ascii=False))
