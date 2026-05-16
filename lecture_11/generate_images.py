"""
Lecture 11 이미지 생성 스크립트
Gemini Imagen 3 또는 DALL-E 3를 사용하여 강의 자료 이미지를 생성합니다.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 이미지 저장 경로
PUBLIC_DIR = Path(__file__).parent / "public"
PUBLIC_DIR.mkdir(exist_ok=True)

# 생성할 이미지 목록과 프롬프트
IMAGE_PROMPTS = {
    "gemini-ecosystem.png": """
Create a modern tech ecosystem diagram showing 5 interconnected Google AI tools arranged in a pentagon:
1. Gemini Pro (center, blue robot icon with "Pro" badge)
2. NotebookLM (top right, green book/notebook icon)
3. AI Studio (right, yellow code/terminal icon)
4. Firebase (bottom right, orange cloud/flame icon)
5. Telegram Bot (bottom left, blue chat/telegram icon)

Connect them with curved arrows showing data flow.
Add small text labels under each icon with tool names.
Style: Clean, flat design, rounded icons, professional tech illustration.
Color scheme: Google brand colors (blue #4285F4, red #EA4335, yellow #FBBC04, green #34A853).
Background: White with subtle light blue gradient.
Size: 1200x800px, high resolution.
""",

    "api-key-workflow.png": """
Create a 3-step horizontal workflow diagram for API key setup:

Step 1 (Left): "Get API Key"
- Icon: Key with sparkles
- Visual: Google AI Studio interface screenshot mockup
- Arrow pointing right

Step 2 (Center): "Save to .env"
- Icon: Lock and document
- Visual: VSCode editor with .env file showing GEMINI_API_KEY=AIzaSy...
- Arrow pointing right

Step 3 (Right): "Call API"
- Icon: Code brackets with checkmark
- Visual: Python terminal showing successful API response
- Green success indicator

Style: Modern tech tutorial, clean UI mockup style, step numbers in circles.
Colors: Blue gradient background, white cards for each step.
Annotations with small text explaining each step.
Size: 1600x600px.
""",

    "notebooklm-demo.png": """
Create a UI mockup of NotebookLM in action:

Layout: Split screen vertical design

Left side (40%): Source documents panel
- 3 PDF thumbnails with academic paper icons
- Titles: "Battery Degradation Study", "NCM811 Research", "Li-ion Safety"
- Upload button at bottom

Right side (60%): Chat interface
- User question: "이 논문의 핵심 기여는 무엇인가요?"
- AI response with 3 bullet points
- Source citations at bottom: "출처: 논문 3페이지, Figure 2" with clickable link
- Small shield icon indicating "출처 기반 답변"

Style: Modern chat UI, Google Material Design, clean typography.
Colors: White background, green accent (#34A853) for AI responses.
Add subtle shadow effects for depth.
Size: 1400x900px.
""",

    "pricing-comparison.png": """
Create a modern comparison table/chart showing 3 AI models:

Models (columns):
1. Gemini Pro (highlighted with blue border)
2. Claude Pro
3. GPT-4 Pro

Comparison rows:
- Price: $20/mo (all same)
- Context: 1M tokens vs 200K vs 128K (bar chart visualization)
- Deep Research: ✓ full vs ✗ none vs △ limited
- Free API: ✓ 15 req/min vs ✗ none vs △ limited
- NotebookLM: ✓ yes vs ✗ no vs ✗ no
- Firebase: ✓ yes vs ✗ no vs ✗ no
- Overall Score: 95 vs 72 vs 68 (progress bar)

Highlight Gemini Pro column with blue background.
Add insight box at bottom: "Same price, 5x longer context, free API, full ecosystem"

Style: Modern data visualization, card-based layout, clean typography.
Colors: Google brand blue for Gemini, neutral gray for others.
Size: 1200x800px.
""",

    "firebase-setup.png": """
Create a 5-step vertical workflow for Firebase setup:

Step 1: Browser icon → "Firebase Console 접속" → Screenshot of firebase.google.com
Step 2: Folder+ icon → "Add Project" → Project name input field
Step 3: Terminal icon → "Firebase CLI 설치" → Command: npm install -g firebase-tools
Step 4: Key icon → "Firebase Login" → Command: firebase login with green checkmark
Step 5: Zap icon → "Firebase Init" → Command: firebase init hosting with success message

Each step in a rounded card with:
- Large icon on left
- Step number badge
- Title and description
- Expected output/result
- Estimated duration (e.g., "30초")

Connect steps with vertical arrows.

Style: Clean tutorial design, modern UI, step-by-step guide aesthetic.
Colors: Orange/red Firebase brand color (#EA4335) accents.
Background: Light gray gradient.
Size: 800x1600px (vertical).
""",

    "security-checklist.png": """
Create an infographic-style security checklist for API keys:

Title at top: "API Key 보안 체크리스트"

8 checklist items in 2 columns (4 each):

Column 1:
1. ✓ Lock icon: ".env 파일은 로컬에만 보관"
2. ✓ GitHub X icon: ".gitignore에 .env 추가"
3. ✓ Refresh icon: "노출 시 즉시 재발급"
4. ✓ Team icon: "팀원은 각자 발급"

Column 2:
5. ✓ Chart icon: "Google Cloud에서 사용량 모니터링"
6. ✓ Bell icon: "무료 할당량 초과 알림 설정"
7. ✓ Env icon: "프로덕션은 환경변수로 주입"
8. ✓ Shield icon: "Firebase Functions로 숨기기"

Each item has:
- Green checkmark
- Icon visualization
- Short text description

Bottom warning box: "⚠️ GitHub 커밋 절대 금지!"

Style: Infographic, clean icons, checklist format.
Colors: Green for checkmarks, red for warnings, blue accents.
Size: 1000x1200px.
""",
}


def generate_with_openai():
    """DALL-E 3 사용하여 이미지 생성"""
    try:
        from openai import OpenAI
        import requests

        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

        for filename, prompt in IMAGE_PROMPTS.items():
            print(f"\n생성 중: {filename}")
            print(f"프롬프트: {prompt[:100]}...")

            try:
                response = client.images.generate(
                    model="dall-e-3",
                    prompt=prompt,
                    size="1792x1024",
                    quality="hd",
                    n=1,
                )

                # 이미지 다운로드 및 저장
                image_url = response.data[0].url
                img_data = requests.get(image_url).content

                output_path = PUBLIC_DIR / filename
                with open(output_path, 'wb') as f:
                    f.write(img_data)

                print(f"✓ 저장 완료: {output_path}")

            except Exception as e:
                print(f"✗ 생성 실패: {filename} - {e}")

    except ImportError:
        print("❌ openai 패키지가 설치되지 않았습니다.")
        print("설치: pip install openai requests")
        return False

    return True


def generate_with_gemini():
    """Gemini Imagen 3 사용하여 이미지 생성"""
    try:
        import google.generativeai as genai

        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

        # Imagen 모델 (현재 Gemini API에서 이미지 생성 지원 여부 확인 필요)
        print("⚠️  Gemini Imagen 3는 아직 Python SDK에서 공개되지 않았을 수 있습니다.")
        print("    Google AI Studio에서 수동으로 생성하거나 DALL-E 3를 사용하세요.")

        # 대안: 프롬프트 출력
        print("\n📝 Google AI Studio에서 사용할 프롬프트:")
        for filename, prompt in IMAGE_PROMPTS.items():
            print(f"\n=== {filename} ===")
            print(prompt)
            print("-" * 80)

        return False

    except ImportError:
        print("❌ google-generativeai 패키지가 설치되지 않았습니다.")
        print("설치: pip install google-generativeai")
        return False


def main():
    print("=" * 80)
    print("Lecture 11 이미지 생성 스크립트")
    print("=" * 80)

    print("\n생성할 이미지 목록:")
    for i, filename in enumerate(IMAGE_PROMPTS.keys(), 1):
        print(f"  {i}. {filename}")

    print("\n선택하세요:")
    print("  1. DALL-E 3로 자동 생성 (OpenAI API Key 필요)")
    print("  2. Gemini Imagen 프롬프트 출력 (Google AI Studio 수동 생성용)")
    print("  3. 종료")

    choice = input("\n선택 (1/2/3): ").strip()

    if choice == "1":
        if not os.getenv('OPENAI_API_KEY'):
            print("\n❌ OPENAI_API_KEY가 .env 파일에 없습니다.")
            print("   .env 파일에 다음을 추가하세요:")
            print("   OPENAI_API_KEY=sk-...")
            return

        print("\n🎨 DALL-E 3로 이미지 생성 시작...")
        generate_with_openai()

    elif choice == "2":
        print("\n📝 Gemini Imagen 프롬프트 출력...")
        generate_with_gemini()

    else:
        print("\n종료합니다.")

    print("\n" + "=" * 80)
    print("완료! public/ 폴더를 확인하세요.")
    print("=" * 80)


if __name__ == "__main__":
    main()
