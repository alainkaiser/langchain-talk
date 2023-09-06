import { config } from "dotenv";
import OpenAI from "openai";

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chat(input) {
  const messages = [{ role: "user", content: input }];

  const response = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
    temperature: 0,
  });

  return response.choices[0].message.content;
}

const question = "What is the capital of France";

try {
  const response = await chat(question);
  console.log(response);
} catch (error) {
  console.error(error);
}
