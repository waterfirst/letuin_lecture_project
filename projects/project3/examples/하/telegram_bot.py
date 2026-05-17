"""
텔레그램 알림 모듈
==================
설치:
  pip install python-telegram-bot python-dotenv

사용 방법:
  1. .env 파일에 BOT_TOKEN, CHAT_ID를 설정하세요.
  2. 직접 실행: python telegram_bot.py
  3. app.py에서 import해서 사용:
       from telegram_bot import send_alert

봇 토큰 얻는 방법:
  1. 텔레그램에서 @BotFather 를 찾아 /newbot 명령어 입력
  2. 봇 이름 설정 후 발급된 토큰을 복사
  3. 내 채팅 ID: @userinfobot 에게 /start 전송

"""

import os
import asyncio
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# ── 환경 변수에서 토큰과 채팅 ID를 읽어옵니다 ─────────────────────
BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
CHAT_ID   = os.getenv("CHAT_ID",   "YOUR_CHAT_ID_HERE")


async def _send(message: str) -> bool:
    """
    실제 텔레그램 API를 호출하는 비동기 함수.
    python-telegram-bot 라이브러리를 사용합니다.
    """
    try:
        from telegram import Bot
        bot = Bot(token=BOT_TOKEN)
        await bot.send_message(
            chat_id=CHAT_ID,
            text=message,
            parse_mode="Markdown",
        )
        return True
    except Exception as e:
        print(f"[텔레그램 오류] {e}")
        return False


def send_alert(sensor: str, value: float, status: str, unit: str = "") -> bool:
    """
    임계값 초과 시 텔레그램 메시지를 전송합니다.

    Args:
        sensor: 센서 이름 (예: "온도")
        value:  현재 측정값
        status: 상태 문자열 ("주의" 또는 "위험")
        unit:   단위 문자열 (예: "°C")

    Returns:
        True if sent successfully, False otherwise.

    사용 예시:
        send_alert("온도", 95.3, "위험", "°C")
    """
    icon = "🚨" if status == "위험" else "⚠️"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message = (
        f"{icon} *공정 알림 — {status}*\n\n"
        f"📍 센서: {sensor}\n"
        f"📊 측정값: `{value}{unit}`\n"
        f"🔴 상태: {status}\n"
        f"🕐 시각: {timestamp}\n\n"
        f"_즉시 확인이 필요합니다._"
    )
    return asyncio.run(_send(message))


def send_status_report(sensor_data: dict) -> bool:
    """
    전체 센서 상태를 요약해서 전송합니다.

    Args:
        sensor_data: {"온도": (55.2, "정상"), "압력": (1.3, "주의"), ...}
                     각 센서의 (값, 상태) 튜플을 담은 딕셔너리

    사용 예시:
        send_status_report({
            "온도":  (55.2, "정상"),
            "압력":  (1.3,  "주의"),
            "습도":  (45.0, "정상"),
            "진동":  (2.1,  "주의"),
        })
    """
    icon_map = {"정상": "✅", "주의": "⚠️", "위험": "🚨"}
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [f"📊 *공정 현황 보고*", f"🕐 {timestamp}\n"]
    for sensor, (value, status) in sensor_data.items():
        lines.append(f"{icon_map[status]} {sensor}: `{value}` — {status}")

    return asyncio.run(_send("\n".join(lines)))


# ── 직접 실행 테스트 ──────────────────────────────────────────────
if __name__ == "__main__":
    print("텔레그램 알림 테스트를 시작합니다...")

    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("[경고] BOT_TOKEN이 설정되지 않았습니다.")
        print("       .env 파일에 BOT_TOKEN과 CHAT_ID를 입력하세요.\n")
        print("─── 전송될 메시지 미리보기 ───")
        import json
        preview = {
            "sensor": "온도",
            "value": 95.3,
            "status": "위험",
            "unit": "°C"
        }
        print(json.dumps(preview, ensure_ascii=False, indent=2))
    else:
        # 실제 테스트 전송
        success = send_alert("온도", 95.3, "위험", "°C")
        if success:
            print("테스트 메시지 전송 완료!")
        else:
            print("전송 실패. BOT_TOKEN과 CHAT_ID를 확인하세요.")
