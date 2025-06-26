const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small", // or another if you prefer
    input: text,
  });
  return res.data[0].embedding;
}
