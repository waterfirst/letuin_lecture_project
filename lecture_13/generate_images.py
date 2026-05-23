#!/usr/bin/env python3
"""
Lecture 13 image generation script
Generates practice card images matching lecture 12 browser-mockup style
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np
import os
import shutil

PUBLIC_DIR = '/tmp/letuin_lecture_project/lecture_13/public'
DIST_DIR = '/tmp/letuin_lecture_project/lecture_13/dist'

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(DIST_DIR, exist_ok=True)

# Delete old large images
for old_file in ['data-automation-overview.png', 'lecture-13-data-automation.png',
                 'traditional-coding.png', 'vibe-coding.png']:
    for d in [PUBLIC_DIR, DIST_DIR]:
        p = os.path.join(d, old_file)
        if os.path.exists(p):
            os.remove(p)
            print(f"Deleted: {p}")


def practice_card(filename, step_num, title, url_text, steps, figsize=(7, 4.5)):
    """Create a browser-mockup practice card matching lecture 12 style."""
    fig, ax = plt.subplots(figsize=figsize, dpi=150)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # Browser window outline
    browser = FancyBboxPatch((0.3, 0.3), 9.4, 6.4,
                              boxstyle="round,pad=0.15",
                              facecolor='white', edgecolor='#d1d5db',
                              linewidth=1.5)
    ax.add_patch(browser)

    # Title bar background
    title_bar = FancyBboxPatch((0.3, 5.8), 9.4, 0.9,
                                boxstyle="round,pad=0.1",
                                facecolor='#f9fafb', edgecolor='#d1d5db',
                                linewidth=1)
    ax.add_patch(title_bar)

    # Traffic light dots
    for cx, color in [(0.8, '#ff5f57'), (1.15, '#febc2e'), (1.5, '#28c840')]:
        circle = plt.Circle((cx, 6.25), 0.12, color=color)
        ax.add_patch(circle)

    # URL bar
    url_bar = FancyBboxPatch((2.3, 6.0), 5.5, 0.5,
                              boxstyle="round,pad=0.08",
                              facecolor='white', edgecolor='#e5e7eb',
                              linewidth=1)
    ax.add_patch(url_bar)
    ax.text(5.05, 6.25, url_text, fontsize=9, ha='center', va='center',
            color='#6b7280', fontfamily='monospace')

    # Step number badge (red tag)
    badge = FancyBboxPatch((0.7, 5.05), 1.2, 0.55,
                            boxstyle="round,pad=0.08",
                            facecolor='#ef4444', edgecolor='none')
    ax.add_patch(badge)
    ax.text(1.3, 5.32, str(step_num), fontsize=14, ha='center', va='center',
            color='white', fontweight='bold')

    # Title next to badge
    ax.text(2.2, 5.32, title, fontsize=13, ha='left', va='center',
            color='#1f2937', fontweight='bold')

    # Steps list
    y_start = 4.5
    y_step = 0.7
    for i, step_text in enumerate(steps):
        y = y_start - i * y_step

        # Step number circle
        circle = plt.Circle((1.1, y), 0.22, facecolor='#fef2f2',
                            edgecolor='#fca5a5', linewidth=1)
        ax.add_patch(circle)
        ax.text(1.1, y, str(i + 1), fontsize=9, ha='center', va='center',
                color='#ef4444', fontweight='bold')

        # Step text - split into bold title and description if ' > ' separator exists
        if isinstance(step_text, tuple):
            ax.text(1.6, y + 0.08, step_text[0], fontsize=10, ha='left', va='center',
                    color='#1f2937', fontweight='bold')
            ax.text(1.6, y - 0.18, step_text[1], fontsize=8, ha='left', va='center',
                    color='#9ca3af')
        else:
            ax.text(1.6, y, step_text, fontsize=9.5, ha='left', va='center',
                    color='#1f2937', fontweight='bold')

    fig.tight_layout(pad=0.2)
    for d in [PUBLIC_DIR, DIST_DIR]:
        fig.savefig(os.path.join(d, filename), dpi=150, bbox_inches='tight',
                    facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"Created: {filename}")


def create_logo():
    """Create 6-step flow diagram: Antigravity -> app.py -> GitHub -> Streamlit Cloud -> URL"""
    fig, ax = plt.subplots(figsize=(7, 4.5), dpi=150)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 4)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    boxes = [
        ('1. Antigravity\nIDE', '#dbeafe', '#3b82f6'),
        ('2. app.py\n+req.txt', '#fce7f3', '#ec4899'),
        ('3. GitHub\nRepo', '#dcfce7', '#22c55e'),
        ('4. Upload\nFiles', '#fef9c3', '#eab308'),
        ('5. Streamlit\nCloud', '#fee2e2', '#ef4444'),
        ('6. Live\nURL', '#f3e8ff', '#a855f7'),
    ]

    box_w = 1.5
    gap = 0.5
    total_w = len(boxes) * box_w + (len(boxes) - 1) * gap
    x_start = (12 - total_w) / 2

    for i, (label, bg, text_color) in enumerate(boxes):
        x = x_start + i * (box_w + gap)
        rect = FancyBboxPatch((x, 1.2), box_w, 1.6,
                               boxstyle="round,pad=0.15",
                               facecolor=bg, edgecolor='#e5e7eb',
                               linewidth=1)
        ax.add_patch(rect)
        ax.text(x + box_w / 2, 2.0, label, fontsize=8.5, ha='center', va='center',
                color=text_color, fontweight='bold', linespacing=1.4)

        # Arrow between boxes (left to right)
        if i < len(boxes) - 1:
            ax.annotate('', xy=(x + box_w + gap * 0.85, 2.0),
                        xytext=(x + box_w + gap * 0.15, 2.0),
                        arrowprops=dict(arrowstyle='->', color='#9ca3af', lw=1.5))

    # Bottom caption
    ax.text(6, 0.5,
            'Antigravity IDE > app.py > GitHub > Streamlit Cloud > URL > Share',
            fontsize=8, ha='center', va='center', color='#9ca3af', style='italic')

    fig.tight_layout(pad=0.3)
    for d in [PUBLIC_DIR, DIST_DIR]:
        fig.savefig(os.path.join(d, 'logo.png'), dpi=150, bbox_inches='tight',
                    facecolor='white', edgecolor='none')
    plt.close(fig)
    print("Created: logo.png")


def create_comic():
    """Workshop card showing 4 field CSV examples"""
    fig, ax = plt.subplots(figsize=(7, 4.5), dpi=150)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # Title banner
    banner = FancyBboxPatch((0.5, 5.5), 9.0, 1.2,
                             boxstyle="round,pad=0.2",
                             facecolor='#7c3aed', edgecolor='none')
    ax.add_patch(banner)
    ax.text(5.0, 6.1, 'Workshop: 4 Field CSV Examples', fontsize=14,
            ha='center', va='center', color='white', fontweight='bold')

    # 4 field cards in 2x3 grid
    fields = [
        ('fab_yield.csv', 'Semiconductor', '#dbeafe', '#3b82f6'),
        ('panel_defect.csv', 'Display', '#fce7f3', '#ec4899'),
        ('battery_cycle.csv', 'Battery', '#fef9c3', '#eab308'),
        ('experiment.csv', 'Bio', '#dcfce7', '#22c55e'),
    ]

    positions = [(0.6, 2.8), (5.2, 2.8), (0.6, 0.5), (5.2, 0.5)]

    for (fname, label, bg, color), (x, y) in zip(fields, positions):
        card = FancyBboxPatch((x, y), 4.2, 2.1,
                               boxstyle="round,pad=0.15",
                               facecolor=bg, edgecolor='#e5e7eb',
                               linewidth=1)
        ax.add_patch(card)
        ax.text(x + 2.1, y + 1.4, fname, fontsize=10, ha='center', va='center',
                color=color, fontweight='bold')
        ax.text(x + 2.1, y + 0.7, label, fontsize=9, ha='center', va='center',
                color='#6b7280')

    fig.tight_layout(pad=0.3)
    for d in [PUBLIC_DIR, DIST_DIR]:
        fig.savefig(os.path.join(d, 'comic.png'), dpi=150, bbox_inches='tight',
                    facecolor='white', edgecolor='none')
    plt.close(fig)
    print("Created: comic.png")


# ============================================================================
# GENERATE ALL IMAGES
# ============================================================================

# Panel 1: Step 1 - Antigravity에서 앱 만들기
practice_card(
    'panel1.png',
    step_num=1,
    title='Antigravity > Streamlit App',
    url_text='antigravity.ai',
    steps=[
        ('Open Antigravity IDE', 'Access the AI coding environment'),
        ('Paste prompt', '"CSV analysis Streamlit app"'),
        ('AI generates app.py', 'CSV upload + chart + stats'),
        ('AI generates requirements.txt', 'streamlit / pandas / numpy'),
        ('Run locally: streamlit run app.py', 'Test on localhost:8501'),
    ]
)

# Panel 2: Step 2 - 파일 확인
practice_card(
    'panel2.png',
    step_num=2,
    title='Verify Files',
    url_text='localhost:8501',
    steps=[
        ('app.py created', 'CSV upload + chart + stats'),
        ('requirements.txt created', 'streamlit / pandas / numpy'),
        ('Open browser localhost:8501', 'Streamlit dev server'),
        ('Upload test CSV', 'Drag & drop CSV file'),
        ('Verify chart + anomaly detection', 'Check all features work'),
    ]
)

# Panel 3: Steps 3-4 - GitHub + Upload
practice_card(
    'panel3.png',
    step_num='3-4',
    title='GitHub + Upload',
    url_text='github.com',
    steps=[
        ('github.com > New repository', 'Create new repo'),
        ('Name: mfg-data-analyzer', 'Public repository'),
        ('Upload app.py + requirements.txt', 'Add file > Upload files'),
        ('Drag & drop both files', 'Select from local folder'),
        ('Commit changes', 'Save to repository'),
    ]
)

# Panel 4: Steps 5-6 - Streamlit Cloud
practice_card(
    'panel4.png',
    step_num='5-6',
    title='Streamlit Cloud Deploy',
    url_text='streamlit.io/cloud',
    steps=[
        ('streamlit.io/cloud > Sign in', 'Sign in with GitHub'),
        ('New app > select repo', 'mfg-data-analyzer'),
        ('Main file: app.py', 'Set main file path'),
        ('Deploy > wait 1-2 min', 'Building and deploying'),
        ('Share URL with team!', 'https://your-app.streamlit.app'),
    ]
)

# Logo: 6-step flow diagram
create_logo()

# Comic: Workshop card with 4 field CSV examples
create_comic()

print("\nAll images generated successfully!")
print(f"Public dir: {PUBLIC_DIR}")
print(f"Dist dir: {DIST_DIR}")
