from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET
from zipfile import ZIP_DEFLATED, ZipFile
import json
import html
import shutil


ROOT = Path(__file__).resolve().parents[1]
QUESTIONS_JSON = ROOT / "docs" / "preassessment_questions_50.json"
OUTPUT_XLSX = ROOT / "KDC_과정_사전평가_50문항_완성본.xlsx"
BACKUP_XLSX = ROOT / "KDC_과정_사전평가_50문항_완성본_원본백업.xlsx"
HTML_OUTPUT = ROOT / "docs" / "kdc_preassessment_50.html"

NS = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
ET.register_namespace("", NS["main"])


@dataclass
class QuestionRow:
    number: int
    category: str
    question: str
    option1: str
    option2: str
    option3: str
    option4: str
    answer: int
    explanation: str
    points: int

    @property
    def difficulty(self) -> str:
        return self.category.split("|", 1)[0].strip()

    @property
    def topic(self) -> str:
        if "|" not in self.category:
            return self.category.strip()
        return self.category.split("|", 1)[1].strip()


def col_to_name(index: int) -> str:
    result = ""
    while index:
        index, rem = divmod(index - 1, 26)
        result = chr(65 + rem) + result
    return result


def load_payload() -> tuple[dict[str, Any], list[QuestionRow]]:
    payload = json.loads(QUESTIONS_JSON.read_text(encoding="utf-8"))
    pools: dict[str, list[QuestionRow]] = {"쉬움": [], "중간": [], "어려움": []}
    for idx, item in enumerate(payload["questions"], start=1):
        options = item["options"]
        if len(options) != 4:
            raise ValueError(f"Question {idx} does not have exactly four options.")
        question = QuestionRow(
            number=idx,
            category=item["category"].strip(),
            question=item["question"].strip(),
            option1=options[0].strip(),
            option2=options[1].strip(),
            option3=options[2].strip(),
            option4=options[3].strip(),
            answer=int(item["answer"]),
            explanation=item["explanation"].strip(),
            points=int(item.get("points", 2)),
        )
        difficulty = question.difficulty
        if difficulty not in pools:
            raise ValueError(f"Unexpected difficulty bucket: {difficulty}")
        pools[difficulty].append(question)

    quotas = {"쉬움": 20, "중간": 25, "어려움": 5}
    for difficulty, quota in quotas.items():
        if len(pools[difficulty]) < quota:
            raise ValueError(f"Need at least {quota} questions for {difficulty}, found {len(pools[difficulty])}")

    questions: list[QuestionRow] = []
    for difficulty in ("쉬움", "중간", "어려움"):
        questions.extend(pools[difficulty][: quotas[difficulty]])

    for new_number, question in enumerate(questions, start=1):
        question.number = new_number

    return payload, questions


def inline_string(parent: ET.Element, ref: str, style: str, value: str) -> None:
    cell = ET.SubElement(parent, "c", {"r": ref, "s": style, "t": "inlineStr"})
    is_el = ET.SubElement(cell, "is")
    attrs: dict[str, str] = {}
    if value != value.strip() or "\n" in value:
        attrs["{http://www.w3.org/XML/1998/namespace}space"] = "preserve"
    t_el = ET.SubElement(is_el, "t", attrs)
    t_el.text = value


def number_cell(parent: ET.Element, ref: str, style: str, value: int) -> None:
    cell = ET.SubElement(parent, "c", {"r": ref, "s": style})
    ET.SubElement(cell, "v").text = str(value)


