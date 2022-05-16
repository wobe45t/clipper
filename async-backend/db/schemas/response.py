from typing import Optional
from pydantic import BaseModel

class ResponseBase(BaseModel):
    status: int
    data: Optional[dict]
    message: str 

class SuccessResponse(ResponseBase):
    pass