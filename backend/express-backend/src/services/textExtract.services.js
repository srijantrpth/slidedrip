import FormData from 'form-data';
import axios from 'axios';
export const textRead = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file',file.buffer,{
        filename: file.originalname,
        contentType: file.mimetype
    })
    const response = await axios.post(`${process.env.FASTAPI_HOST}:${process.env.FASTAPI_PORT}/api/v1/extract`,formData,
        {
            headers: {
                ...formData.getHeaders()
            }
        }
    )
    
    return response.data.text
  } catch (error) {
   console.log(`Error in Extracting Text! ${error}`);
   throw new Error(`Text extraction failed: ${error.response?.data || error.message}`);

    
  }
};