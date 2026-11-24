# AI knowledge base baseline

Recorded on 2026-11-24 from the published site at
`knowledge-base.html?lang=zh`.

Baseline tag: `baseline-keyword-v1` (`31386b1`)

| Query | Result |
| --- | --- |
| `WPS和WPQR有什么区别？` | Matched the WPS/WPQR knowledge card. |
| `施工前的焊接参数文件和试验记录分别负责什么？` | Returned “not covered” although the meaning is equivalent. |

The current `retrieve()` function only scores substring matches against a
hand-written keyword list. This is the control case for the semantic RAG MVP.

