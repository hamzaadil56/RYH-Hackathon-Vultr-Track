import json
class InterviewQuestionAgent:
    def __init__(self, client, model):
        self.client = client
        self.model = model
    async def GenerateInterviewQuestion(self, jobTitle: str, jobDescription: str, conversationHistory: list):
        role_definition = f"You are an expert interviewer. You are currently in the process of taking an interview for the position of {jobTitle}. You are provided with a job description and You are mantaining the count of number of questions you've asked (this doesn't include the follow up questions)."
        job_desription_prompt = "Here's the description of the job that you're hiring for: ", jobDescription
        response_format_prompt = "Please structure your response as follows: { \"isLastQuestion\": <bool>, \"question\": \"<string>\"}. Please only return this JSON in your response and nothing elseSet isLastQuestion to true (and henceforth, under \"question\" you can give conclusive phrase. However, do not give any verdict to the user.) if you don't have any further questions and false otherwise."
        conversation_history_prompt = "Here's the conversation history (past five) between you and the candidate: ", conversationHistory
        combined_prompt = \
        f"""
        {role_definition}

        {job_desription_prompt}

        {response_format_prompt}

        {conversation_history_prompt}
        """
        messages = [
        {"role": "system", "content": combined_prompt},
        ]
        response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages
                )
        print(response.choices[0].message.content)
        return json.loads(response.choices[0].message.content)