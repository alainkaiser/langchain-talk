import { config } from "dotenv";
import { LLMChain, SequentialChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

config();

/*
  This example builds on the knowledge we gained from the previous examples.
  We will create multiple chains and combine them together via multiple inputs and outputs from each chain.

  Our bot gets a dishname and an experience as inputs. It will then write a review of the dish based on the dish_name and the experience. Then the bot will act as the restaurant and should comment on the review via a follow-up comment, summarise the review and translate the summary to german.
*/

const llm = new OpenAI({ temperature: 0.3 });

const templateOne = `
You ordered {dish_name} and your experience was {experience}. Please write a review of the dish: 
`;

const promptTemplateOne = new PromptTemplate({
  template: templateOne,
  inputVariables: ["dish_name", "experience"],
});

const reviewChain = new LLMChain({
  llm,
  prompt: promptTemplateOne,
  outputKey: "review",
});

const templateTwo = `
Given the restaurant review: {review}, write a follow-up comment. Your job is to act as the restaurant and comment on the review from the customer.  
`;

const promptTemplateTwo = new PromptTemplate({
  template: templateTwo,
  inputVariables: ["review"],
});

const commentChain = new LLMChain({
  llm,
  prompt: promptTemplateTwo,
  outputKey: "comment",
});

const templateThree = `
Summarise the review in one short sentence: \n\n {review}
`;

const promptTemplateThree = new PromptTemplate({
  template: templateThree,
  inputVariables: ["review"],
});

const summaryChain = new LLMChain({
  llm,
  prompt: promptTemplateThree,
  outputKey: "summary",
});

const templateFour = `
Translate the summary to german: \n\n {summary}
`;

const promptTemplateFour = new PromptTemplate({
  template: templateFour,
  inputVariables: ["summary"],
});

const translationChain = new LLMChain({
  llm,
  prompt: promptTemplateFour,
  outputKey: "german_translation",
});

const combinedChain = new SequentialChain({
  chains: [reviewChain, commentChain, summaryChain, translationChain],
  inputVariables: ["dish_name", "experience"],
  outputVariables: ["review", "comment", "summary", "german_translation"],
});

const result = await combinedChain.call({
  dish_name: "Pizza Salami",
  experience: "It was awful!",
});

console.log(result);
