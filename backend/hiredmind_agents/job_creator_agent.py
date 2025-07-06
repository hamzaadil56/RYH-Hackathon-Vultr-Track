from agents_manager import Agents
from instructions.job_creator_instructions import JOB_CREATOR_INSTRUCTIONS
from pydantic import BaseModel
from agents import function_tool

agents_manager = Agents()


@function_tool
def fetch_company_details() -> str:
    """
    Fetch company details from an external source.

    Args:
        company_name (str): The name of the company to fetch details for.

    Returns:
        str: A string containing the company details.
    """
    return "Company details are: Company HamzaLtd, a leading provider of innovative tech solutions, specializing in AI and machine learning. Founded in 2010, we have grown to a team of over 200 professionals dedicated to delivering cutting-edge products and services."


class Company(BaseModel):

    company_name: str
    about: str

# get_company_details_agent = agents_manager.create_agent(
#     name="GetCompanyDetails",
#     instructions="Extract company details from the text. If you don't see any company details, ask the user about their company.",
#     model="llama-3.3-70b-versatile",
# )


job_creator_agent = agents_manager.create_agent(
    name="JobCreator",
    instructions=JOB_CREATOR_INSTRUCTIONS,
    model="llama-3.3-70b-versatile",
    tools=[fetch_company_details],
)


# Example usage
result = agents_manager.run_agent(
    "JobCreator",
    "Create a job post for a Software Engineer"
)
print(result.final_output)
