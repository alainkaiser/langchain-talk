import { config } from "dotenv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";

config();

// First, we load in our txt file
const loader = new TextLoader("restaurant.txt");

// Load the document
const docs = await loader.load();

// Split the document into chunks
const splitter = new CharacterTextSplitter({
  chunkSize: 200, // amount of tokens per chunk - 75 words around 100 tokens
  chunkOverlap: 50,
});

// Apply the splitter to the document
const documents = await splitter.splitDocuments(docs);
console.log(documents);

// Create embeddings
const embeddings = new OpenAIEmbeddings();

// Create and store the vector store
const store = await FaissStore.fromDocuments(documents, embeddings);
await store.save("./");
