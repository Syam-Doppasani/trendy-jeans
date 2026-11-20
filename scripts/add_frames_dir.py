import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('animation3d: string;', 'animation3d: string;\n  framesDir: string;')

def repl(m):
    line = m.group(0)
    slug_match = re.search(r'/images/products/3d/([^/]+)-3d\.webp', line)
    if slug_match:
        slug = slug_match.group(1)
        return f"{line}\n    framesDir: '/images/products/3d/frames/{slug}',"
    return line

c = re.sub(r"animation3d:\s*'[^']+',", repl, c)

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated products.ts with framesDir successfully.')
