from agents import Agent, Runner, AsyncOpenAI, set_default_openai_client, set_tracing_disabled, set_default_openai_api
import os
from dotenv import load_dotenv
from typing import Dict, List, Optional, Any


class Agents:
    """
    A class to manage and classify different types of agents.
    Provides methods to create, configure, and run various agent types.
    """

    def __init__(self):
        """Initialize the Agents manager with configuration."""
        self._load_config()
        self.agents: Dict[str, Agent] = {}

    def _load_config(self):
        """Load environment variables and configure the default client."""
        load_dotenv()

        groq_api_key = os.getenv("GROQ_API_KEY")

        external_client = AsyncOpenAI(
            api_key=groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

        set_default_openai_api("chat_completions")
        set_tracing_disabled(disabled=True)
        set_default_openai_client(external_client, use_for_tracing=False)

    def create_assistant_agent(self, name: str = "Assistant", instructions: str = "You are a helpful assistant", model: str = "llama3-8b-8192") -> Agent:
        """
        Create a general assistant agent.

        Args:
            name: The name of the agent
            instructions: The instructions for the agent
            model: The model to use for the agent

        Returns:
            Agent: The created agent
        """
        agent = Agent(name=name, instructions=instructions, model=model)
        self.agents[name] = agent
        return agent

    def create_job_creator_agent(self, name: str = "JobCreator", instructions: str = "You are a job creation specialist", model: str = "llama3-8b-8192") -> Agent:
        """
        Create a job creator agent.

        Args:
            name: The name of the agent
            instructions: The instructions for the agent
            model: The model to use for the agent

        Returns:
            Agent: The created agent
        """
        agent = Agent(name=name, instructions=instructions, model=model)
        self.agents[name] = agent
        return agent

    def create_agent(self, name: str, instructions: str, model: str = "llama3-8b-8192", **kwargs) -> Agent:
        """
        Create a custom agent with specific parameters.

        Args:
            name: The name of the agent
            instructions: The instructions for the agent
            model: The model to use for the agent
            **kwargs: Additional parameters for the agent

        Returns:
            Agent: The created agent
        """
        agent = Agent(name=name, instructions=instructions,
                      model=model, **kwargs)
        self.agents[name] = agent
        return agent

    def get_agent(self, name: str) -> Optional[Agent]:
        """
        Get an agent by name.

        Args:
            name: The name of the agent

        Returns:
            Agent: The agent if found, None otherwise
        """
        return self.agents.get(name)

    def list_agents(self) -> List[str]:
        """
        Get a list of all agent names.

        Returns:
            List[str]: List of agent names
        """
        return list(self.agents.keys())

    def run_agent(self, agent_name: str, message: str) -> Any:
        """
        Run an agent with a specific message.

        Args:
            agent_name: The name of the agent to run
            message: The message to send to the agent

        Returns:
            Any: The result from the agent
        """
        agent = self.get_agent(agent_name)
        if agent is None:
            raise ValueError(f"Agent '{agent_name}' not found")

        return Runner.run_sync(agent, input=message)

    def run_agent_direct(self, agent: Agent, message: str) -> Any:
        """
        Run an agent directly without storing it.

        Args:
            agent: The agent to run
            message: The message to send to the agent

        Returns:
            Any: The result from the agent
        """
        return Runner.run_sync(agent, message)

    def remove_agent(self, name: str) -> bool:
        """
        Remove an agent by name.

        Args:
            name: The name of the agent to remove

        Returns:
            bool: True if agent was removed, False if not found
        """
        if name in self.agents:
            del self.agents[name]
            return True
        return False

    def clear_agents(self):
        """Clear all agents."""
        self.agents.clear()


# Example usage and testing
if __name__ == "__main__":
    # Create an instance of the Agents manager
    agents_manager = Agents()

    # Create different types of agents
    assistant = agents_manager.create_assistant_agent()
    job_creator = agents_manager.create_job_creator_agent()

    # Run the assistant agent
    result = agents_manager.run_agent("Assistant", "Hello")
    print(f"Assistant response: {result.final_output}")

    # List all agents
    print(f"Available agents: {agents_manager.list_agents()}")
