"""
8강 실습: 디스플레이 기술 Q&A 챗봇 (Gemini API)
Streamlit 앱 — 바로 실행 가능한 완성 코드

사전 준비:
    1. .env.example을 .env로 복사 후 API Key 입력
    2. pip install -r requirements.txt
    3. streamlit run gemini_chatbot.py

Gemini API Key 발급: https://aistudio.google.com
"""

import os
import streamlit as st
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """당신은 디스플레이 공정 전문가입니다.
OLED, LCD, TFT, 포토리소그래피, 드라이에치, 잉크젯 공정 등
디스플레이 제조 전반에 대해 취업준비생이 이해할 수 있는 수준으로 설명해주세요.
어려운 용어는 반드시 괄호 안에 간단한 설명을 추가하세요.
답변은 한국어로 작성하되, 전문 용어는 영어 원어도 병기하세요."""

# ------- 초기화 -------
def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        st.error("GEMINI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.")
        st.stop()
    return genai.Client(api_key=api_key)


# ------- UI -------
st.set_page_config(page_title="디스플레이 Q&A 챗봇", page_icon="🖥️", layout="centered")
st.title("🖥️ 디스플레이 기술 Q&A 챗봇")
st.caption("Gemini API 연동 — 디스플레이 공정 전문가에게 물어보세요")

if "messages" not in st.session_state:
    st.session_state.messages = []

# 이전 대화 표시
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# 사용자 입력
if prompt := st.chat_input("예: OLED 잉크젯 공정에서 커피링 효과란?"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Gemini가 답변 생성 중..."):
            client = get_gemini_client()
            # SDK 형식에 맞춰 이전 대화와 현재 질문을 함께 전달
            contents = [
                types.Content(
                    role="model" if m["role"] == "assistant" else "user",
                    parts=[types.Part(text=m["content"])],
                )
                for m in st.session_state.messages
            ]
            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.2,
                ),
            )
            answer = response.text
        st.write(answer)

    st.session_state.messages.append({"role": "assistant", "content": answer})

# 사이드바: 예시 질문
with st.sidebar:
    st.subheader("💡 예시 질문")
    examples = [
        "OLED와 LCD의 발광 방식 차이를 설명해줘",
        "포토리소그래피 공정 4단계를 순서대로 알려줘",
        "수율(Yield)이 낮아지는 주요 원인은?",
        "잉크젯 공정에서 커피링 효과를 해결하는 방법",
        "DCI-P3와 sRGB 색 재현율 차이",
    ]
    for ex in examples:
        if st.button(ex, use_container_width=True):
            st.session_state.messages.append({"role": "user", "content": ex})
            st.rerun()
