import { config } from "dotenv";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import prompts from "prompts";

config();

const llm = new OpenAI({
  temperature: 0.9,
});

const prompt = PromptTemplate.fromTemplate(
  "What is a good name for a company that makes {product}?"
);

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
