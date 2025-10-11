import asyncio

from src.agents.chatbot import ChatBotAgent


class AgentsManager:
    def __init__(self):
        self._classes = {}
        self._instances = {}

    def register_agent(self, agent_class):
        self._classes[agent_class.__name__] = agent_class

    def init_all_agents(self):
        for agent_id in self._classes.keys():
            self.get_agent(agent_id)

    def get_agent(self, agent_id, reload=False, **kwargs):
        if reload or agent_id not in self._instances:
            agent_class = self._classes[agent_id]
            self._instances[agent_id] = agent_class()

        return self._instances[agent_id]

    def get_agents(self):
        return list(self._instances.values())

    async def reload_all(self):
        for agent_id in self._classes.keys():
            self.get_agent(agent_id, reload=True)

    async def get_agents_info(self):
        agents = self.get_agents()
        return await asyncio.gather(*[agent.get_info() for agent in agents])


agent_manager = AgentsManager()
agent_manager.register_agent(ChatBotAgent)
agent_manager.init_all_agents()
