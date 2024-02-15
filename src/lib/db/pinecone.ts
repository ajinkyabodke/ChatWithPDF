// import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
// import { downloadFromS3 } from "../s3-server";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import {
//   Document,
//   RecursiveCharacterTextSplitter,
// } from "@pinecone-database/doc-splitter";

// import { getEmbeddings } from "../embeddings";
// import md5 from "md5";
// import { convertToAscii } from "./utils";

// export const getPineconeClient = () => {
//   return new Pinecone({
//     environment: process.env.PINECONE_ENVIRONMENT!,
//     apiKey: process.env.PINECONE_API_KEY!,
//   });
// };

// type PDFPage = {
//   pageContent: string;
//   metadata: {
//     loc: { pageNumber: number };
//   };
// };

// export async function loadS3IntoPinecone(fileKey: string) {
//   // Step 1. Obtain the PDF -> Downlaod and read from PDF
//   console.log("Downloading S3 into file system");
//   const file_name = await downloadFromS3(fileKey);
//   if (!file_name) {
//     throw new Error("Could not download from S3");
//   }
//   const loader = new PDFLoader(file_name);
//   const pages = (await loader.load()) as unknown as PDFPage[];
//   // const pages = (await loader.load()) as unknown as PDFPage[];

//   // Step 2. Split and segment the PDF into small segments
//   const documents = await Promise.all(pages.map(prepareDocument));

//   // Step 3. Vectorise and embed individual documents
//   const vectors = await Promise.all(documents.flat().map(embedDocument));

//   //Step 4. Upload to pinecone
//   const client = await getPineconeClient();
//   const pineconeIndex = client.Index("chatwithpdf");
//   console.log("Inserting vectors into pinecone");
//   const namespace = convertToAscii(fileKey);
//   //push vectors into the pinecone index
//   console.log("inserting vectors into pinecone");
//   await namespace.upsert(vectors);

//   return documents[0];
// }

// async function embedDocument(doc: Document) {
//   try {
//     const embeddings = await getEmbeddings(doc.pageContent);
//     const hash = md5(doc.pageContent);

//     return {
//       id: hash,
//       values: embeddings,
//       metadata: {
//         text: doc.metadata.text,
//         pageNumber: doc.metadata.pageNumber,
//       },
//     } as PineconeRecord;
//   } catch (error) {
//     console.log("error embedding document", error);
//     throw error;
//   }
// }

// //as the text content can be too large for pinecone,we truncate it
// export const truncateStringByBytes = (str: string, bytes: number) => {
//   const enc = new TextEncoder();
//   return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
// };

//  async function prepareDocument(page: PDFPage) {
//   let { pageContent, metadata } = page;
//   //replace all new line character with empty string using regex
//   pageContent = pageContent.replace(/\n/g, "");
//   // split the docs
//   const splitter = new RecursiveCharacterTextSplitter();
//   const docs = await splitter.splitDocuments([
//     new Document({
//       pageContent,
//       metadata: {
//         pageNumber: metadata.loc.pageNumber,
//         text: truncateStringByBytes(pageContent, 36000),
//       },
//     }),
//   ]);
//   return docs;
// }
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "../s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "../embeddings";
import { PINECONEINDEXNAME, convertToAscii } from "../utils";

export const getPineconeClient = () => {
  console.log(`env:`, [
    process.env.PINECONE_ENVIRONMENT,
    process.env.PINECONE_API_KEY,
  ]);

  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> downlaod and read from pdf
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // 4. upload to pinecone
  const client = getPineconeClient();
  const pineconeIndex = client.index(PINECONEINDEXNAME);
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors).catch((e) => {
    throw e;
  });

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
