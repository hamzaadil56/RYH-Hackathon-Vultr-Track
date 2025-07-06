import time
import json
from datetime import datetime
import re


class InterviewAgent:
    def __init__(self):
        self.questions = [
            {
                "id": 1,
                "text": "Can you start by telling me about yourself and your background?",
                "category": "Introduction",
                "keywords": ["experience", "background", "skills", "education"]
            },
            {
                "id": 2,
                "text": "What interests you about this role?",
                "category": "Motivation",
                "keywords": ["interest", "motivation", "role", "company"]
            },
            {
                "id": 3,
                "text": "Can you describe a challenging project you worked on and how you handled it?",
                "category": "Problem-Solving",
                "keywords": ["challenge", "project", "solution", "problem"]
            },
            {
                "id": 4,
                "text": "How do you handle working under pressure or tight deadlines?",
                "category": "Stress Management",
                "keywords": ["pressure", "deadlines", "stress", "manage"]
            },
            {
                "id": 5,
                "text": "Where do you see yourself in five years?",
                "category": "Career Goals",
                "keywords": ["goals", "future", "career", "plan"]
            }
        ]
        self.responses = []
        self.score = 0

    def evaluate_response(self, response, keywords):
        """Evaluate the response based on keyword presence and length."""
        score = 0
        response = response.lower()
        # Check for keyword matches
        for keyword in keywords:
            if re.search(r'\b' + keyword + r'\b', response):
                score += 10
        # Add points for response length (indicative of detail)
        word_count = len(response.split())
        if word_count > 20:
            score += min(word_count, 50)  # Cap bonus at 50 words
        return score

    def provide_feedback(self, response, question):
        """Provide feedback based on the response."""
        score = self.evaluate_response(response, question["keywords"])
        self.score += score
        if score > 40:
            return "Great response! You provided detailed information and covered key aspects relevant to the question."
        elif score > 20:
            return "Good response, but consider adding more specific details or examples to strengthen your answer."
        else:
            return "Your response could be improved by including more relevant details or addressing the question more directly."

    def save_transcript(self):
        """Save the interview transcript to a JSON file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        transcript = {
            "date": timestamp,
            "questions_asked": len(self.questions),
            "responses": self.responses,
            "total_score": self.score
        }
        filename = f"interview_transcript_{timestamp}.json"
        with open(filename, 'w') as f:
            json.dump(transcript, f, indent=4)
        return filename

    def conduct_interview(self):
        """Conduct the interview process."""
        print("Welcome to the Interview Agent!")
        print("Please answer the following questions to the best of your ability.\n")

        for question in self.questions:
            print(f"Question {question['id']}: {question['text']}")
            response = input("Your answer: ")
            feedback = self.provide_feedback(response, question)
            self.responses.append({
                "question": question["text"],
                "response": response,
                "category": question["category"],
                "feedback": feedback
            })
            print(f"Feedback: {feedback}\n")
            time.sleep(1)  # Brief pause for readability

        print("\nInterview completed! Thank you for your time.")
        print(f"Total Score: {self.score}/{len(self.questions) * 60}")
        transcript_file = self.save_transcript()
        print(f"Interview transcript saved to: {transcript_file}")


if __name__ == "__main__":
    agent = InterviewAgent()
    agent.conduct_interview()