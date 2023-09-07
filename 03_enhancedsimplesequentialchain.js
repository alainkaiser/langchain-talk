import { config } from "dotenv";
import { LLMChain, SequentialChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

config();

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
Given the restaurant review: {review}, write a follow-up comment:  
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
