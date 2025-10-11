import json
import os
from pathlib import Path


class SimpleConfig(dict):
    def __str__(self) -> str:
        return json.dumps(self)

    def __setattr__(self, key, value) -> None:
        self[key] = value

    def __getattr__(self, key):
        return self.get(key)

    def __getitem__(self, key):
        return self.get(key)

    def __setitem__(self, key, value) -> None:
        return super().__setitem__(key, value)

    def __dict__(self):
        return {k: v for k, v in self.items()}

    def update(self, other):
        for key, value in other.items():
            self[key] = value


class Config(SimpleConfig):
    def __init__(self):
        super().__init__()
        self._config_items = {}
        self.save_path = os.getenv("SAVE_PATH", "saves")
        self.filename = str(Path(f"{self.save_path}/config/base.yaml"))

        os.makedirs(os.path.dirname(self.filename), exist_ok=True)
