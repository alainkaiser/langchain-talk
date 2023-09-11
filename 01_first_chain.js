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
  temperature: 0.9,
});

// Create a prompt template with a placeholder for the product name (which will be filled in by the user)
const prompt = PromptTemplate.fromTemplate(
  "What is a good name for a company that makes {product}?"
);

// Create a chain with the LLM and prompt template
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
  const result = await chain.run(product);
  console.log(result);
};
