import { config } from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import prompts from "prompts";

config();

// Load the created vector store
const embeddings = new OpenAIEmbeddings();
const store = await FaissStore.load("./", embeddings);

// Create the LLM/model we want to use
const llm = new OpenAI({ temperature: 0.2 });

// Create the chain
const chain = new RetrievalQAChain({
  combineDocumentsChain: loadQAStuffChain(llm),
  retriever: store.asRetriever(),
  returnSourceDocuments: true,
});

(async () => {
  const response = await prompts({
    type: "text",
    name: "question",
    message: "Type in your question for the little brother of chatgpt:",
  });
  callChainAndLogResult(response.question);
})();

const callChainAndLogResult = async (question) => {
  const result = await chain.call({ query: question });
  console.log(result.text);
};
