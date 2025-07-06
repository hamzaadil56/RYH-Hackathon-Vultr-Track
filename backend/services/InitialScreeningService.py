from openai import OpenAI
import os

class InitialScreeningService:

    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("GROQ_API_KEY"), base_url="https://api.groq.com/openai/v1")
        self.groq_model = "llama-3.3-70b-versatile"
    def getScreeningQuestions(self,resumeText: str, jobDescription: str) -> list:
        prompt = "You are an excellent human resource manager. You are provided with a job description, for which you have to shortlist potential candidates from a candidates pool. Given a resume and a job description, you have to list down the initial screening questions that you would ask the candidate to shortlist them. In your response, just include a list of questions and nothing else, for example: {\"questions\": [\"question1\", \"question2\", \"question3\"]}"
        messages = [
            {"role": "system", "content": prompt},
            {"role": "system", "content": f"Here's the job description: {jobDescription}"},
            {"role": "system", "content": f"Here's the extracted resume text: {resumeText}"}
        ]
        response = self.client.chat.completions.create(
            model=self.groq_model,
            messages=messages
        )
        return response.choices[0].message.content
    
    def evaluateResponses(self,qaPairs: list, jobDescription: str):
        prompt = "You are an excellent human resource manager. You are currently shortlisting candidates for a job. You are provided with a job description, and some Question Answer pairs. The questions were asked by you previously and the answers were provided by the candidate. You have to evaluate the candidate's responses against the question asked as well as the job description, and then determine whether they should proceed towards next rounds in the hiring process. You have to provide the reasoning behind your decision in the response. Please structure your response as follows: {\"verdict\": \"<yes/no>\", \"reasoning\": \"<reasoning>\"}"
        messages = [
            {"role": "system", "content": prompt},
            {"role": "system", "content": f"Here's the job description: {jobDescription}"},
            {"role": "system", "content": f"Here are the Question Answer pairs: {qaPairs}"}
        ]
        response = self.client.chat.completions.create(
            model=self.groq_model,
            messages=messages
        )
        return response.choices[0].message.content