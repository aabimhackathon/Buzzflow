import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/../../.."))

from backend.vepari_ai.core.intent import intent_detector

EVAL_BENCHMARK = [
    ("Show today's sales.", "SALES_QUERY"),
    ("How much profit did I make this month?", "PROFIT_QUERY"),
    ("Open inventory.", "NAVIGATION"),
    ("Which products are low?", "INVENTORY_QUERY"),
    ("Show customers who haven't paid.", "CUSTOMER_QUERY"),
    ("Open my profit and loss.", "REPORT_QUERY"),
    ("Why did profit fall this month?", "BUSINESS_ANALYSIS"),
    ("Create a payment voucher for ₹25,000 to ABC Suppliers.", "VOUCHER_CREATE"),
    ("Validate this voucher.", "VOUCHER_VALIDATE"),
    ("Find government schemes for my business.", "GOVERNMENT_SCHEME")
]

def run_eval() -> dict:
    correct = 0
    total = len(EVAL_BENCHMARK)
    results = []

    for query, expected_intent in EVAL_BENCHMARK:
        detected = intent_detector.detect(query)
        is_correct = detected["intent"] == expected_intent
        if is_correct:
            correct += 1
        else:
            print(f"Mismatch: '{query}' -> Expected: {expected_intent}, Got: {detected['intent']}")
        results.append({
            "query": query,
            "expected": expected_intent,
            "detected": detected["intent"],
            "correct": is_correct
        })

    accuracy = (correct / total) * 100
    print(f"Eval Accuracy: {accuracy:.1f}% ({correct}/{total})")
    return {"accuracy": accuracy, "results": results}

if __name__ == "__main__":
    run_eval()
