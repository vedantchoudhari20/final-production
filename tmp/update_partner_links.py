import os
import re

def update_partner_link(file_path):
    if not os.path.exists(file_path):
        return
    print(f"Processing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace any variant of become-a-partner with preschool-franchise
    # Handles both relative and absolute links
    new_content = re.sub(r'href="([^"]*?)become-a-partner/([^"]*?)"', r'href="\1preschool-franchise/\2"', content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated partner link in {file_path}")
    else:
        print(f"No changes needed for {file_path}")

# List of files identified by grep
files_to_update = [
    'index.html',
    'deploy/index.html',
    'gallery/index.html',
    'deploy/gallery/index.html',
    'our-centers/index.html',
    'deploy/our-centers/index.html',
    'best-day-care-centre-in-nerul-pune/index.html',
    'deploy/best-day-care-centre-in-nerul-pune/index.html',
    'school-detail/the-nurturing-roots-preschool-daycare/index.html',
    'deploy/school-detail/the-nurturing-roots-preschool-daycare/index.html',
    'school-detail/the-nurturing-roots-preschool3/index.html',
    'deploy/school-detail/the-nurturing-roots-preschool3/index.html',
    'thenurturingroots.com/index.html'
]

for f in files_to_update:
    update_partner_link(f)
