(() => {
  const topics = [
    {
      id: "heat-input",
      keywords: ["热输入", "电弧能量", "效率系数", "heat input", "arc energy", "efficiency"],
      zh: {
        title: "热输入与电弧能量",
        answer: "电弧能量通常由电压、电流和焊接速度计算；热输入还可能包含能量传递效率系数。不同标准和文件对术语的用法并不完全一致，因此比较 WPS、WPQR 或生产记录时，必须同时核对公式、效率系数和速度单位。",
        points: ["不要只比较 kJ/mm 数值。", "确认是否乘以效率系数 η。", "确认焊接速度采用 mm/min 还是 mm/s。"],
        scope: "该结论用于文件核对，不能单独确定合格的焊接参数窗口。"
      },
      en: {
        title: "Heat input and arc energy",
        answer: "Arc energy is normally calculated from voltage, current and travel speed; heat input may additionally include a thermal-efficiency factor. Terminology is not fully consistent across standards, so a WPS, WPQR or production record should be compared by checking the equation, efficiency factor and speed unit together.",
        points: ["Do not compare the kJ/mm value alone.", "Check whether efficiency factor η is included.", "Confirm whether travel speed is in mm/min or mm/s."],
        scope: "This supports document review; it does not by itself define an acceptable welding-parameter window."
      },
      sources: [
        ["网站文章：电弧能量与热输入", "Site article: Arc energy and heat input", "heat-input.html"],
        ["ISO/TS 8182:2026", "ISO/TS 8182:2026", "https://www.iso.org/standard/82999.html"]
      ]
    },
    {
      id: "wps-wpqr",
      keywords: ["wps", "wpqr", "pqr", "pwps", "工艺规程", "工艺评定", "文件关系", "procedure qualification"],
      zh: {
        title: "WPS、pWPS 与 WPQR/PQR",
        answer: "pWPS 是用于评定试验的初步工艺；WPQR/PQR 记录实际评定试验、试验结果及由此获得的评定范围；WPS 是生产焊接使用的工艺指令。生产 WPS 必须落在适用 WPQR/PQR 支持的范围内。",
        points: ["WPS 是生产指令，不是试验报告。", "WPQR/PQR 是评定证据，不等于生产操作卡。", "需要按适用标准逐项核对重要变素和评定范围。"],
        scope: "具体评定范围取决于合同采用的标准、版本和评定等级。"
      },
      en: {
        title: "WPS, pWPS and WPQR/PQR",
        answer: "A pWPS is the preliminary procedure used for the qualification test. A WPQR/PQR records the actual test, results and resulting range of qualification. A WPS is the instruction used for production welding and must remain within the range supported by the applicable WPQR/PQR.",
        points: ["A WPS is a production instruction, not a test report.", "A WPQR/PQR is qualification evidence, not a shop instruction.", "Essential variables and ranges must be checked against the governing standard."],
        scope: "The exact qualification range depends on the governing standard, edition and qualification level."
      },
      sources: [
        ["网站文章：WPS、pWPS 与 WPQR/PQR", "Site article: WPS, pWPS and WPQR/PQR", "wps-pqr.html"],
        ["ISO 15607:2019", "ISO 15607:2019", "https://www.iso.org/standard/71495.html"],
        ["ISO 15614-1:2017+A1:2019", "ISO 15614-1:2017+A1:2019", "https://www.iso.org/standard/51792.html"]
      ]
    },
    {
      id: "s960",
      keywords: ["s960", "高强钢", "热循环窗口", "热输入窗口", "haz", "high strength", "thermal window"],
      zh: {
        title: "S960 焊接热循环窗口",
        answer: "S960 的可用焊接窗口不能只由钢级名称确定。材料产品、板厚、接头形式、焊接顺序、预热和层间温度、热输入以及所需力学性能需要作为一个整体进行评定。",
        points: ["热输入过高可能影响热影响区强度和韧性。", "冷却过快会增加硬化及氢致裂纹风险。", "允许窗口应来自产品资料、项目要求和工艺评定证据。"],
        scope: "这里不给出通用热输入上下限；项目数值必须由实际材料和评定证据支持。"
      },
      en: {
        title: "The S960 welding thermal window",
        answer: "The usable welding window for S960 cannot be determined from the grade name alone. Product, thickness, joint type, sequence, preheat and interpass temperature, heat input and required mechanical properties must be qualified as a complete system.",
        points: ["Excessive heat input can affect HAZ strength and toughness.", "Very rapid cooling can increase hardening and hydrogen-cracking risk.", "The permitted window should come from product data, project requirements and qualification evidence."],
        scope: "No universal heat-input limits are given here; project values need support from the actual material and qualification evidence."
      },
      sources: [
        ["网站文章：S960焊接热循环窗口", "Site article: The S960 welding thermal window", "s960-welding.html"],
        ["ISO 15614-1:2017+A1:2019", "ISO 15614-1:2017+A1:2019", "https://www.iso.org/standard/51792.html"]
      ]
    },
    {
      id: "hk-inspection",
      keywords: ["香港", "无损检测", "ndt", "检测比例", "等待时间", "690", "500", "steel code", "hold time", "inspection"],
      zh: {
        title: "香港《钢结构使用守则》下的焊缝检验",
        answer: "香港《钢结构使用守则》要求先对所有焊缝全长进行目视检验。表 14.3a 注5规定，屈服强度大于 500 N/mm² 的钢材通常采用100%检测频率，除非负责工程师另行同意。屈服强度高于690 MPa的材料不应直接套用表14.2b的等待时间。",
        points: ["检验范围还取决于焊缝形式、方向和厚度。", "高于690 MPa时，等待时间应由负责工程师根据专业意见提交。", "合同、图纸和ITP可能规定附加要求。"],
        scope: "屋宇署建筑工程和CEDD公共工程未必采用相同合同要求，应先确认项目文件。"
      },
      en: {
        title: "Weld inspection under the Hong Kong Steel Code",
        answer: "The Hong Kong Steel Code requires full-length visual inspection of all welds before other required NDT. Note 5 to Table 14.3a generally calls for 100% testing frequency for steel above 500 N/mm² yield strength unless otherwise agreed by the Responsible Engineer. Table 14.2b should not be applied directly to material above 690 MPa yield strength.",
        points: ["Extent also depends on weld type, orientation and thickness.", "Above 690 MPa, hold time should be submitted by the Responsible Engineer using specialist advice.", "The contract, drawings and ITP may add requirements."],
        scope: "Buildings Department building works and CEDD public works may use different contractual requirements; confirm the project documents first."
      },
      sources: [
        ["网站文章：香港钢结构焊缝检验", "Site article: Hong Kong weld inspection", "hong-kong-weld-inspection.html"],
        ["屋宇署《钢结构使用守则》第14节", "Buildings Department Steel Code, Section 14", "https://www.bd.gov.hk/doc/en/resources/codes-and-references/code-and-design-manuals/suos2011/SUOS2011_section_14.pdf"]
      ]
    },
    {
      id: "hardness",
      keywords: ["硬度", "350hv", "350 hv", "hv10", "压痕", "hardness", "indentation"],
      zh: {
        title: "焊接接头硬度试验",
        answer: "硬度测线用于显示母材、热影响区和焊缝金属的局部响应。单独出现的“350 HV”不是所有材料和项目都适用的通用验收限值；解释结果时必须说明试验方法、载荷、压痕位置以及适用规范。",
        points: ["HV5、HV10等载荷标识不能省略。", "最高值的位置与分布和数值本身同样重要。", "验收限值应来自适用标准或项目规范。"],
        scope: "知识库不能根据一个孤立硬度数值判断接头是否合格。"
      },
      en: {
        title: "Hardness testing of welded joints",
        answer: "A hardness traverse shows local response across parent material, HAZ and weld metal. An isolated value such as 350 HV is not a universal acceptance limit for every material or project; interpretation requires the method, test load, indentation positions and governing requirement.",
        points: ["Load designations such as HV5 or HV10 must be stated.", "The location and distribution of the maximum matter as much as the value.", "Acceptance limits must come from the governing standard or project specification."],
        scope: "The knowledge base cannot determine joint acceptance from one isolated hardness value."
      },
      sources: [["网站文章：焊接接头硬度试验", "Site article: Weld hardness testing", "weld-hardness.html"]]
    }
  ];

  const normalise = value => value.toLowerCase().replace(/[\s，。！？、,:;()（）/\\_-]+/g, "");
  const retrieve = query => {
    const q = normalise(query.trim());
    if (q.length < 2) return null;
    const ranked = topics.map(topic => ({
      topic,
      score: topic.keywords.reduce((total, keyword) => {
        const key = normalise(keyword);
        return total + (q.includes(key) ? key.length + 2 : key.includes(q) ? q.length : 0);
      }, 0)
    })).sort((a, b) => b.score - a.score);
    return ranked[0].score ? ranked[0].topic : null;
  };

  if (typeof module !== "undefined") {
    const assert = require("node:assert");
    assert.equal(retrieve("热输入与电弧能量有什么区别").id, "heat-input");
    assert.equal(retrieve("WPS和WPQR是什么关系").id, "wps-wpqr");
    assert.equal(retrieve("办公室午餐吃什么"), null);
    module.exports = { retrieve, topics };
    return;
  }

  const form = document.querySelector("#kb-form");
  const input = document.querySelector("#kb-query");
  const result = document.querySelector("#kb-result");
  const submit = form.querySelector("button[type=submit]");
  const endpoint = "https://xty-welding-rag.xiaoty89757.workers.dev/search";
  const isZh = () => document.documentElement.lang.startsWith("zh");
  const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  const renderLocal = query => {
    const topic = retrieve(query);
    const zh = isZh();
    if (!topic) {
      result.innerHTML = `<div class="kb-empty"><h2>${zh ? "知识库暂未覆盖这个问题" : "This question is not covered yet"}</h2><p>${zh ? "请尝试热输入、WPS/WPQR、S960、香港焊缝检验或硬度试验。" : "Try heat input, WPS/WPQR, S960, Hong Kong weld inspection or hardness testing."}</p></div>`;
      return;
    }
    const copy = topic[zh ? "zh" : "en"];
    result.innerHTML = `<article class="kb-answer">
      <div class="kb-answer-label">${zh ? "最相关的知识卡" : "Most relevant knowledge card"}</div>
      <h2>${escapeHtml(copy.title)}</h2>
      <p class="kb-answer-main">${escapeHtml(copy.answer)}</p>
      <ul>${copy.points.map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
      <p class="kb-scope"><strong>${zh ? "适用边界：" : "Scope: "}</strong>${escapeHtml(copy.scope)}</p>
      <div class="kb-sources"><strong>${zh ? "依据与延伸阅读" : "Evidence and further reading"}</strong>${topic.sources.map(source => `<a href="${source[2]}"${source[2].startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${escapeHtml(source[zh ? 0 : 1])} <span>↗</span></a>`).join("")}</div>
    </article>`;
  };

  const renderAI = matches => {
    const zh = isZh();
    const [match, ...related] = matches;
    if (!match) return renderLocal(input.value);
    const language = zh ? "zh" : "en";
    result.innerHTML = `<article class="kb-answer">
      <div class="kb-answer-label">${zh ? "AI 向量检索·最相关知识块" : "AI vector search · top knowledge chunk"}</div>
      <h2>${escapeHtml(match.title[language])}</h2>
      <p class="kb-answer-main">${escapeHtml(match.text[language])}</p>
      <p class="kb-scope"><strong>${zh ? "适用边界：" : "Scope: "}</strong>${escapeHtml(match.scope[language])}</p>
      <div class="kb-sources"><strong>${zh ? `语义相似度：${match.score}` : `Semantic similarity: ${match.score}`}</strong><a href="${match.source.url}">${escapeHtml(match.source.section)} <span>↗</span></a></div>
      ${related.length ? `<div class="kb-related"><strong>${zh ? "其他相关结果" : "Other related results"}</strong>${related.map(item => `<a href="${item.source.url}">${escapeHtml(item.title[language])} <span>${item.score}</span></a>`).join("")}</div>` : ""}
    </article>`;
  };

  const render = async query => {
    const zh = isZh();
    submit.disabled = true;
    result.innerHTML = `<div class="kb-empty"><h2>${zh ? "AI 正在理解问题…" : "AI is interpreting the question…"}</h2></div>`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      if (!response.ok) throw new Error(`Search failed: ${response.status}`);
      renderAI((await response.json()).matches || []);
    } catch (error) {
      console.warn(error);
      renderLocal(query);
    } finally {
      submit.disabled = false;
    }
  };

  form.addEventListener("submit", event => {
    event.preventDefault();
    void render(input.value);
  });
  document.querySelectorAll("[data-query-zh]").forEach(button => button.addEventListener("click", () => {
    input.value = button.dataset[isZh() ? "queryZh" : "queryEn"];
    void render(input.value);
  }));
  document.addEventListener("click", event => {
    if (!event.target.closest(".lang-switch [data-lang]")) return;
    input.placeholder = isZh() ? "例如：WPS和WPQR是什么关系？" : "For example: What is the relationship between a WPS and WPQR?";
    if (input.value) void render(input.value);
    document.title = isZh() ? "焊接AI知识库 · XIAO Tingyu" : "Welding AI Knowledge Base · XIAO Tingyu";
  });
  input.placeholder = isZh() ? "例如：WPS和WPQR是什么关系？" : "For example: What is the relationship between a WPS and WPQR?";
})();
