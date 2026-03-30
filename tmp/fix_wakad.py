
import os
import re

search_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com"

# Regex for the Wakad button block in footer (Redundant)
# Structure: <!-- Wakad --> <div ...wakad-btn...> ... </div> </div> </div>
wakad_footer_block = re.compile(r'<!-- Wakad -->\s*<div[^>]*wakad-btn[^>]*>.*?</div>\s*</div>\s*</div>', re.DOTALL)

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Could not read {filepath}: {e}")
        return False

    original_content = content

    # 1. Remove redundant footer button ONLY if "Pune (Wakad)" is already present in the file
    if 'Pune (Wakad)' in content:
        match = wakad_footer_block.search(content)
        if match:
            # Verify it's the one with text "Wakad"
            if 'Wakad</span>' in match.group(0) or '>Wakad<' in match.group(0):
                content = content.replace(match.group(0), '')
                print(f"  Removed redundant footer button in {os.path.basename(filepath)}")

    # 2. Sequential replacements to avoid double "Pune (Pune (Wakad))"
    # First, consolidate all variants of Pune Wakad to a temporary marker
    content = re.sub(r'Pune\s*\(?Wakad\)?', 'TEMP_PUNE_WAKAD', content, flags=re.IGNORECASE)
    
    # Now replace remaining standalone "Wakad" with "Pune (Wakad)"
    # We want to be careful not to replace it in URLs or class names if it's "wakad-btn" etc.
    # But user-facing text is usually like >Wakad< or "Wakad,"
    
    # Common text patterns:
    content = re.sub(r'>Wakad<', '>Pune (Wakad)<', content, flags=re.IGNORECASE)
    content = re.sub(r'>\s*Wakad\s*<', '>Pune (Wakad)<', content, flags=re.IGNORECASE)
    content = re.sub(r'The Nurturing Roots,?\s*Wakad', 'The Nurturing Roots, Pune (Wakad)', content, flags=re.IGNORECASE)
    content = re.sub(r'Wakad,?\s*Pune', 'Pune (Wakad)', content, flags=re.IGNORECASE) # Wakad, Pune -> Pune (Wakad)
    content = re.sub(r'<option[^>]*>Wakad</option>', '<option>Pune (Wakad)</option>', content, flags=re.IGNORECASE)
    
    # Specific address case if it wasn't caught
    content = re.sub(r'Manker Empire, Kaspate Wasti, Wakad,', 'Manker Empire, Kaspate Wasti, Pune (Wakad),', content, flags=re.IGNORECASE)

    # Finally, replace the temporary marker with the final form
    content = content.replace('TEMP_PUNE_WAKAD', 'Pune (Wakad)')

    if content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Could not write {filepath}: {e}")
    return False

count = 0
for root, dirs, files in os.walk(search_dir):
    # Skip .git, .vercel etc if they exist
    if any(ignore in root for ignore in ['.git', '.vercel', 'node_modules']):
        continue
    for file in files:
        if file.endswith(".html"):
            if process_file(os.path.join(root, file)):
                count += 1

print(f"\nSuccessfully updated {count} HTML files.")
