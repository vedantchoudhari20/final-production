import os
import re

def fix_center_list_strings(directory):
    # Regex to catch the list ending with & Wakad or &amp; Wakad
    # and having Pune (Wakad) earlier.
    
    # Pattern 1: Pune (Wakad), ..., Uran City & Wakad
    pattern1 = re.compile(
        r'(Pune \(Wakad\)[^<]*?),\s*Ulwe,\s*Uran City\s*&\s*Wakad',
        re.IGNORECASE | re.DOTALL
    )
    
    # Pattern 2: Pune (Wakad), ..., Uran City &amp; Wakad
    pattern2 = re.compile(
        r'(Pune \(Wakad\)[^<]*?),\s*Ulwe,\s*Uran City\s*&amp;\s*Wakad',
        re.IGNORECASE | re.DOTALL
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
                    
                    new_content = pattern1.sub(r'\1, Ulwe, Uran City', content)
                    new_content = pattern2.sub(r'\1, Ulwe, Uran City', new_content)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed center list string in: {file_path}")
                except Exception as e:
                    pass

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    fix_center_list_strings(deploy_dir)
