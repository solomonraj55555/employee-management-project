from dotenv import load_dotenv
from urllib.parse import quote_plus
import os

load_dotenv()

_agent = None

def get_agent():
    global _agent

    if _agent is not None:
        return _agent

    from langchain_groq import ChatGroq
    from langchain_community.utilities import SQLDatabase
    from langchain_community.agent_toolkits import create_sql_agent

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY missing in .env")

    llm = ChatGroq(
        api_key=api_key,
        model="llama-3.3-70b-versatile",
        temperature=0,
    )

    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "employee_db")

    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{quote_plus(DB_PASSWORD)}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    db = SQLDatabase.from_uri(DATABASE_URL)

    _agent = create_sql_agent(
        llm=llm,
        db=db,
        verbose=True,
        handle_parsing_errors=True,
    )

    return _agent


def ask_employee_question(question: str):
    try:
        agent = get_agent()

        prompt = f"""
        You are an HR assistant.

        You have access to an employee database.

        Answer clearly and concisely.

        Question: {question}
        """

        result = agent.invoke({"input": prompt})

        if isinstance(result, dict):
            return result.get("output", str(result))

        return str(result)

    except Exception as e:
        return f"I could not answer that. Error: {str(e)}"