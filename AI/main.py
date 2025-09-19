from dotenv import load_dotenv
import os

load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import time
from vector import retriever
from config import LLM_MODEL, CHATBOT_TEMPLATE

model = ChatGoogleGenerativeAI(model=LLM_MODEL)

template = CHATBOT_TEMPLATE

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

while True:
    print("\n-------------------------------")
    question = input("Ask your question (q to quit): ")
    print("\n")
    if question == "q":
        break
    
    # context = []
    context = retriever.invoke(question)
    start_time = time.time()
    result = chain.invoke({"context": context, "question": question})
    elapsed_time = time.time() - start_time
    print(result.content)
    print(f"\n\nResponse time: {elapsed_time:.2f} seconds")

