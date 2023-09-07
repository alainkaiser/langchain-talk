import { config } from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

config();

const model = new OpenAI({});
const memory = new BufferMemory();

const chain = new ConversationChain({
  llm: model,
  memory,
  verbose: true,
});

const { response } = await chain.call({
  input: "Hi! I'm Alain, 27 years old from Switzerland",
});

console.log(response);

// Now we call the chain again, but this time we ask it to use the memory
const { response: responseWithMemory } = await chain.call({
  input: "Do you remember, how old am I?",
});

console.log(responseWithMemory);