def build_sheet_xml(title: str, subtitle: str, headers: list[str], questions: list[QuestionRow]) -> bytes:
    worksheet = ET.Element("worksheet", {"xmlns": NS["main"]})
    ET.SubElement(worksheet, "dimension", {"ref": "A2:J54"})

    sheet_views = ET.SubElement(worksheet, "sheetViews")
    sheet_view = ET.SubElement(sheet_views, "sheetView", {"tabSelected": "1", "workbookViewId": "0"})
    ET.SubElement(sheet_view, "selection", {"activeCell": "C5", "sqref": "C5"})

    ET.SubElement(worksheet, "sheetFormatPr", {"defaultRowHeight": "18"})
    cols = ET.SubElement(worksheet, "cols")
    widths = [7, 24, 54, 28, 28, 28, 28, 8, 48, 8]
    for idx, width in enumerate(widths, start=1):
        ET.SubElement(cols, "col", {"min": str(idx), "max": str(idx), "width": str(width), "customWidth": "1"})

    sheet_data = ET.SubElement(worksheet, "sheetData")

    row2 = ET.SubElement(sheet_data, "row", {"r": "2", "ht": "28", "customHeight": "1"})
    inline_string(row2, "A2", "1", title)

    row3 = ET.SubElement(sheet_data, "row", {"r": "3", "ht": "22", "customHeight": "1"})
    inline_string(row3, "A3", "6", subtitle)

    row4 = ET.SubElement(sheet_data, "row", {"r": "4", "ht": "24", "customHeight": "1"})
    for idx, header in enumerate(headers, start=1):
        inline_string(row4, f"{col_to_name(idx)}4", "2", header)

    for row_idx, question in enumerate(questions, start=5):
        row = ET.SubElement(sheet_data, "row", {"r": str(row_idx), "ht": "66", "customHeight": "1"})
        number_cell(row, f"A{row_idx}", "3", question.number)
        inline_string(row, f"B{row_idx}", "4", question.category)
        inline_string(row, f"C{row_idx}", "5", question.question)
        inline_string(row, f"D{row_idx}", "5", question.option1)
        inline_string(row, f"E{row_idx}", "5", question.option2)
        inline_string(row, f"F{row_idx}", "5", question.option3)
        inline_string(row, f"G{row_idx}", "5", question.option4)
        number_cell(row, f"H{row_idx}", "3", question.answer)
        inline_string(row, f"I{row_idx}", "5", question.explanation)
        number_cell(row, f"J{row_idx}", "3", question.points)

    merge_cells = ET.SubElement(worksheet, "mergeCells", {"count": "2"})
    ET.SubElement(merge_cells, "mergeCell", {"ref": "A2:J2"})
    ET.SubElement(merge_cells, "mergeCell", {"ref": "A3:J3"})

    ET.SubElement(
        worksheet,
        "pageMargins",
        {
            "left": "0.4",
            "right": "0.4",
            "top": "0.75",
            "bottom": "0.75",
            "header": "0.3",
            "footer": "0.3"
        }
    )
    return ET.tostring(worksheet, encoding="utf-8", xml_declaration=True)


def build_styles_xml() -> bytes:
    xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="5">
    <font><sz val="11"/><name val="Malgun Gothic"/><family val="2"/></font>
    <font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="Malgun Gothic"/><family val="2"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Malgun Gothic"/><family val="2"/></font>
    <font><sz val="10"/><color rgb="FF5C6B73"/><name val="Malgun Gothic"/><family val="2"/></font>
    <font><b/><sz val="10"/><name val="Malgun Gothic"/><family val="2"/></font>
  </fonts>
  <fills count="5">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF0F4C5C"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1E6F5C"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF3F6F7"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFD9E2EC"/></left>
      <right style="thin"><color rgb="FFD9E2EC"/></right>
      <top style="thin"><color rgb="FFD9E2EC"/></top>
      <bottom style="thin"><color rgb="FFD9E2EC"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="7">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyBorder="1" applyFill="1" applyAlignment="1">
      <alignment horizontal="left" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1">
      <alignment horizontal="left" vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="left" vertical="center"/>
    </xf>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>
