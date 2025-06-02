from openai import OpenAI
import chainlit as cl

@cl.on_message
async def on_message(message):
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": message.content}]
    )
    await cl.Message(content=response.choices[0].message.content).send()
