import { GoogleGenAI, Type } from "@google/genai";
import type { BookmarkFolder, Bookmark } from '../types';

const bookmarkItemSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      url: { type: Type.STRING },
      tags: {
        type: Type.ARRAY,
        description: 'A list of 1-3 concise, relevant, lowercase tags for the bookmark.',
        items: {
          type: Type.STRING,
        }
      }
    },
    required: ['title', 'url'],
};

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        folderName: {
          type: Type.STRING,
          description: 'A concise, descriptive name for the folder.'
        },
        bookmarks: {
          type: Type.ARRAY,
          items: bookmarkItemSchema,
          description: 'A list of bookmarks that belong directly in this folder.'
        },
        subfolders: {
          type: Type.ARRAY,
          description: 'A list of subfolders. This allows for nested organization.',
          items: {
            // Level 2 folder definition
            type: Type.OBJECT,
            properties: {
              folderName: {
                type: Type.STRING,
                description: 'Name of the subfolder.'
              },
              bookmarks: {
                type: Type.ARRAY,
                items: bookmarkItemSchema,
              },
              // Level 3 subfolders
              subfolders: {
                type: Type.ARRAY,
                description: 'Recursive definition for deeper nesting.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        folderName: {
                            type: Type.STRING,
                            description: 'Name of the sub-subfolder.'
                        },
                        bookmarks: {
                            type: Type.ARRAY,
                            items: bookmarkItemSchema
                        },
                        subfolders: { 
                           type: Type.ARRAY,
                           items: {
                               type: Type.OBJECT,
                               properties: {
                                    folderName: { type: Type.STRING },
                                    bookmarks: { type: Type.ARRAY, items: bookmarkItemSchema }
                               },
                               required: ['folderName', 'bookmarks']
                           }
                        }
                    },
                    required: ['folderName', 'bookmarks']
                }
              }
            },
            required: ['folderName', 'bookmarks', 'subfolders'],
          },
        },
      },
      required: ['folderName', 'bookmarks', 'subfolders'],
    }
};

const getPrompt = (bookmarks: Bookmark[]): string => {
  const bookmarkList = bookmarks.map(b => `- ${b.title}: ${b.url}`).join('\n');
  return `You are an expert personal librarian. Your task is to organize a chaotic list of browser bookmarks into a clean, logical, and hierarchical folder structure.
  
  Analyze the following list of bookmarks and create a new structure. Group similar links together under descriptive folder names. Create subfolders where appropriate (e.g., "Programming" -> "JavaScript" -> "React").
  
  For each individual bookmark, also generate a list of 1-3 concise, relevant, lowercase tags based on its title and URL. These tags should help in searching and filtering later.
  
  Ensure every single bookmark from the list is placed into a folder. Do not omit any bookmarks.
  
  Here is the list of bookmarks:
  ${bookmarkList}
  
  Provide the new structure in a JSON format that adheres to the provided schema.`;
};

export const getBookmarkSuggestionsStream = async (
    bookmarks: Bookmark[],
    apiKey: string,
    onChunk: (chunk: string) => void
): Promise<BookmarkFolder[]> => {
    if (!apiKey) {
        throw new Error("Gemini API Key is not set. Please add it in the settings.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = getPrompt(bookmarks);
    
    let accumulatedText = '';
    try {
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema,
            },
        });

        for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
                accumulatedText += chunkText;
                onChunk(chunkText);
            }
        }
    } catch (err) {
        console.error("Gemini API call error:", err);
        if (err instanceof Error) {
            const message = err.message.toLowerCase();
            if (message.includes("api key not valid") || message.includes("invalid api key")) {
                throw new Error("Invalid Gemini API Key. Please check the key in the settings.");
            }
            if (message.includes("rate limit")) {
                throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
            }
            if (message.includes("billing") || message.includes("project")) {
                 throw new Error("API request failed. This may be due to a billing issue with your Google Cloud project. Please verify your project settings.");
            }
        }
        throw new Error("An unexpected error occurred while communicating with the Gemini API. Check your network connection.");
    }
    
    try {
        // Clean the final string in case of markdown backticks
        const cleanJson = accumulatedText.replace(/^```json\s*|```\s*$/g, '');
        if (!cleanJson.trim()) {
            throw new Error("The AI returned an empty response. The bookmark file might be too large or complex.");
        }
        const parsedJson = JSON.parse(cleanJson);
        if (Array.isArray(parsedJson)) {
            return parsedJson as BookmarkFolder[];
        } else {
            throw new Error("API returned a response that was not in the expected array format.");
        }
    } catch (e) {
        console.error("Failed to parse Gemini JSON response:", e);
        console.error("Raw response:", accumulatedText);
        throw new Error("The AI's response was not in a valid format. This can be a temporary issue; please try again.");
    }
};