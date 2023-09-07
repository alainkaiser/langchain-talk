import { config } from "dotenv";
import OpenAI from "openai";

config();

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat helper function to send a message to the API
async function chat(input) {
  const messages = [{ role: "user", content: input }];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    /* 
    Value from 0 to 1 - Lower temperature results in more consistent outputs
    Higher temperature results in more diverse and creative results
    */
    temperature: 0,
  });

  return response.choices[0].message.content;
}

const question = "What is an LLM (large language model)?";

try {
  const response = await chat(question);
  console.log(response + "\n");
} catch (error) {
  console.error(error);
}

// Instruct the model to be very funny when answering questions via a prompt template
const promptTempltae = `Be very funny when answering questions. Question: ${question}`;
try {
  const response = await chat(promptTempltae);
  console.log(response);
} catch (error) {
  console.error(error);
}
