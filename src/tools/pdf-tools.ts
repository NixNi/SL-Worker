import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import * as fs from "fs/promises";
import pdf from "pdf-parse";

// Tool to extract all text from a PDF file
export async function extractFullPdfText({
  filePath,
}: {
  filePath: string;
}): Promise<string> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(
      `Error extracting text from PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Tool to extract text from a specific page of a PDF
export async function extractPdfTextFromPage({
  filePath,
  pageNumber,
}: {
  filePath: string;
  pageNumber: number;
}): Promise<string> {
  if (pageNumber < 1) throw new Error("Page number must be >= 1");
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer, { max: pageNumber });
    const pagesText = data.text.split("\n\n");
    const pageText = pagesText[pageNumber - 1] || "";
    return pageText.trim();
  } catch (error) {
    throw new Error(
      `Error extracting text from page ${pageNumber}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Tool to extract text from a range of pages in a PDF
export async function extractPdfTextFromRange({
  filePath,
  startPage,
  endPage,
}: {
  filePath: string;
  startPage: number;
  endPage: number;
}): Promise<string> {
  if (startPage < 1 || endPage < startPage)
    throw new Error("startPage must be >= 1 and endPage >= startPage");
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer, { max: endPage });
    const pagesText = data.text.split("\n\n");
    const rangeText = pagesText.slice(startPage - 1, endPage).join("\n\n");
    return rangeText.trim();
  } catch (error) {
    throw new Error(
      `Error extracting text from range ${startPage}-${endPage}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export const PDFTools = [
  new DynamicStructuredTool({
    name: "extract_full_pdf_text",
    description: "Extracts all text from a PDF file.",
    schema: z.object({
      filePath: z.string().describe("Path to the PDF file"),
    }),
    func: extractFullPdfText,
  }),
  new DynamicStructuredTool({
    name: "extract_pdf_text_from_page",
    description: "Extracts text from a specific page of a PDF file.",
    schema: z.object({
      filePath: z.string().describe("Path to the PDF file"),
      pageNumber: z.number().min(1).describe("Page number (starting from 1)"),
    }),
    func: extractPdfTextFromPage,
  }),
  new DynamicStructuredTool({
    name: "extract_pdf_text_from_range",
    description: "Extracts text from a range of pages in a PDF file.",
    schema: z.object({
      filePath: z.string().describe("Path to the PDF file"),
      startPage: z.number().min(1).describe("Starting page (from 1)"),
      endPage: z.number().describe("Ending page (>= startPage)"),
    }),
    func: extractPdfTextFromRange,
  }),
];
