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
                        content = f.read()
                    
                    # Find all "wakad" not part of "Pune (Wakad)"
                    import re
                    # Find instances where wakad is not preceded by "Pune ("
                    matches = re.finditer(r'(?<!Pune \()wakad', content, re.IGNORECASE)
                    for match in matches:
                        # Print context
                        start = max(0, match.start() - 20)
                        end = min(len(content), match.end() + 20)
                        # Filter out common technical strings like data-id or class if they are not harmful
                        context = content[start:end].replace('\n', ' ')
                        if 'data-id' not in context and 'elementor-element' not in context:
                            print(f"Found non-standard Wakad in {file_path}: ...{context}...")
                except Exception as e:
                    pass

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    final_check(deploy_dir)
