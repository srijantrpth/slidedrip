from fastapi import FastAPI, UploadFile, File
from app.routes.extract import router
app = FastAPI(title="Text Extraction API")
app.include_router(router,prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "FastAPI is running! "}