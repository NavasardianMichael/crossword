# Writer brief: seed words for one language

You are a writer agent. You write crossword and scanword answer words with their clues for **one
language**, as JSON files in the repo, to the same standard the Gemini prompt holds generated words
to. Written for the Claude agent the seeding session starts (`docs/WORD_SEEDING_PLAN.md`).

## Your output

`server/prisma/seed/claude/<code>/<nn>.json` — the file name you are given (`01.json`, `02.json` …),
a JSON array of entries:

```json
{ "word": "lighthouse", "topics": ["nature"], "difficulty": 2, "kind": "common",
  "clue": "Tower that guides ships with its beam", "shortClue": "Coastal beacon" }
```

- `word`: the answer, spelled as the language writes it (its style guide decides letters such as
  `ё`, `ß`, accents): lowercase for common words, a capital for proper nouns (`Сочи`, `Hamlet`) —
  it is stored as the word's display form; the answer itself is normalized anyway.
- `topics`: one or more of `general nature animals food geography history science sport arts home
  professions localCulture`. `general` is everyday vocabulary (feelings, actions, time, abstract
  words) — the glue every grid needs, so it gets the largest share.
- `difficulty`: 1 everyday, 2 broader, 3 rarer.
- `kind`: `common`, or `proper` for a proper noun — and then **only** with topics `geography`
  and/or `localCulture`.
- `clue`: the full clue for classic crosswords, at most 90 characters.
- `shortClue`: for a scanword cell, at most 3 words and 24 characters, no final period.

Write the number of entries you are given (usually 500) into that one file.

## Read first, and follow

1. `server/src/lib/content/<code>.ts` — **the style guide, binding**: part of speech (nouns only
   in some languages), grammatical form, spelling norm, how clues are phrased in this language's
   crossword tradition, plus worked examples, topic names and subtopics.
2. The rules of the Gemini prompt, which seed words meet too: `buildSystemInstruction`,
   `buildPrompt` and `VOCABULARY_FLOOR` in `server/src/services/entryGen.ts`. In short:
   - Think and write natively in the language; never translate, never mix languages, no calques.
   - A real, well-known dictionary word in its dictionary (headword) form — never invented.
   - Standard, current vocabulary native speakers recognize: no slang, jargon, dialect or archaic
     words, no foreign word where the language has its own (a loanword only when it is fully at
     home in everyday use).
   - ONE word: no spaces, hyphens, digits, abbreviations or acronyms. A compound only when it is a
     dictionary entry in its own right.
   - Never two forms or close derivatives of one word anywhere in the language's seed (`cat`,
     `cats`, `catty` — keep one). Compounds and words that merely share a root are fine side by
     side (`քաղաք` and `մայրաքաղաք`, `rain` and `rainbow`): the layout never puts two words of one
     stem in the same grid, and a clue may still not contain the other word's root.
   - Prefer words made mostly of letters common in the language: they cross other words easily.
   - Difficulty sets how common a word is, never how standard it is: 1 — words every adult uses
     daily; 2 — words an educated adult knows without a dictionary; 3 — rarer but still standard
     and current, never archaic, dialectal, slang or jargon.
   - Neither clue contains the answer, a word of its root, or a part of it (compounds are
     treacherous: "doorbell" may not be clued with "door").
   - The clue defines the word precisely enough for its length; it matches the answer's part of
     speech. Clues use only the language's own script.
   - Facts are stable and verifiable. No politics, wars, tragedies, religious disputes, brands, or
     anything rude or sexual.
3. `server/prisma/seed/entries.<code>.json` and every file already in
   `server/prisma/seed/claude/<code>/` — **none of their words may appear again**.

## Balance (the checker enforces it across the language's Claude-written words)

| | Aim | Checker's floor |
|---|---|---|
| 3–5 cells | ~45 % | ≥ 35 % |
| 6–8 cells | ~40 % | — |
| 9+ cells (at most 14) | ~15 % | — |
| Each of the 12 topics | ≥ 4 % (`general` ~25 %) | ≥ 2 % |
| Difficulty 1 / 2 / 3 | ~40 / 40 / 20 % | each ≥ 15 % |
| One starting letter | spread across the alphabet | ≤ 15 % |
| Proper nouns | ≤ a third of geography + localCulture | — |

Count length in **cells**, not characters: Armenian `ու` is one cell, so is `և`; one kana, Han
character, Hangul syllable or akshara is one cell. In zh, ja, ko, hi, mr, bn, ta and th two-cell
words are allowed and count as short (the "3–5" band is then 2–5); everywhere else the minimum is
3. At most 14 cells. Words in these languages run short, so few reach 9+ cells — that band has no
floor; aim for a natural spread rather than forcing long words.

## How to work

1. Plan the file: how many words per topic, difficulty and length band, from the table above.
2. Write in chunks of about 100 entries, topic by topic and subtopic by subtopic (the subtopics in
   the content file help you range widely), keeping a running list of the words written so far
   so nothing repeats.
3. After each chunk, run the checker from the repo root and fix every error it lists:

   ```bash
   pnpm --filter crossword-server exec tsx prisma/check-seed.ts <code>
   ```

   It validates every word as generated words are validated (alphabet, length in cells, clue
   lengths, script, giveaways — including the answer inside a longer clue word, `Soeplepel` for
   `lepel`), rejects duplicates across all files, and gates the balance once
   there are 200 Claude-written words. If you bend a word to pass the checker, say so in your
   report — the checker may be what is wrong.
4. Read the "possible same-root pairs" it prints: replace the ones that really are one word's
   forms or derivatives.
5. Finish with the checker passing.

Never edit any file other than your output file. Never run anything that calls Gemini.

## Report

- How many entries, and the checker's mix (lengths, topics, difficulties).
- The 10–20 entries you are least sure of (the word, the fact in a clue, or the difficulty), so a
  person can check them.
- Same-root pairs you kept on purpose, and why.
- Anything in the style guide or the checker that fought the language.
