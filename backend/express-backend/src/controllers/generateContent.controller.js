import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { textRead } from "../services/textExtract.services.js";
import { generateWithGemini } from "../utils/gemini.js";
const generateFlashcards = asyncHandler(async (req, res) => {

  const { service } = req.body;
  const files = req.files;


  if (!files || (!files.PPT && !files.PDF)) {
    throw new ApiError(400, "Please upload a file");
  }

  if (!service || !["Questions", "Summary"].includes(service)) {
    throw new ApiError(400, "Invalid Content Type Requested");
  }

  try {
    let combinedText = "";


    if (files.PPT?.[0]) {
      const pptText = await textRead(files.PPT[0]);
      combinedText += pptText + "\n\n";
    }

    if (files.PDF?.[0]) {
      const pdfText = await textRead(files.PDF[0]);
      combinedText += pdfText;
    }

    if (!combinedText.trim()) {
      throw new ApiError(
        400,
        "No Text could be extracted from the provided files"
      );
    }

    let generatedContent;
    try {
      generatedContent = await generateWithGemini(combinedText, service);
    } catch (error) {
      throw new ApiError(
        503,
        `AI Service Temporarily Unavailable: ${error.message}. Please try again in a few moments.`
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { content: generatedContent },
          `${service} generated successfully`
        )
      );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Content Generation Failed: ${error.message}`);
  }
});

export { generateFlashcards };
