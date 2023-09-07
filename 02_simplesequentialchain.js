import { config } from "dotenv";
import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

config();

const llm = new OpenAI({ temperature: 0.7 });

const templateOne = `
You are a content creator. Given a topic, it is your job to create a title.

Topic: {topic}
Creator: This is a title for the above topic.
`;

const templateTwo = `
You are a content creator. Given a title of a topic, it is your job to write three sentences about it.

Title: {title}
Creator: This is a sentence about the above title.
`;

const promptTemplateOne = new PromptTemplate({
  template: templateOne,
  inputVariables: ["topic"],
});

const promptTemplateTwo = new PromptTemplate({
  template: templateTwo,
  inputVariables: ["title"],
});

const titleChain = new LLMChain({ llm, prompt: promptTemplateOne });
const sentenceChain = new LLMChain({ llm, prompt: promptTemplateTwo });

// Combine the two chains into one
const combinedChain = new SimpleSequentialChain({
  chains: [titleChain, sentenceChain],
  verbose: true,
});

// Run the combined chain - In the background, both chains will run and the output of the first chain will be used as input for the second chain
const result = await combinedChain.run("Dogs");

console.log(result);
