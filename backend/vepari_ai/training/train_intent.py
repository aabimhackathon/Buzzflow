import json
import os

def validate_dataset(filepath: str) -> bool:
    if not os.path.exists(filepath):
        print(f"Dataset {filepath} not found.")
        return False

    valid_count = 0
    with open(filepath, 'r') as f:
        for line in f:
            if line.strip():
                data = json.loads(line)
                if "text" in data and "intent" in data:
                    valid_count += 1
    
    print(f"Validated {valid_count} dataset records in {filepath}.")
    return True

if __name__ == "__main__":
    dataset_path = os.path.join(os.path.dirname(__file__), "../training_data/intent_dataset.jsonl")
    validate_dataset(dataset_path)
