import { config } from "dotenv";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import prompts from "prompts";

config();

/*
  The basic building block of LangChain is the LLM, which takes in text and generates some more text. As an example, suppose we're building an application that generates a company name based on a company which makes products. In order to do this, we need to initialize an OpenAI model wrapper. In this case, since we want the outputs to be MORE random, we'll initialize our model with a HIGH temperature.
*/

const llm = new OpenAI({
  modelName: "text-davinci-003", // Defaults to "text-davinci-003" if no model provided.
  temperature: 0.9,
});

/*
  Most LLM applications do not pass user input directly into an LLM. Usually they will add the user input to a larger piece of text, called a prompt template, that provides additional context on the specific task at hand. Here, we create a prompt template with a placeholder for the product name (which will be filled in by the user)
*/
const prompt = PromptTemplate.fromTemplate(
  "What is a good name for a company that makes {product}?"
);

/*
  Now that we've got a model and a prompt template, we'll want to combine the two. Chains give us a way to link (or chain) together multiple primitives, like models, prompts, and other chains.
  Here, we are going to create a chain with the LLM and prompt template.
*/
const chain = new LLMChain({ llm, prompt });

(async () => {
  const response = await prompts({
    type: "text",
    name: "product",
    message: "For which product do you want to find a company name?",
  });
  predictResultViaLlmChain(response.product);
})();

const predictResultViaLlmChain = async (product) => {
  // Run the chain with the product name as input
  const result = await chain.run(product);
  console.log(result);
};
