Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot

$lectures = @(
  @{
    Dir='lecture_11'; No='11'; Title='Gemini API 시작'; Accent=[System.Drawing.Color]::FromArgb(43, 109, 246)
    Steps=@('API Key 발급','Gemini 모델 선택','NotebookLM 자료화','Firebase 배포')
    Old='수동 검색과 복사'; New='Gemini API 자동화'
    Tokens=@('Key', 'Gemini', 'NotebookLM', 'Firebase')
  },
  @{
    Dir='lecture_12'; No='12'; Title='보안과 CI/CD'; Accent=[System.Drawing.Color]::FromArgb(15, 135, 92)
    Steps=@('Secret 분리','GitHub Actions','자동 테스트','안전 배포')
    Old='키 노출 위험'; New='Secret 기반 파이프라인'
    Tokens=@('Secret', 'CI', 'Test', 'Deploy')
  },
  @{
    Dir='lecture_13'; No='13'; Title='데이터 자동화'; Accent=[System.Drawing.Color]::FromArgb(198, 103, 28)
    Steps=@('CSV 수집','정제 규칙','자동 분석','리포트 생성')
    Old='엑셀 반복 작업'; New='AI 데이터 파이프라인'
    Tokens=@('CSV', 'Clean', 'Analyze', 'Report')
  },
  @{
    Dir='lecture_14'; No='14'; Title='Vision 품질 검사'; Accent=[System.Drawing.Color]::FromArgb(125, 82, 214)
    Steps=@('이미지 수집','전처리','결함 판정','검사 리포트')
    Old='수동 육안 검사'; New='Gemini Vision 검사'
    Tokens=@('Image', 'Vision', 'Defect', 'QC')
  },
  @{
    Dir='lecture_15'; No='15'; Title='센서 예측 알림'; Accent=[System.Drawing.Color]::FromArgb(220, 63, 76)
    Steps=@('센서 로그','이상 예측','알림 조건','대응 기록')
    Old='사후 점검'; New='예측 알림 자동화'
    Tokens=@('Sensor', 'Forecast', 'Alert', 'Action')
  },
  @{
    Dir='lecture_16'; No='16'; Title='통합 대시보드'; Accent=[System.Drawing.Color]::FromArgb(24, 144, 164)
    Steps=@('데이터 연결','지표 카드','필터 UI','실시간 공유')
    Old='흩어진 스크립트'; New='Streamlit 대시보드'
    Tokens=@('Data', 'KPI', 'Filter', 'Share')
  },
  @{
    Dir='lecture_17'; No='17'; Title='면접 피치'; Accent=[System.Drawing.Color]::FromArgb(88, 118, 38)
    Steps=@('경험 정리','성과 스토리','예상 질문','피치 연습')
    Old='일반 답변 암기'; New='AI 포트폴리오 피치'
    Tokens=@('Story', 'STAR', 'Q&A', 'Pitch')
  }
)

function New-Bmp($w, $h) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  return @($bmp, $g)
}

function Font($size, $style='Regular') {
  return New-Object System.Drawing.Font 'Malgun Gothic', $size, ([System.Drawing.FontStyle]::$style)
}

function Brush($color) {
  return New-Object System.Drawing.SolidBrush $color
}

function Pen($color, $width=3) {
  return New-Object System.Drawing.Pen $color, $width
}

function FillRoundRect($g, $brush, $x, $y, $w, $h, $r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  $g.FillPath($brush, $path)
  $path.Dispose()
}

function DrawCentered($g, $text, $font, $brush, $rect) {
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $sf.Trimming = [System.Drawing.StringTrimming]::EllipsisCharacter
  $g.DrawString($text, $font, $brush, $rect, $sf)
  $sf.Dispose()
}

function DrawHeader($g, $theme, $w, $h, $subtitle) {
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point 0,0),
    (New-Object System.Drawing.Point $w,$h),
    [System.Drawing.Color]::FromArgb(247,249,252),
    [System.Drawing.Color]::FromArgb(226,236,244)
  )
  $g.FillRectangle($bg, 0, 0, $w, $h)
  $bg.Dispose()
  $accent = $theme.Accent
  FillRoundRect $g (Brush $accent) 68 64 170 58 18
  DrawCentered $g "LECTURE $($theme.No)" (Font 21 'Bold') (Brush ([System.Drawing.Color]::White)) (New-Object System.Drawing.RectangleF 68,64,170,58)
  $g.DrawString($theme.Title, (Font 48 'Bold'), (Brush ([System.Drawing.Color]::FromArgb(26,31,40))), 68, 145)
  $g.DrawString($subtitle, (Font 24), (Brush ([System.Drawing.Color]::FromArgb(85,95,110))), 72, 214)
}

