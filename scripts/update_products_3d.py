import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    image_line = match.group(0)
    start_pos = match.start()
    preceding = content[max(0, start_pos - 250):start_pos]
    slug_match = re.search(r"slug:\s*'([^']+)'", preceding)
    if slug_match:
        slug = slug_match.group(1)
        return f"{image_line}\n    animation3d: '/images/products/3d/{slug}-3d.webp',"
    return image_line

new_content = re.sub(r"image:\s*'[^']+',", replacer, content)

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated products.ts with animation3d paths successfully.")
