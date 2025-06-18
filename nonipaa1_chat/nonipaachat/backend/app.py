from agents import Agent, Runner, AsyncOpenAI, set_default_openai_client, set_default_openai_api, set_tracing_disabled
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

set_tracing_disabled(True)
set_default_openai_api("chat_completion")

external_client = AsyncOpenAI(
    api_key=GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta"
)
set_default_openai_client(external_client)

agent = Agent(
    name="DemoBot",
    instructions="You are a helpful assistant.",
    model="gemini-1.5-flash"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageInput(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(msg: MessageInput):
    try:
        result = await Runner.run(agent, msg.message)
        return {"reply": result.final_output}
    except Exception as e:
        return {"error": str(e)}
