#!/usr/bin/env python3
"""
The PDF's fonts for scripts Rubik and Nunito do not cover (src/helpers/puzzle/pdf.ts): static
Regular and Bold instances of Google's Noto Sans fonts (SIL Open Font License), each cut down to
its script so a PDF downloads only what it draws.

    pip install fonttools brotli
    python scripts/pdf-fonts.py <folder with the Google Fonts variable TTFs>

The sources are the variable fonts in github.com/google/fonts (ofl/notosans*/): NotoSans (for
Greek), NotoSansArabic (Arabic, Persian, Urdu), NotoSansHebrew, NotoSansDevanagari (Hindi,
Marathi), NotoSansBengali, NotoSansTamil, NotoSansThai, NotoSansSC, NotoSansJP and NotoSansKR,
saved under their family name (`NotoSansArabic.ttf`). Writes `public/fonts/pdf/noto-sans-<script>-
{regular,bold}.ttf`. Every OpenType layout feature is kept: Arabic joining and Indic conjuncts
are shaped from them when the PDF is built.

Chinese, Japanese and Korean fonts hold tens of thousands of glyphs, so each keeps the
characters its everyday text uses: GB 2312 for Chinese, JIS X 0208 for Japanese (all kana and
the common kanji), and every Hangul syllable for Korean (no hanja). A rarer character prints as
an empty box. They come in one medium weight (`noto-sans-<script>-medium.ttf`), used for every
face of the sheet.
"""

import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

OUT = Path(__file__).resolve().parent.parent / 'public' / 'fonts' / 'pdf'

# Kept in every cut, so a run of the script's text keeps its spaces, digits and punctuation in one
# font (one run is one shaping context): ASCII, no-break space, general punctuation, joiners, the
# dotted circle Indic fonts draw a lone mark on.
COMMON = [*range(0x20, 0x7F), 0xA0, 0xAB, 0xBB, 0xD7, *range(0x2000, 0x2070), 0x25CC]


def block(start: int, end: int) -> list[int]:
    return list(range(start, end + 1))


def legacy_charset(codec: str, lead: range, trail: range) -> list[int]:
    """Every character a double-byte legacy encoding (GB 2312, JIS X 0208, KS X 1001) can write."""
    chars: set[int] = set()
    for first in lead:
        for second in trail:
            try:
                text = bytes([first, second]).decode(codec)
            except UnicodeDecodeError:
                continue
            chars.update(ord(char) for char in text)
    return sorted(chars)


EUC = range(0xA1, 0xFF)
CJK_PUNCTUATION = block(0x3000, 0x303F) + block(0xFF00, 0xFFEF)

SCRIPTS = {
    # (source family, unicode ranges)
    'greek': ('NotoSans', block(0x0370, 0x03FF) + block(0x1F00, 0x1FFF)),
    'arabic': ('NotoSansArabic', block(0x0600, 0x06FF) + block(0x0750, 0x077F) + block(0x08A0, 0x08FF) + block(0xFB50, 0xFDFF) + block(0xFE70, 0xFEFF)),
    'hebrew': ('NotoSansHebrew', block(0x0590, 0x05FF) + block(0xFB1D, 0xFB4F)),
    'devanagari': ('NotoSansDevanagari', block(0x0900, 0x097F) + block(0xA8E0, 0xA8FF) + block(0x1CD0, 0x1CFF)),
    'bengali': ('NotoSansBengali', block(0x0980, 0x09FF)),
    'tamil': ('NotoSansTamil', block(0x0B80, 0x0BFF) + block(0x11FC0, 0x11FFF)),
    'thai': ('NotoSansThai', block(0x0E00, 0x0E7F)),
    'sc': ('NotoSansSC', legacy_charset('gb2312', EUC, EUC) + CJK_PUNCTUATION),
    'jp': ('NotoSansJP', legacy_charset('euc_jp', EUC, EUC) + block(0x3040, 0x30FF) + CJK_PUNCTUATION),
    'kr': ('NotoSansKR', block(0xAC00, 0xD7A3) + block(0x1100, 0x11FF) + block(0x3130, 0x318F) + CJK_PUNCTUATION),
}

WEIGHTS = {'regular': 400, 'bold': 700}
# Several megabytes a weight: one medium weight serves every face of the sheet.
CJK = {'sc', 'jp', 'kr'}
CJK_WEIGHTS = {'medium': 500}


def cut(source: Path, unicodes: list[int], weight: int, target: Path) -> None:
    font = TTFont(source)
    axes = {axis.axisTag: axis for axis in font['fvar'].axes} if 'fvar' in font else {}
    location = {tag: (weight if tag == 'wght' else axis.defaultValue) for tag, axis in axes.items()}
    if location:
        font = instancer.instantiateVariableFont(font, location, updateFontNames=False)
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_languages = ['*']
    options.notdef_outline = True
    options.hinting = False
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=sorted(set(unicodes + COMMON)))
    subsetter.subset(font)
    map_every_glyph(font)
    font.save(target)


# Supplementary Private Use Area-B: no text ever uses it.
PRIVATE_USE = 0x100000


def map_every_glyph(font: TTFont) -> None:
    """
    pdf-lib, embedding a font whole, writes the PDF's glyph widths only for glyphs the character
    map reaches. A glyph only shaping reaches — a Thai tone mark raised over a vowel, a Devanagari
    conjunct — would then take the PDF's default width of 1000 units and open a gap after it.
    Giving each such glyph a private-use code point puts it in the character map, and its width
    in the PDF.
    """
    from fontTools.ttLib.tables._c_m_a_p import CmapSubtable

    cmap = font['cmap']
    mapped = set(cmap.getBestCmap().values())
    unmapped = [name for name in font.getGlyphOrder()[1:] if name not in mapped]
    if not unmapped:
        return
    table = cmap.getcmap(3, 10)
    if table is None:
        table = CmapSubtable.newSubtable(12)
        table.platformID, table.platEncID, table.language = 3, 10, 0
        table.cmap = dict(cmap.getBestCmap())
        cmap.tables.append(table)
    for offset, name in enumerate(unmapped):
        table.cmap[PRIVATE_USE + offset] = name


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sources = Path(sys.argv[1])
    OUT.mkdir(parents=True, exist_ok=True)
    for script, (family, unicodes) in SCRIPTS.items():
        for name, weight in (CJK_WEIGHTS if script in CJK else WEIGHTS).items():
            target = OUT / f'noto-sans-{script}-{name}.ttf'
            cut(sources / f'{family}.ttf', unicodes, weight, target)
            print(f'{target.name}: {target.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
