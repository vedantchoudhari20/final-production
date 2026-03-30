import os
import re

def fix_redundant_wakad(directory):
    # Regex to catch the wakad-btn block
    # It starts with a div having class elementor-widget-button and data-id="wakad-btn"
    # and ends with the closing div of that widget.
    
    wakad_btn_pattern = re.compile(
        r'<div\s+class="elementor-element elementor-element-wakad-btn elementor-widget elementor-widget-button"\s+data-id="wakad-btn".*?</div>\s*</div>\s*</div>',
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
                    
                    # Check if "Pune (Wakad)" exists elsewhere in the file (specifically in the footer/locations area)
                    # For simplicity, if it exists twice, we remove the one with 'wakad-btn'
                    
                    if content.count('Pune (Wakad)') > 1:
                        new_content = wakad_btn_pattern.sub('', content)
                        if new_content != content:
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            print(f"Fixed redundancy in: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    fix_redundant_wakad(deploy_dir)
    
    # Also check the root index.html
    root_index = r"c:\Users\Vedant\Downloads\thenurturingroots.com\index.html"
    # Root index handled manually/specifically if needed, but the user showed screenshots of the deployed version mostly.
