import os

def final_check(directory):
    for root, dirs, files in os.walk(directory):
        if any(skip in root for skip in ['.git', '.vercel', 'node_modules']):
            continue
            
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                    
                    for i, line in enumerate(lines):
                        # Find all "wakad" not part of "Pune (Wakad)"
                        import re
                        # Find instances where wakad is not preceded by "Pune ("
                        # and not followed by "-btn" or something technical if possible
                        matches = re.finditer(r'(?<!Pune \()wakad', line, re.IGNORECASE)
                        for match in matches:
                            # Filter out technical stuff
                            if 'data-id' not in line and 'elementor-element' not in line and 'class=' not in line:
                                print(f"L{i+1} in {file_path}: {line.strip()}")
                except Exception as e:
                    pass

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    final_check(deploy_dir)
