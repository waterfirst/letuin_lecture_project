import asyncio
import aiohttp
import base64
import os
import json
import time

API_KEY = os.environ["OPENAI_API_KEY"]
OUTPUT_DIR = "/tmp/letuin_lecture_project/project_images"

IMAGES = [
    ("p1_beginner.png", "A friendly beginner-level data analysis scene: a young engineer looking at a simple wafer map on a laptop screen, bright clean office, green accent colors, warm welcoming atmosphere, modern flat illustration style, no text"),
    ("p1_intermediate.png", "An intermediate-level semiconductor data visualization: engineer building interactive dashboard with colorful heatmaps and charts, dual monitors showing D3.js wafer maps, yellow accent colors, focused professional atmosphere, modern illustration, no text"),
    ("p1_advanced.png", "An advanced-level smart factory dashboard: multiple screens showing real-time wafer monitoring with Streamlit interface, red accent lighting, futuristic control room, complex data flowing, professional illustration, no text"),
    ("p2_beginner.png", "A beginner creating their first OLED data chart: simple boxplot and scatter plot on screen, colorful seaborn graphs, green desk lamp, encouraging learning environment, modern illustration, no text"),
    ("p2_intermediate.png", "Intermediate OLED process analysis: engineer comparing multiple statistical charts including heatmaps and Pareto charts, regression analysis on screen, yellow accent, analytical atmosphere, modern illustration, no text"),
    ("p2_advanced.png", "Advanced Quarto report creation: professional HTML report with embedded charts, code and analysis flowing together, red accent, publication-quality output on screen, modern illustration, no text"),
    ("p3_beginner.png", "Building first Telegram bot: smartphone showing alert notification from factory monitoring system, simple Streamlit dashboard in background, green accent, excited beginner engineer, modern illustration, no text"),
    ("p3_intermediate.png", "AI-powered process advisor: Gemini AI analyzing factory data, automatic report generation, Telegram sending summary, yellow accent, smart automation concept, modern illustration, no text"),
    ("p3_advanced.png", "Smart factory integrated platform: multiple dashboards, real-time monitoring, AI analysis, Telegram alerts, GitHub deployment, red accent, futuristic engineering portfolio, modern illustration, no text"),
]

URL = "https://api.openai.com/v1/images/generations"

semaphore = asyncio.Semaphore(3)

async def generate_image(session, filename, prompt, index):
    async with semaphore:
        payload = {
            "model": "gpt-image-1",
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024",
            "output_format": "png",
        }
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        }
        print(f"[{index+1}/9] Generating {filename}...")
        start = time.time()
        for attempt in range(3):
            try:
                async with session.post(URL, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=120)) as resp:
                    if resp.status == 429:
                        wait = 15 * (attempt + 1)
                        print(f"  Rate limited on {filename}, waiting {wait}s...")
                        await asyncio.sleep(wait)
                        continue
                    body = await resp.json()
                    if resp.status != 200:
                        print(f"  Error {resp.status} for {filename}: {body.get('error', {}).get('message', body)}")
                        if attempt < 2:
                            await asyncio.sleep(10)
                            continue
                        return filename, False
                    b64_data = body["data"][0].get("b64_json") or body["data"][0].get("b64")
                    filepath = os.path.join(OUTPUT_DIR, filename)
                    with open(filepath, "wb") as f:
                        f.write(base64.b64decode(b64_data))
                    elapsed = time.time() - start
                    size_kb = os.path.getsize(filepath) / 1024
                    print(f"  Done {filename} ({elapsed:.1f}s, {size_kb:.0f} KB)")
                    return filename, True
            except Exception as e:
                print(f"  Exception on {filename} attempt {attempt+1}: {e}")
                if attempt < 2:
                    await asyncio.sleep(10)
        return filename, False

async def main():
    print(f"Starting generation of {len(IMAGES)} images with gpt-image-1...")
    start = time.time()
    async with aiohttp.ClientSession() as session:
        tasks = [generate_image(session, fn, pr, i) for i, (fn, pr) in enumerate(IMAGES)]
        results = await asyncio.gather(*tasks)

    elapsed = time.time() - start
    print(f"\n{'='*50}")
    print(f"Total time: {elapsed:.1f}s")
    success = sum(1 for _, ok in results if ok)
    print(f"Success: {success}/{len(IMAGES)}")

    if any(not ok for _, ok in results):
        print("Failed:")
        for fn, ok in results:
            if not ok:
                print(f"  - {fn}")

if __name__ == "__main__":
    asyncio.run(main())
