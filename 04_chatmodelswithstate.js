import { config } from "dotenv";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";

config();

// Rather than expose a "text in, text out" API, they expose an interface where "chat messages" are the inputs and outputs.
const chat = new ChatOpenAI({});
const memory = new BufferMemory();

// This particular chain automatically initializes a BufferMemory instance if none is provided, but we pass it explicitly here. It also has a default prompt.
const chain = new ConversationChain({ llm: chat, memory });

const resultOne = await chain.run(
  "Answer briefly. What are the first 3 colors of a rainbow?"
);
console.log(resultOne);

/* 
  The first three colors of a rainbow are red, orange, and yellow.
  With the question "and the next 4?" the model is able to continue the conversation
 */
const resultTwo = await chain.run("And the next 4?");
console.log(resultTwo);
