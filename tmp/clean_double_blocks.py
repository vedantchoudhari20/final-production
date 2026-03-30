import os
import re

def clean_double_wakad_blocks(directory):
    # This pattern matches the Wakad block in the contact list
    # It starts with <!-- Wakad --> and ends with the closing </li> of the phone number
    wakad_marker_pattern = re.compile(
        r'<!--\s*Wakad\s*-->.*?</li>\s*<li class="elementor-icon-list-item">.*?</li>',
        re.DOTALL
    )

    for root, dirs, files in os.walk(directory):
        if any(skip in root for skip in ['.git', '.vercel', 'node_modules']):
            continue
            
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # If both markers exist, or if "Pune (Wakad)" exists twice in the same list
                    if content.count('Pune (Wakad)') > 1:
                        # Specifically look for the <!-- Wakad --> comment block to remove it
                        # if there is already a <!-- Pune (Wakad) --> block
                        if '<!-- Pune (Wakad) -->' in content and '<!-- Wakad -->' in content:
                            new_content = wakad_marker_pattern.sub('', content)
                            if new_content != content:
                                with open(file_path, 'w', encoding='utf-8') as f:
                                    f.write(new_content)
                                print(f"Removed redundant Wakad block in: {file_path}")
                except Exception as e:
                    pass

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    clean_double_wakad_blocks(deploy_dir)
