import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {GoogleGenerativeAI} from "@google/generative-ai"
import officeParser from "officeparser"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const extractTextFromFile = async(file) => {
    try {
        const buffer = file.buffer
        const fileType = file.mimetype
        const text = officeParser.parse(buffer, {
            input: fileType
        });
        return text
    } catch (error) {
        throw new ApiError(400, `Error extracting text ${error?.message}`)
    }
}

const processWithGemini = async(text,task)=>{
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro-latest",
            temperature : 0.7
        })
        const prompt = task === "questons" ? `Create 10 Challenging Viva Questions in a numbered list based on this content ${text} ` : `Provide a concise academic summary of this content by extracting useful and important points ${text} `
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        throw new ApiError(500, `Error processing with Gemini ${error?.message}`)
    }
}


const uploadDocument = asyncHandler(async (req,res)=>{
    const {task} = req.body
    const {PPT, PDF} = req.files
    if(!PPT && !PDF){
        throw new ApiError(400, "Please upload the required files")
    }
if(!['questions', 'summary'].includes(task)){
    throw new ApiError(400, "Invalid task Choose between 'questions' or 'summary'")
}
    let extractedText = ""
    if(PPT){
        const pptText = await extractTextFromFile(PPT)
        extractedText+= pptText
    }
    if(PDF){
        const pdfText = await extractTextFromFile(PDF)
        extractedText+= pdfText
    }
    const result = await processWithGemini(extractedText, task)

    return res.status(200).json(new ApiResponse(200, result, `${task === "questions" ? "Viva Questions" : "Summary"} generated successfully`))


})

export {uploadDocument}