"""
    return xml.encode("utf-8")


def build_workbook_xml() -> bytes:
    xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <fileVersion appName="xl"/>
  <workbookPr defaultThemeVersion="164011"/>
  <bookViews>
    <workbookView xWindow="0" yWindow="0" windowWidth="28800" windowHeight="17100"/>
  </bookViews>
  <sheets>
    <sheet name="AI 사전진단 50문항" sheetId="1" r:id="rId1"/>
  </sheets>
  <calcPr calcId="191029"/>
</workbook>
"""
    return xml.encode("utf-8")


def build_content_types_xml() -> bytes:
    xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"""
    return xml.encode("utf-8")


def build_root_rels_xml() -> bytes:
    xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""
    return xml.encode("utf-8")


def build_workbook_rels_xml() -> bytes:
    xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
"""
    return xml.encode("utf-8")


def build_core_xml(title: str) -> bytes:
    now = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>{html.escape(title)}</dc:title>
  <dc:creator>OpenAI Codex</dc:creator>
  <cp:lastModifiedBy>OpenAI Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>
</cp:coreProperties>
"""
    return xml.encode("utf-8")


def build_app_xml() -> bytes:
    xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Excel</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>1</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="1" baseType="lpstr">
      <vt:lpstr>AI 사전진단 50문항</vt:lpstr>
    </vt:vector>
  </TitlesOfParts>
  <Company></Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0300</AppVersion>
</Properties>
"""
    return xml.encode("utf-8")


def ensure_backup() -> None:
    if BACKUP_XLSX.exists():
        return
    if OUTPUT_XLSX.exists():
        shutil.copy2(OUTPUT_XLSX, BACKUP_XLSX)


