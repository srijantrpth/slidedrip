import multer from "multer"

const storage = multer.memoryStorage()
  const fileFilter = (req,file,cb) => {

    const allowedTypes = [
      'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    if(allowedTypes.includes(file.mimetype)){
      cb(null,true)
  }
  else{
    cb(new Error("Invalid File Type Only PDF & PPTX Allowed", false))
  }
}
  
 export const upload = multer({ storage: storage, fileFilter: fileFilter, limits: {
  fileSize: 20 * 1024 * 1024
 } })