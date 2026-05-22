# 고급 힌트

1. Antigravity IDE 터미널에서 `quarto --version`이 안 되면 Quarto CLI 설치 후 PATH를 다시 열어야 한다.
2. Quarto Python chunk가 실패하면 `pip install jupyter pandas seaborn matplotlib statsmodels`를 같은 Python 환경에 설치한다.
3. `.qmd`의 YAML은 들여쓰기가 민감하다. `format: html:` 아래 들여쓰기를 확인한다.
4. `quarto render oled_deposition_report.qmd --to html`은 `.qmd`가 있는 폴더에서 실행하는 것이 가장 안전하다.
5. statsmodels 설치가 실패하면 먼저 Python 버전과 pip 경로를 확인한다. `python -m pip --version`으로 Antigravity가 쓰는 Python을 확인한다.
6. x/y map은 전체 평균만 보면 hotspot이 흐려질 수 있다. worst panel이나 fail panel을 골라서 별도로 그린다.
