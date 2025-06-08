from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# User information
USER_PROFILE = {
    "Nihal": "Nihal Raza is a Full Stack Developer, DevOps enthusiast, and AI + Python expert who is mentoring at GIAIC and building innovative platforms using generative AI."
}

def ask_agent(prompt: str):
    # Check if user asked about someone
    for name in USER_PROFILE:
        if name.lower() in prompt.lower():
            return USER_PROFILE[name]

    # Else use OpenAI completion
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content
