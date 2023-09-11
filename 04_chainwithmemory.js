import { config } from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

config();

/*
  In this example, we will create a chain that is capable of remembering information from previous conversations. This is useful if you want to create a chatbot that can remember information from previous conversations.
 */

// We will start by initializing the llm and an instance of buffer memory
const llm = new OpenAI({});
const memory = new BufferMemory();

/* 
  Then, we will create a special chain, a so called "ConversationChain". This type of chain supports memory and will automatically store and retrieve information from the memory. It is useful when you want to create a conversation between a human and an AI.
*/
const chain = new ConversationChain({
  llm,
  memory,
  verbose: true,
});

// Now we call the chain and give it an input
const { response } = await chain.call({
  input: "Hi! I'm Alain, 27 years old from Switzerland",
});

console.log(response);

// Now we call the chain again, but this time we ask it to use the memory
const { response: responseWithMemory } = await chain.call({
  input: "Do you remember, how old am I?",
});

console.log(responseWithMemory);
