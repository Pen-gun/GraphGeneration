export const makePrompt = (topic, context = null) => {
  const contextSection = context 
    ? `\n\nPrevious context:\n${context}\n\nBuild upon the above context when providing your response.`
    : '';
  
  return `
You are an assistant that outputs JSON only.

Task:
1) Provide 6 short, plain-language bullet points that explain "${topic}" so a beginner can memorize them easily.${context ? ' Consider and expand on the previous context.' : ''}
2) Create a Mermaid diagram (graph TD) that shows main components and flow for "${topic}" so it helps with memory (nodes and arrows).${context ? ' Build upon or connect to previously introduced components.' : ''}
3) Return EXACTLY a JSON object with two string properties: "points" and "diagram". 
- "points" should be a newline-separated string with bullets (use "-" or numbered).
- "diagram" should contain valid Mermaid graph code (start with "graph TD;").

Example output:
{
  "points": "- point 1\n- point 2\n- point 3",
  "diagram": "graph TD; A[Data] --> B[Model]; B --> C[Prediction];"
}${contextSection}

Make the output compact and do not include any extra commentary or markdown.
`;
};