def rebuild_xlsx(title: str, subtitle: str, questions: list[QuestionRow]) -> None:
    headers = ["No.", "분류", "문제", "보기1", "보기2", "보기3", "보기4", "정답", "해설", "배점"]
    sheet_xml = build_sheet_xml(title, subtitle, headers, questions)
    with ZipFile(OUTPUT_XLSX, "w", ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", build_content_types_xml())
        zf.writestr("_rels/.rels", build_root_rels_xml())
        zf.writestr("docProps/app.xml", build_app_xml())
        zf.writestr("docProps/core.xml", build_core_xml(title))
        zf.writestr("xl/workbook.xml", build_workbook_xml())
        zf.writestr("xl/_rels/workbook.xml.rels", build_workbook_rels_xml())
        zf.writestr("xl/styles.xml", build_styles_xml())
        zf.writestr("xl/worksheets/sheet1.xml", sheet_xml)


def build_html(payload: dict[str, Any], questions: list[QuestionRow]) -> str:
    difficulty_counts: dict[str, int] = {}
    topic_counts: dict[str, int] = {}
    total_points = 0
    for question in questions:
        difficulty_counts[question.difficulty] = difficulty_counts.get(question.difficulty, 0) + 1
        topic_counts[question.topic] = topic_counts.get(question.topic, 0) + 1
        total_points += question.points

    rows_html = []
    for question in questions:
        searchable = " ".join(
            [
                question.difficulty,
                question.topic,
                question.category,
                question.question,
                question.option1,
                question.option2,
                question.option3,
                question.option4,
            ]
        )
        rows_html.append(
            f"""
            <tr data-difficulty="{html.escape(question.difficulty)}" data-topic="{html.escape(question.topic)}" data-search="{html.escape(searchable)}">
              <td class="num">{question.number}</td>
              <td><span class="pill difficulty">{html.escape(question.difficulty)}</span><span class="topic-tag">{html.escape(question.topic)}</span></td>
              <td class="question-cell">{html.escape(question.question)}</td>
              <td class="options-cell">
                <ol>
                  <li>{html.escape(question.option1)}</li>
                  <li>{html.escape(question.option2)}</li>
                  <li>{html.escape(question.option3)}</li>
                  <li>{html.escape(question.option4)}</li>
                </ol>
              </td>
              <td class="answer revealable">{question.answer}</td>
              <td class="explanation-cell revealable">{html.escape(question.explanation)}</td>
              <td class="points">{question.points}</td>
            </tr>
            """
        )

    topic_buttons = "".join(
        f'<button class="filter-chip" data-topic="{html.escape(topic)}">{html.escape(topic)} <strong>{count}</strong></button>'
        for topic, count in sorted(topic_counts.items())
    )

    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(payload["title"])}</title>
  <style>
    :root {{
      --bg: #f6f2e9;
      --ink: #172026;
      --muted: #58656d;
      --panel: rgba(255,255,255,0.86);
      --line: rgba(23,32,38,0.10);
      --accent: #cc6b3e;
      --accent-strong: #8d4122;
      --teal: #0f4c5c;
      --teal-soft: #1e6f5c;
      --sand: #faf3e3;
      --shadow: 0 18px 50px rgba(23,32,38,0.12);
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: "Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at top left, rgba(204,107,62,0.20), transparent 28%),
        radial-gradient(circle at right 20%, rgba(15,76,92,0.16), transparent 30%),
        linear-gradient(180deg, #f7f3eb 0%, #ece5d8 100%);
      min-height: 100vh;
    }}
    body::before {{
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px);
      background-size: 28px 28px;
      mask-image: linear-gradient(180deg, rgba(0,0,0,0.36), transparent 82%);
    }}
    .shell {{
      width: min(1420px, calc(100% - 32px));
      margin: 24px auto 40px;
    }}
    .hero {{
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(15,76,92,0.97), rgba(30,111,92,0.95));
      color: white;
      border-radius: 28px;
      padding: 34px 32px 28px;
      box-shadow: var(--shadow);
    }}
    .hero::after {{
      content: "";
      position: absolute;
      inset: auto -70px -90px auto;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
    }}
    .eyebrow {{
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.12);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.8rem;
      margin-bottom: 16px;
    }}
    h1 {{
      margin: 0;
      font-size: clamp(2rem, 4vw, 3.35rem);
      line-height: 1.08;
      max-width: 980px;
    }}
    .hero p {{
      max-width: 900px;
      font-size: 1rem;
      line-height: 1.72;
      opacity: 0.92;
      margin: 14px 0 0;
    }}
    .meta {{
      margin-top: 14px;
      font-size: 0.92rem;
      opacity: 0.86;
    }}
    .stats {{
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-top: 24px;
    }}
    .stat {{
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 18px;
      padding: 16px 18px;
      backdrop-filter: blur(10px);
      transform: translateY(10px);
      opacity: 0;
      animation: rise 0.7s ease forwards;
    }}
    .stat:nth-child(2) {{ animation-delay: 0.08s; }}
    .stat:nth-child(3) {{ animation-delay: 0.16s; }}
    .stat:nth-child(4) {{ animation-delay: 0.24s; }}
    .stat strong {{
      display: block;
      font-size: 1.6rem;
      margin-bottom: 4px;
    }}
    .panel {{
      background: var(--panel);
      border: 1px solid rgba(255,255,255,0.5);
      border-radius: 24px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(12px);
    }}
    .controls {{
      margin-top: 18px;
      padding: 22px;
    }}
    .unlock-panel {{
      margin-top: 16px;
      padding: 16px 18px;
      border-radius: 18px;
      background: rgba(15,76,92,0.06);
      border: 1px solid rgba(15,76,92,0.10);
    }}
    .unlock-grid {{
      display: grid;
      grid-template-columns: 1.1fr 160px 120px;
      gap: 12px;
      align-items: end;
    }}
    .unlock-help {{
      font-size: 0.9rem;
      color: var(--muted);
      line-height: 1.5;
    }}
    .unlock-actions {{
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;
    }}
    .action-btn {{
      border: 1px solid rgba(15,76,92,0.16);
      background: var(--teal);
      color: white;
      border-radius: 14px;
      padding: 12px 14px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }}
    .action-btn.secondary {{
      background: rgba(255,255,255,0.8);
      color: var(--teal);
    }}
    .unlock-status {{
      font-size: 0.92rem;
      color: var(--muted);
      min-height: 1.4em;
    }}
    .controls-grid {{
      display: grid;
      grid-template-columns: 1.4fr 0.8fr 0.8fr;
      gap: 12px;
      align-items: start;
    }}
    label {{
      display: block;
      font-size: 0.92rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--teal);
    }}
    input, select {{
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 13px 14px;
      background: rgba(255,255,255,0.92);
      font: inherit;
      color: var(--ink);
    }}
    .chip-row {{
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }}
    .filter-chip {{
      border: 1px solid rgba(15,76,92,0.15);
      background: var(--sand);
      color: var(--teal);
      border-radius: 999px;
      padding: 10px 14px;
      font: inherit;
      cursor: pointer;
      transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease;
    }}
    .filter-chip:hover, .filter-chip.active {{
      transform: translateY(-2px);
      background: var(--teal);
      color: white;
    }}
    .table-wrap {{
      margin-top: 18px;
      overflow: hidden;
    }}
    .table-head {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 20px 22px 0;
    }}
    .table-head h2 {{
      margin: 0;
      font-size: 1.2rem;
    }}
    .table-head .count {{
      color: var(--muted);
      font-weight: 700;
    }}
    .scroll {{
      overflow: auto;
      padding: 18px 22px 22px;
    }}
    table {{
      width: 100%;
      min-width: 1120px;
      border-collapse: separate;
      border-spacing: 0;
      background: rgba(255,255,255,0.62);
      border: 1px solid rgba(15,76,92,0.10);
      border-radius: 18px;
      overflow: hidden;
    }}
    thead th {{
      position: sticky;
      top: 0;
      background: #f0ede6;
      color: var(--teal);
      text-align: left;
      font-size: 0.9rem;
      z-index: 1;
    }}
    th, td {{
      padding: 14px 12px;
      border-bottom: 1px solid rgba(15,76,92,0.09);
      vertical-align: top;
      line-height: 1.56;
    }}
    tbody tr {{
      transition: background 0.16s ease;
    }}
    tbody tr:hover {{
      background: rgba(204,107,62,0.08);
    }}
    tbody tr:last-child td {{
      border-bottom: none;
    }}
    .num, .answer, .points {{
      text-align: center;
      font-weight: 700;
      white-space: nowrap;
    }}
    .pill {{
      display: inline-flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(204,107,62,0.12);
      color: var(--accent-strong);
      font-size: 0.82rem;
      font-weight: 700;
      margin-right: 8px;
      margin-bottom: 8px;
    }}
    .topic-tag {{
      display: inline-block;
      color: var(--muted);
      font-size: 0.88rem;
      font-weight: 700;
    }}
    .question-cell {{
      min-width: 340px;
      font-weight: 600;
    }}
    .revealable {{
      transition: filter 0.2s ease, opacity 0.2s ease, color 0.2s ease;
    }}
    body.answers-locked .revealable {{
      color: transparent;
      text-shadow: 0 0 10px rgba(23,32,38,0.55);
      user-select: none;
      filter: blur(4px);
    }}
    body.answers-locked .revealable::selection {{
      background: transparent;
    }}
    body.answers-locked th.revealable-head {{
      color: rgba(15,76,92,0.38);
    }}
    .options-cell ol {{
      margin: 0;
      padding-left: 20px;
    }}
    .options-cell li + li {{
      margin-top: 6px;
    }}
    .footer-note {{
      color: var(--muted);
      font-size: 0.92rem;
      margin-top: 14px;
      padding: 0 4px;
    }}
    @keyframes rise {{
      to {{
        transform: translateY(0);
        opacity: 1;
      }}
    }}
    @media (max-width: 960px) {{
      .shell {{
        width: min(100% - 18px, 100%);
        margin-top: 10px;
      }}
      .hero {{
        padding: 26px 20px 22px;
        border-radius: 22px;
      }}
      .stats, .controls-grid, .unlock-grid {{
        grid-template-columns: 1fr;
      }}
      .controls, .scroll {{
        padding-left: 16px;
        padding-right: 16px;
      }}
    }}
  </style>
