"""
텔레그램 알림 모듈 (상급)
==========================
공정 이상 감지 시 팀 채널로 알림을 전송합니다.

기능:
  - 단일 센서 이상 알림
  - 전체 공정 현황 리포트
  - 이상 감지 요약 알림
  - 일일 보고서 전송

사용 방법:
  from utils.telegram_alert import TelegramAlert
  alert = TelegramAlert()
  alert.send_anomaly("EQ-01", "온도", 98.5, "위험")
"""

import os
import asyncio
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()


class TelegramAlert:
    """텔레그램 알림 클라이언트."""

    def __init__(self):
        self.token   = os.getenv("BOT_TOKEN", "")
        self.chat_id = os.getenv("CHAT_ID", "")
        self.enabled = bool(self.token and self.chat_id)

        if not self.enabled:
            print("[TelegramAlert] 토큰이 설정되지 않아 콘솔 출력 모드로 동작합니다.")

    def _send(self, message: str) -> bool:
        """비동기 전송을 동기적으로 실행합니다."""
        if not self.enabled:
            print(f"[TELEGRAM MOCK]\n{message}\n")
            return True
        try:
            return asyncio.run(self._async_send(message))
        except RuntimeError:
            # 이미 이벤트 루프가 실행 중인 경우 (Jupyter/Streamlit)
            loop = asyncio.new_event_loop()
            result = loop.run_until_complete(self._async_send(message))
            loop.close()
            return result

    async def _async_send(self, message: str) -> bool:
        """실제 텔레그램 API 호출."""
        try:
            from telegram import Bot
            bot = Bot(token=self.token)
            await bot.send_message(
                chat_id=self.chat_id,
                text=message,
                parse_mode="Markdown",
            )
            return True
        except Exception as e:
            print(f"[TelegramAlert 오류] {e}")
            return False

    def send_anomaly(
        self,
        equipment: str,
        sensor: str,
        value: float,
        status: str,
        unit: str = "",
    ) -> bool:
        """
        이상 감지 알림을 전송합니다.

        Args:
            equipment: 설비명 (예: "EQ-01")
            sensor:    센서명 (예: "온도")
            value:     측정값
            status:    상태 ("주의" 또는 "위험")
            unit:      단위 (예: "°C")
        """
        icon = "🚨" if status == "위험" else "⚠️"
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        msg = (
            f"{icon} *공정 이상 감지*\n\n"
            f"🏭 설비: `{equipment}`\n"
            f"📡 센서: {sensor}\n"
            f"📊 값: `{value}{unit}`\n"
            f"🔴 상태: *{status}*\n"
            f"🕐 시각: {ts}\n\n"
            f"_즉시 확인이 필요합니다._"
        )
        return self._send(msg)

    def send_status_report(self, equipment_status: dict) -> bool:
        """
        전체 설비 현황을 전송합니다.

        Args:
            equipment_status:
                {
                  "EQ-01": {"온도": (65.2, "정상"), "압력": (1.3, "주의")},
                  "EQ-02": {...},
                }
        """
        icon_map = {"정상": "✅", "주의": "⚠️", "위험": "🚨"}
        ts = datetime.now().strftime("%Y-%m-%d %H:%M")
        lines = [f"📊 *공정 현황 보고* ({ts})\n"]

        for eq, sensors in equipment_status.items():
            lines.append(f"*{eq}*")
            for sensor, (value, status) in sensors.items():
                lines.append(f"  {icon_map.get(status, '❓')} {sensor}: `{value}` — {status}")
            lines.append("")

        return self._send("\n".join(lines))

    def send_daily_report(self, summary: dict) -> bool:
        """
        일일 요약 보고서를 전송합니다.

        Args:
            summary: {
                "date": "2025-01-15",
                "total_alerts": 3,
                "avg_yield": 95.2,
                "anomaly_rate": 2.1,
                "top_issues": ["온도 이상 2건", "진동 이상 1건"],
            }
        """
        ts = summary.get("date", datetime.now().strftime("%Y-%m-%d"))
        total = summary.get("total_alerts", 0)
        yield_ = summary.get("avg_yield", 0)
        rate = summary.get("anomaly_rate", 0)
        issues = summary.get("top_issues", [])

        issue_text = "\n".join(f"  • {i}" for i in issues) if issues else "  • 없음"

        msg = (
            f"📅 *일일 공정 보고서* ({ts})\n\n"
            f"🔔 알림 발생: *{total}건*\n"
            f"📈 평균 수율: *{yield_:.1f}%*\n"
            f"⚠️ 이상 비율: *{rate:.1f}%*\n\n"
            f"📌 주요 이슈:\n{issue_text}"
        )
        return self._send(msg)

    def send_test_message(self) -> bool:
        """연결 테스트용 메시지를 전송합니다."""
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return self._send(
            f"✅ *텔레그램 알림 테스트*\n"
            f"🕐 {ts}\n"
            f"스마트 팩토리 모니터링 시스템이 정상적으로 연결되었습니다."
        )
