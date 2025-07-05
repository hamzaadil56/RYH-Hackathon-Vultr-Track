from agents_manager import Agents
from instructions.job_creator_instructions import JOB_CREATOR_INSTRUCTIONS

agents_manager = Agents()

job_creator_agent = agents_manager.create_agent(
    name="JobCreator",
    instructions=JOB_CREATOR_INSTRUCTIONS,
    model="llama3-8b-8192"
)

# Example usage
result = agents_manager.run_agent(
    "JobCreator",
    "Create a job description for a Senior Full-Stack Software Engineer at a fintech startup that focuses on mobile banking solutions. The company has 50 employees and is looking for someone with React, Node.js, and mobile development experience."
)
