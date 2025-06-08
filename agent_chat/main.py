import chainlit as cl
from agent import ask_agent

chat_history = []

@cl.on_chat_start
async def on_chat_start():
    await cl.Message(content="👋 Welcome! Ask me anything...").send()

@cl.on_message
async def on_message(message: cl.Message):
    prompt = message.content
    response = ask_agent(prompt)

    # Save history
    chat_history.append({"user": prompt, "assistant": response})

    await cl.Message(content=response).send()
