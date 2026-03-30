
import os
import re

search_dir = r"c:\Users\Vedant\Downloads\thenurturingroots.com\deploy"
target_files = []

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.endswith(".html"):
            target_files.append(os.path.join(root, file))

def analyze_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    wakad_matches = re.findall(r'Wakad', content, re.IGNORECASE)
    pune_wakad_matches = re.findall(r'Pune\s*\(?Wakad\)?', content, re.IGNORECASE)
    
    if wakad_matches:
        print(f"File: {filepath}")
        print(f"  Total Wakad matches: {len(wakad_matches)}")
        print(f"  Pune (Wakad) specific matches: {len(re.findall(r'Pune\s*\(Wakad\)', content, re.IGNORECASE))}")
        # Print some context for just 'Wakad' not preceded by 'Pune'
        around = re.findall(r'(.{0,20})(?<!Pune\s)Wakad(.{0,20})', content, re.IGNORECASE)
        for pre, post in around[:5]:
            print(f"    Context: ...{pre}Wakad{post}...")

for f in target_files:
    analyze_file(f)
