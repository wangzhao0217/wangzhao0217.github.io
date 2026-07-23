#!/usr/bin/env python3
"""Add metadata-only entries for the two new papers that have no PDFs."""
import json, sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')

PAPER_DIR = Path('assets/paper_content')
INDEX = PAPER_DIR / 'researchstudio_index.json'

idx = json.loads(INDEX.read_text(encoding='utf-8'))
existing_dois = {e['doi'] for e in idx}

new_papers = [
    {
        'slug': 'bidirectional_charging_ev_solar',
        'doi': '10.1016/j.apenergy.2026.128478',
        'title': 'Bi-directional charging of electric vehicles for sustainable energy management with distributed solar generation',
        'authors': 'Shang, W.L., Chen, H., Cui, D., Wang, Z., Watling, D., Ochieng, W.',
        'venue': 'Applied Energy, 424, 128478 (2026)',
        'year': '2026',
        'keywords': ['electric vehicles', 'V2G', 'bidirectional charging', 'solar energy', 'energy management'],
        'domain': 'transport',
    },
    {
        'slug': 'v2x_community_online_discussions',
        'doi': '10.1016/j.tbs.2026',
        'title': 'What Technologically Proficient Communities Want from V2X: Transport-Environment Implications from Online Discussions',
        'authors': 'Havran, O., Watling, D., Chen, H., Shang, W.L., Liu, Y., Wang, C., Wang, Z., Cui, D., Jia, D.',
        'venue': 'Travel Behaviour and Society, 44 (2026)',
        'year': '2026',
        'keywords': ['V2X', 'vehicle-to-everything', 'online communities', 'transport environment', 'public opinion'],
        'domain': 'transport',
    },
]

for p in new_papers:
    if p['doi'] in existing_dois:
        print(f"Skip (exists): {p['doi']}")
        continue

    out_dir = PAPER_DIR / p['slug']
    out_dir.mkdir(parents=True, exist_ok=True)

    kw = ', '.join(p['keywords'])
    kw_tags = ' | '.join(f'`{k}`' for k in p['keywords'][:5])
    motivation = 'Evidence-based transport planning is essential for reducing carbon emissions, improving safety, and enabling sustainable mobility at scale.'

    spec = f"# {p['title']}\n\n## 1. Overview\n- **DOI**: {p['doi']}\n- **Authors**: {p['authors']}\n- **Venue**: {p['venue']}\n- **Year**: {p['year']}\n- **Keywords**: {kw}\n\n## 2. Problem Statement\nThis paper addresses challenges in transport-energy systems integration.\n\n## 3. Motivation\n{motivation}\n\n## 9. Takeaway\nSee full paper: https://doi.org/{p['doi']}\n"

    blog_en = f"# {p['title']}\n\n**{p['authors']}**  \n*{p['venue']}*  \nDOI: [{p['doi']}](https://doi.org/{p['doi']})\n\n{kw_tags}\n\n---\n\n## Overview\n\nThis paper explores {', '.join(p['keywords'][:3])} within the transport and energy domain.\n\n{motivation}\n\n---\n\n## Read More\n\nFull paper: [https://doi.org/{p['doi']}](https://doi.org/{p['doi']})\n"

    blog_zh = f"# {p['title']}\n\n**{p['authors']}**  \n*{p['venue']}*  \nDOI: [{p['doi']}](https://doi.org/{p['doi']})\n\n{kw_tags}\n\n---\n\n## 研究概述\n\n本文探讨了{'/'.join(p['keywords'][:3])}在交通与能源领域的交叉研究。\n\n基于证据的交通规划对于减少碳排放、提高安全性和实现大规模可持续出行至关重要。\n\n---\n\n## 阅读全文\n\n完整论文：[https://doi.org/{p['doi']}](https://doi.org/{p['doi']})\n"

    (out_dir / 'paper_spec.md').write_text(spec, encoding='utf-8')
    (out_dir / 'blog_en.md').write_text(blog_en, encoding='utf-8')
    (out_dir / 'blog_zh.md').write_text(blog_zh, encoding='utf-8')

    entry = {
        'slug': p['slug'],
        'title': p['title'],
        'doi': p['doi'],
        'authors': p['authors'],
        'venue': p['venue'],
        'year': p['year'],
        'keywords': p['keywords'],
        'domain': p['domain'],
        'pages': 0,
        'figures_count': 0,
        'captions_count': 0,
        'spec': f"assets/paper_content/{p['slug']}/paper_spec.md",
        'blog_en': f"assets/paper_content/{p['slug']}/blog_en.md",
        'blog_zh': f"assets/paper_content/{p['slug']}/blog_zh.md",
    }
    idx.append(entry)
    print(f"Added: {p['doi']}")

INDEX.write_text(json.dumps(idx, indent=2, ensure_ascii=False), encoding='utf-8')
print("Index updated. Total entries:", len(idx))
