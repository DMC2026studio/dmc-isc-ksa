from pathlib import Path
import re

n = 0
for p in Path(".").rglob("*.html"):
    t = p.read_text(encoding="utf-8")
    nt = re.sub(r"main\.css\?v=[^\"]+", "main.css?v=hexiq1", t)
    if nt != t:
        p.write_text(nt, encoding="utf-8")
        n += 1
print("updated", n)