</head>
<body>
  <div class="shell">
    <section class="hero">
      <span class="eyebrow">KDC AI Pretest</span>
      <h1>{html.escape(payload["title"])}</h1>
      <p>{html.escape(payload["subtitle"])}</p>
      <div class="meta">업데이트: {html.escape(payload["updated_at"])} · {html.escape(payload["latest_note"])}</div>
      <div class="stats">
        <div class="stat"><strong>{len(questions)}문항</strong><span>총 배점 {total_points}점</span></div>
        <div class="stat"><strong>{difficulty_counts.get("쉬움", 0)}</strong><span>쉬움</span></div>
        <div class="stat"><strong>{difficulty_counts.get("중간", 0)}</strong><span>중간</span></div>
        <div class="stat"><strong>{difficulty_counts.get("어려움", 0)}</strong><span>어려움</span></div>
      </div>
    </section>

    <section class="panel controls">
      <div class="controls-grid">
        <div>
          <label for="searchBox">문항 검색</label>
          <input id="searchBox" type="search" placeholder="문제, 보기, 분류 키워드 검색">
        </div>
        <div>
          <label for="difficultyFilter">난이도</label>
          <select id="difficultyFilter">
            <option value="전체">전체</option>
            <option value="쉬움">쉬움</option>
            <option value="중간">중간</option>
            <option value="어려움">어려움</option>
          </select>
        </div>
        <div>
          <label for="topicFilter">주제</label>
          <select id="topicFilter">
            <option value="전체">전체</option>
            {''.join(f'<option value="{html.escape(topic)}">{html.escape(topic)}</option>' for topic in sorted(topic_counts))}
          </select>
        </div>
      </div>
      <div class="unlock-panel">
        <div class="unlock-grid">
          <div>
            <label for="answerKey">정답·해설 보기</label>
            <div class="unlock-help">기본 상태에서는 정답과 해설이 가려집니다. 비밀번호를 입력하면 전체 문항의 정답과 해설을 볼 수 있습니다.</div>
          </div>
          <div>
            <label for="answerKey">비밀번호</label>
            <input id="answerKey" type="password" inputmode="numeric" maxlength="4" placeholder="">
          </div>
          <div>
            <button id="unlockButton" class="action-btn" type="button">정답 열기</button>
          </div>
        </div>
        <div class="unlock-actions">
          <button id="lockButton" class="action-btn secondary" type="button">다시 가리기</button>
          <span id="unlockStatus" class="unlock-status">현재 정답과 해설이 가려져 있습니다.</span>
        </div>
      </div>
      <div class="chip-row">
        <button class="filter-chip active" data-topic="전체">전체 <strong>{len(questions)}</strong></button>
        {topic_buttons}
      </div>
    </section>

    <section class="panel table-wrap">
      <div class="table-head">
        <h2>문항 목록</h2>
        <div class="count" id="visibleCount">{len(questions)}개 문항 표시</div>
      </div>
      <div class="scroll">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>분류</th>
              <th>문제</th>
              <th>보기</th>
              <th class="revealable-head">정답</th>
              <th class="revealable-head">해설</th>
              <th>배점</th>
            </tr>
          </thead>
          <tbody id="questionTable">
            {''.join(rows_html)}
          </tbody>
        </table>
      </div>
    </section>

    <p class="footer-note">이 페이지와 엑셀은 동일한 JSON 문항 데이터에서 함께 생성되며, 사전 상식 점검과 강의 전 진단에 맞춰 문항을 재구성했습니다.</p>
  </div>

  <script>
    document.body.classList.add("answers-locked");
    const searchBox = document.getElementById("searchBox");
    const difficultyFilter = document.getElementById("difficultyFilter");
    const topicFilter = document.getElementById("topicFilter");
    const visibleCount = document.getElementById("visibleCount");
    const answerKey = document.getElementById("answerKey");
    const unlockButton = document.getElementById("unlockButton");
    const lockButton = document.getElementById("lockButton");
    const unlockStatus = document.getElementById("unlockStatus");
    const rows = Array.from(document.querySelectorAll("#questionTable tr"));
    const chips = Array.from(document.querySelectorAll(".filter-chip"));
    const ANSWER_PASSWORD = "0000";

    function applyFilters() {{
      const query = searchBox.value.trim().toLowerCase();
      const difficulty = difficultyFilter.value;
      const topic = topicFilter.value;
      let shown = 0;

      rows.forEach((row) => {{
        const text = (row.dataset.search || row.innerText).toLowerCase();
        const matchQuery = !query || text.includes(query);
        const matchDifficulty = difficulty === "전체" || row.dataset.difficulty === difficulty;
        const matchTopic = topic === "전체" || row.dataset.topic === topic;
        const visible = matchQuery && matchDifficulty && matchTopic;
        row.style.display = visible ? "" : "none";
        if (visible) shown += 1;
      }});

      visibleCount.textContent = `${{shown}}개 문항 표시`;
    }}

    function setAnswerVisibility(unlocked) {{
      document.body.classList.toggle("answers-locked", !unlocked);
      document.body.classList.toggle("answers-unlocked", unlocked);
      unlockStatus.textContent = unlocked
        ? "정답과 해설이 표시되고 있습니다."
        : "현재 정답과 해설이 가려져 있습니다.";
    }}

    searchBox.addEventListener("input", applyFilters);
    difficultyFilter.addEventListener("change", applyFilters);
    topicFilter.addEventListener("change", applyFilters);
    unlockButton.addEventListener("click", () => {{
      if (answerKey.value === ANSWER_PASSWORD) {{
        setAnswerVisibility(true);
      }} else {{
        setAnswerVisibility(false);
        unlockStatus.textContent = "비밀번호가 올바르지 않습니다.";
      }}
    }});
    lockButton.addEventListener("click", () => {{
      answerKey.value = "";
      setAnswerVisibility(false);
    }});
    answerKey.addEventListener("keydown", (event) => {{
      if (event.key === "Enter") {{
        unlockButton.click();
      }}
    }});

    chips.forEach((chip) => {{
      chip.addEventListener("click", () => {{
        chips.forEach((item) => item.classList.remove("active"));
        chip.classList.add("active");
        topicFilter.value = chip.dataset.topic;
        applyFilters();
      }});
    }});
  </script>
</body>
</html>
"""


def validate_xlsx() -> None:
    with ZipFile(OUTPUT_XLSX) as zf:
        required = {
            "[Content_Types].xml",
            "_rels/.rels",
            "docProps/app.xml",
            "docProps/core.xml",
            "xl/workbook.xml",
            "xl/_rels/workbook.xml.rels",
            "xl/styles.xml",
            "xl/worksheets/sheet1.xml"
        }
        names = set(zf.namelist())
        missing = required - names
        if missing:
            raise ValueError(f"Missing XLSX entries: {sorted(missing)}")
        for name in required:
            ET.fromstring(zf.read(name))


def main() -> None:
    payload, questions = load_payload()
    ensure_backup()
    rebuild_xlsx(payload["title"], payload["subtitle"], questions)
    validate_xlsx()
    HTML_OUTPUT.write_text(build_html(payload, questions), encoding="utf-8")
    print(f"REPAIRED_XLSX={OUTPUT_XLSX}")
    print(f"BACKUP_XLSX={BACKUP_XLSX}")
    print(f"HTML_OUTPUT={HTML_OUTPUT}")
    print(f"QUESTION_SOURCE={QUESTIONS_JSON}")


if __name__ == "__main__":
    main()
