import { config } from "dotenv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";

config();

/*
  In this example, we will create a vector store from a text file.
*/

// First, we load in our txt file
const loader = new TextLoader("restaurant.txt");

// Load the document in memory
const docs = await loader.load();

// Split the document into chunks
const splitter = new CharacterTextSplitter({
  chunkSize: 200, // amount of tokens per chunk - 75 words are around 100 tokens
  chunkOverlap: 50, // amount of tokens that overlap between chunks to not lose context
});

// Apply the splitter to the document
const documents = await splitter.splitDocuments(docs);
console.log(documents);

// Create embeddings
const embeddings = new OpenAIEmbeddings();

// Create and store the vector store (faiss-store is a vector store from facebook)
const store = await FaissStore.fromDocuments(documents, embeddings);
await store.save("./");
