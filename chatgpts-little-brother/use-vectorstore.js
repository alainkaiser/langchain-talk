import { config } from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import prompts from "prompts";

config();

/*
  In this example, we want to run a similarity search against our vector store and return the most similar document as an answer to our question.
*/

// Create embeddings as we also have to convert our query(question) to a vector
const embeddings = new OpenAIEmbeddings();

// Load the created vector store with the embeddings of our query(question)
const store = await FaissStore.load("./", embeddings);

// Create the LLM/model we want to use
const llm = new OpenAI({ temperature: 0.2 });

/* 
  Create the chain, this type with the RetrievalQAChain.
  This chain is perfect for question answering tasks together with a vector store.
  Is is used to retrieve documents from a Retriever and the use a QA chain to answer the question based on the retrieved documents.
 */
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
