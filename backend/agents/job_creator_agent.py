from agents_manager import Agents


agents_manager = Agents()

job_creator_agent = agents_manager.create_agent(
    name="JobCreator",
    instructions="You are a job creation specialist",
    model="llama3-8b-8192"
)

result = agents_manager.run_agent(
    "JobCreator", "Create a job description for a software engineer")
