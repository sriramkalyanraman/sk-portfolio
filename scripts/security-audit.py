#!/usr/bin/env python3
"""Small dependency-free security lint for the static portfolio."""
from pathlib import Path
import re
import sys

ROOT = Path('.')
files = [p for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.parts]
html = [p for p in files if p.suffix.lower() in {'.html', '.htm'}]
js = [p for p in files if p.suffix.lower() == '.js']
issues = []

for path in html + js:
    text = path.read_text(errors='ignore')
    if re.search(r'(?i)\beval\s*\(|new\s+Function\s*\(', text):
        issues.append(f'{path}: dynamic code execution (eval/Function)')
    if re.search(r'(?i)document\.write\s*\(', text):
        issues.append(f'{path}: document.write detected')
    if re.search(r'(?i)innerHTML\s*=|insertAdjacentHTML\s*\(', text):
        issues.append(f'{path}: HTML injection sink detected')
    for url in re.findall(r'https?://[^\s\"\']+', text):
        if url.startswith('http://'):
            issues.append(f'{path}: insecure HTTP URL: {url}')

for path in html:
    text = path.read_text(errors='ignore')
    if not re.search(r'(?i)Content-Security-Policy', text):
        issues.append(f'{path}: Content-Security-Policy not declared')
    for match in re.finditer(r'<script\b([^>]*)>', text, re.I):
        attrs = match.group(1)
        if not re.search(r'\bsrc\s*=', attrs, re.I):
            issues.append(f'{path}: inline script detected; use an external script under CSP')
    for match in re.finditer(r'<a\b[^>]*target=[\"\']_blank[\"\'][^>]*>', text, re.I):
        tag = match.group(0)
        if not re.search(r'\brel=[\"\'][^\"\']*\bnoopener\b', tag, re.I):
            issues.append(f'{path}: target=_blank without rel=noopener')

secret_patterns = [
    r'AKIA[0-9A-Z]{16}',
    r'github_pat_[A-Za-z0-9_]{20,}',
    r'ghp_[A-Za-z0-9]{30,}',
    r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
]
for path in files:
    if path.stat().st_size > 1_000_000:
        continue
    text = path.read_text(errors='ignore')
    for pattern in secret_patterns:
        if re.search(pattern, text, re.I):
            issues.append(f'{path}: possible secret/private-key pattern')

if issues:
    print('Security audit findings:')
    print('\n'.join(f'- {item}' for item in issues))
    sys.exit(1)

print(f'Security audit passed: {len(html)} HTML and {len(js)} JS files checked.')
