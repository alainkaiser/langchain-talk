import { config } from "dotenv";
import { LLMChain, SimpleSequentialChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

/*
  Thanks to the previous example we saw how useful chains can be by combining the llm and a prompt template via a chain. Now, we'll see how we can combine multiple chains together to create a more complex application.
*/

config();

/*
  The example case we are going to build: Your bot should act as a content creator. Given a topic, it should create a title for that topic and then write three sentences about it.
*/

// We will start by initializing an OpenAI model with a high temperature
const llm = new OpenAI({ temperature: 0.7 });

// We will create two templates, one for the title and one for the sentences
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

/*
  We will create two prompt templates based on the above templates. Note that the input variable for the first template is "topic" and the input variable for the second template is "title". This is important because the output of the first chain will be used as input for the second chain.
*/
const promptTemplateOne = new PromptTemplate({
  template: templateOne,
  inputVariables: ["topic"],
});

const promptTemplateTwo = new PromptTemplate({
  template: templateTwo,
  inputVariables: ["title"],
});

// After that, we will create two chains, one for the title and one for the sentences
const titleChain = new LLMChain({ llm, prompt: promptTemplateOne });
const sentenceChain = new LLMChain({ llm, prompt: promptTemplateTwo });

// Then, combine the two chains into one
const combinedChain = new SimpleSequentialChain({
  chains: [titleChain, sentenceChain],
  // Used to log the output of each chain
  verbose: true,
});

/* 
  Run the combined chain - In the background, both chains will run and the output of the first chain will be used as input for the second chain
*/
const result = await combinedChain.run("Dogs");

console.log(result);
