import assert from "node:assert/strict";
import { buildMessages, isCovered } from "./index.js";

assert.equal(isCovered([{ score: 0.61 }]), true);
assert.equal(isCovered([{ score: 0.52 }]), false);

const messages = buildMessages("这两份焊接文件有什么区别？", [{
  title: { zh: "文件作用", en: "Document roles" },
  text: { zh: "WPS 是生产指令。", en: "A WPS is a production instruction." },
  scope: { zh: "核对适用标准。", en: "Check the governing standard." }
}]);
assert.match(messages[0].content, /Answer in Chinese/);
assert.match(messages[0].content, /no Markdown, LaTeX/);
assert.match(messages[1].content, /\[1\]/);

console.log("PASS: coverage threshold and grounded prompt are correct.");