function Save-Panel($theme, $idx, $path) {
  $pair = New-Bmp 1024 1024; $bmp=$pair[0]; $g=$pair[1]
  DrawHeader $g $theme 1024 1024 $theme.Steps[$idx]
  $accent = $theme.Accent
  $dark = [System.Drawing.Color]::FromArgb(28,36,48)
  $light = [System.Drawing.Color]::FromArgb(255,255,255)

  FillRoundRect $g (Brush $light) 92 322 840 520 36
  $p = Pen ([System.Drawing.Color]::FromArgb(215,223,232)) 4
  $g.DrawRectangle($p, 93, 323, 838, 518); $p.Dispose()

  for ($i=0; $i -lt 4; $i++) {
    $x = 150 + ($i * 190)
    $y = 430 + ([Math]::Abs($idx - $i) * 28)
    FillRoundRect $g (Brush ([System.Drawing.Color]::FromArgb(238,242,247))) $x $y 128 128 26
    FillRoundRect $g (Brush ($(if ($i -eq $idx) { $accent } else { [System.Drawing.Color]::FromArgb(148,161,179) }))) ($x+18) ($y+18) 92 92 22
    DrawCentered $g $theme.Tokens[$i] (Font 18 'Bold') (Brush ([System.Drawing.Color]::White)) (New-Object System.Drawing.RectangleF ($x+18),($y+18),92,92)
    if ($i -lt 3) {
      $arrowPen = Pen $accent 8
      $g.DrawLine($arrowPen, ($x+140), ($y+64), ($x+178), 494)
      $arrowPen.Dispose()
    }
  }

  DrawCentered $g "$($idx+1). $($theme.Steps[$idx])" (Font 34 'Bold') (Brush $dark) (New-Object System.Drawing.RectangleF 130,720,764,80)
  $g.DrawString("강의 흐름에 맞춘 전용 이미지", (Font 22), (Brush ([System.Drawing.Color]::FromArgb(86,96,110))), 310, 832)
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

function Save-Comic($theme, $path) {
  $pair = New-Bmp 1024 1024; $bmp=$pair[0]; $g=$pair[1]
  DrawHeader $g $theme 1024 1024 '4단계 실습 스토리'
  $positions = @(@(74,330),@(532,330),@(74,648),@(532,648))
  for ($i=0; $i -lt 4; $i++) {
    $x=$positions[$i][0]; $y=$positions[$i][1]
    FillRoundRect $g (Brush ([System.Drawing.Color]::White)) $x $y 418 254 26
    FillRoundRect $g (Brush $theme.Accent) ($x+26) ($y+28) 78 78 18
    DrawCentered $g ($i+1).ToString() (Font 31 'Bold') (Brush ([System.Drawing.Color]::White)) (New-Object System.Drawing.RectangleF ($x+26),($y+28),78,78)
    $g.DrawString($theme.Steps[$i], (Font 25 'Bold'), (Brush ([System.Drawing.Color]::FromArgb(30,38,50))), ($x+126), ($y+40))
    $g.DrawString($theme.Tokens[$i], (Font 20), (Brush ([System.Drawing.Color]::FromArgb(91,104,120))), ($x+128), ($y+90))
    $g.DrawLine((Pen ([System.Drawing.Color]::FromArgb(214,222,232)) 5), ($x+38), ($y+178), ($x+366), ($y+178))
    FillRoundRect $g (Brush ([System.Drawing.Color]::FromArgb(236,241,247))) ($x+38) ($y+198) 318 26 13
    FillRoundRect $g (Brush $theme.Accent) ($x+38) ($y+198) (70 + $i*74) 26 13
  }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

function Save-Compare($theme, $path, $isNew) {
  $pair = New-Bmp 1586 992; $bmp=$pair[0]; $g=$pair[1]
  $bg = if ($isNew) { [System.Drawing.Color]::FromArgb(241,248,247) } else { [System.Drawing.Color]::FromArgb(248,246,242) }
  $g.Clear($bg)
  $title = if ($isNew) { $theme.New } else { $theme.Old }
  $sub = if ($isNew) { '자동화된 흐름, 빠른 피드백, 재사용 가능한 결과' } else { '반복 작업, 수동 확인, 개인 기억에 의존' }
  DrawCentered $g $title (Font 58 'Bold') (Brush ([System.Drawing.Color]::FromArgb(27,34,45))) (New-Object System.Drawing.RectangleF 90,72,1406,100)
  DrawCentered $g $sub (Font 27) (Brush ([System.Drawing.Color]::FromArgb(82,96,112))) (New-Object System.Drawing.RectangleF 90,166,1406,58)
  $accent = if ($isNew) { $theme.Accent } else { [System.Drawing.Color]::FromArgb(132,120,103) }
  for ($i=0; $i -lt 4; $i++) {
    $x = 150 + $i*330
    $h = if ($isNew) { 360 - $i*20 } else { 170 + $i*44 }
    FillRoundRect $g (Brush ([System.Drawing.Color]::White)) $x 302 250 500 28
    FillRoundRect $g (Brush $accent) ($x+55) (760-$h) 140 $h 24
    DrawCentered $g $theme.Steps[$i] (Font 24 'Bold') (Brush ([System.Drawing.Color]::FromArgb(32,40,52))) (New-Object System.Drawing.RectangleF $x,820,250,62)
    DrawCentered $g $theme.Tokens[$i] (Font 22) (Brush ([System.Drawing.Color]::White)) (New-Object System.Drawing.RectangleF ($x+55),(760-$h),140,80)
  }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

foreach ($theme in $lectures) {
  $public = Join-Path $root "$($theme.Dir)\public"
  for ($i=0; $i -lt 4; $i++) {
    Save-Panel $theme $i (Join-Path $public "panel$($i+1).png")
  }
  Save-Comic $theme (Join-Path $public 'comic.png')
  Save-Compare $theme (Join-Path $public 'traditional-coding.png') $false
  Save-Compare $theme (Join-Path $public 'vibe-coding.png') $true

  $dist = Join-Path $root "$($theme.Dir)\dist"
  if (Test-Path -LiteralPath $dist) {
    foreach ($name in @('comic.png','panel1.png','panel2.png','panel3.png','panel4.png','traditional-coding.png','vibe-coding.png')) {
      Copy-Item -LiteralPath (Join-Path $public $name) -Destination (Join-Path $dist $name) -Force
    }
  }
}

