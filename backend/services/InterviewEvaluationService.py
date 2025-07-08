import json
class InterviewEvaluationAgent:

    def __init__(self, client, model):
        self.client = client
        self.model = model

    async def EvaluateResponses(self, jobTitle, jobDescription, conversationHistory):
        evaluationPrompt = f"You have successfully conducted an interview for the position of {jobTitle}. It is now time for you to evaluate the responses of the candidate against the questions asked and the job description."
        qaHistoryAttachment = f"Here are the question answer pairs from your interview with the candidate: {conversationHistory}"
        jobDescriptionAttachment = "Here's the job description of the role for which you are currently tasked with hiring: ", jobDescription
        responseFormat = "Based on the context above, you have to decide whether this candidate is a great fit for the position and that whether they should be hired or not. Please give the following as your output and nothing else: { \"verdict\": \"Recommended/Not Recommended\", \"reasoning\": \"The reasoning behind your verdict \"}"
        finalPrompt = f"{evaluationPrompt}\n\n{qaHistoryAttachment}\n\n{jobDescriptionAttachment}\n\n{responseFormat}"

        messages = [
            {"role": "system", "content": finalPrompt},
        ]
        response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages
                )
        
        raw_content = response.choices[0].message.content
        print(f"🔍 DEBUG - Raw API response: {raw_content}")
        
        try:
            parsed_result = json.loads(raw_content)
            print(f"🔍 DEBUG - Parsed JSON type: {type(parsed_result)}")
            print(f"🔍 DEBUG - Parsed JSON content: {parsed_result}")
            return parsed_result
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {e}")
            print(f"❌ Raw content that failed to parse: {raw_content}")
            # Return a fallback structure
            return {
                "verdict": "Error - Could not parse response",
                "reasoning": f"JSON parsing failed: {raw_content}"
            }