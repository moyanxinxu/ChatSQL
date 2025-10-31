import json
import os
from pathlib import Path

import yaml


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

    def dump_config(self):
        return self

    def save(self):
        if self.filename is None:
            self.filename = os.path.join(self.save_dir, "config", "base.yaml")
            os.makedirs(os.path.dirname(self.filename), exist_ok=True)

        if self.filename.endswith(".json"):
            with open(self.filename, "w+") as f:
                json.dump(self.__dict__(), f, indent=4, ensure_ascii=False)
        elif self.filename.endswith(".yaml"):
            with open(self.filename, "w+") as f:
                yaml.dump(self.__dict__(), f, indent=2, allow_unicode=True)
        else:
            with open(self.filename, "w+") as f:
                json.dump(self, f, indent=4)
