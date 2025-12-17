export function parseHFResponse(hfJson) {
  // Normalize to text content
  let text = "";
  if (Array.isArray(hfJson) && hfJson.length > 0 && hfJson[0].generated_text) {
    text = hfJson[0].generated_text;
  } else if (typeof hfJson === "string") {
    text = hfJson;
  } else if (hfJson && hfJson.generated_text) {
    text = hfJson.generated_text;
  } else if (hfJson && hfJson.choices && hfJson.choices[0]?.message?.content) {
    text = hfJson.choices[0].message.content;
  } else {
    text = JSON.stringify(hfJson ?? "");
  }

  // Preserve original for reasoning
  const reasoning = text;

  // Remove common markdown fences/backticks
  const cleaned = text.replace(/```json[\s\S]*?```/gi, (m) => m.replace(/```json|```/gi, "")).replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""));

  // Attempt to parse a JSON object first
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/m);
  if (jsonMatch) {
    try {
      const obj = JSON.parse(jsonMatch[0]);
      const points = (obj.points || "").toString();
      const diagram = (obj.diagram || "").toString();
      if (points || diagram) {
        return { points, diagram };
      }
    } catch {}
  }

  // If no JSON, attempt heuristic extraction
  // Points: look for the last coherent block of exactly 6 bullet points (preferred) or collect all
  const lines = cleaned.split(/\r?\n/);
  const bulletBlocks = [];
  let currentBlock = [];
  
  for (const line of lines) {
    if (/^\s*(-|\d+\.)\s+/.test(line)) {
      currentBlock.push(line.trim());
    } else if (currentBlock.length > 0) {
      bulletBlocks.push([...currentBlock]);
      currentBlock = [];
    }
  }
  if (currentBlock.length > 0) {
    bulletBlocks.push(currentBlock);
  }

  // Prefer a block with exactly 6 points, otherwise take the longest block
  const bestBlock = bulletBlocks.find(b => b.length === 6) || bulletBlocks.sort((a, b) => b.length - a.length)[0] || [];
  const points = bestBlock.slice(0, 6).join("\n");

  // Diagram: find the cleanest graph TD; block (prefer one without extra commentary)
  const diagramMatches = [...cleaned.matchAll(/graph\s+TD;[^]*?(?=\n\n|\n[A-Z]|\n -|\n\d+\.|\nBut|$)/gi)];
  let diagram = "";
  
  if (diagramMatches.length > 0) {
    // Pick the shortest/cleanest one (likely without reasoning)
    const cleanest = diagramMatches
      .map(m => m[0].trim())
      .sort((a, b) => a.length - b.length)[0];
    diagram = cleanest.split('\n').filter(l => l.trim() && !l.match(/But|However|Alternatively|Now|Let/i)).join('\n');
  }

  return {
    points: points || "No points detected.",
    diagram: diagram || "graph TD; A-->B;",
    reasoning: reasoning || "No reasoning detected.",
  };
}
