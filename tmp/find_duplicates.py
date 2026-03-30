import os
import re

def find_duplicates(directory):
    for root, dirs, files in os.walk(directory):
        if any(skip in root for skip in ['.git', '.vercel', 'node_modules']):
            continue
            
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                    
                    indices = [i for i, line in enumerate(lines) if "Pune (Wakad)" in line]
                    
                    # If any two indices are within 50 lines of each other, it might be a double button
                    for i in range(len(indices) - 1):
                        if indices[i+1] - indices[i] < 100:
                            print(f"Potential duplicate at {file_path}: lines {indices[i]+1} and {indices[i+1]+1}")
                            # Print the lines context
                            # print(lines[indices[i]])
                            # print(lines[indices[i+1]])
                except Exception as e:
                    pass

if __name__ == "__main__":
    deploy_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
    find_duplicates(deploy_dir)
