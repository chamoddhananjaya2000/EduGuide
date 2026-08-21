"""
EduGuide ONNX Runtime Inference Example
Demonstrates how to run local high-speed career prediction using ONNX Runtime.
"""

import os
import numpy as np
import onnxruntime as rt

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "eduguide_career_prediction_model.onnx")

def predict_career(student_data: dict, model_path: str = MODEL_PATH):
    """
    Predicts career path given student mark details.
    
    Expected keys in student_data:
      - Sinhala_Tamil (float)
      - Maths (float)
      - Science (float)
      - Buddhism (float)
      - English (float)
      - History (float)
      - Basket1_Subject (str)
      - Basket1_Marks (float)
      - Basket2_Subject (str)
      - Basket2_Marks (float)
      - Basket3_Subject (str)
      - Basket3_Marks (float)
    """
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"ONNX model not found at: {model_path}")

    # Initialize ONNX inference session
    session = rt.InferenceSession(model_path)

    # Format inputs for ONNX runtime
    input_feed = {}
    for inp in session.get_inputs():
        name = inp.name
        val = student_data.get(name)
        if "Subject" in name:
            input_feed[name] = np.array([[str(val)]], dtype=np.object_)
        else:
            input_feed[name] = np.array([[float(val)]], dtype=np.float32)

    # Execute inference
    outputs = session.run(None, input_feed)
    predicted_label = outputs[0][0]
    probabilities = outputs[1][0] if len(outputs) > 1 else {}

    return {
        "predicted_career": predicted_label,
        "probabilities": probabilities
    }

if __name__ == "__main__":
    sample_student = {
        "Sinhala_Tamil": 75.0,
        "Maths": 92.0,
        "Science": 88.0,
        "Buddhism": 80.0,
        "English": 85.0,
        "History": 70.0,
        "Basket1_Subject": "Commerce",
        "Basket1_Marks": 90.0,
        "Basket2_Subject": "Music",
        "Basket2_Marks": 65.0,
        "Basket3_Subject": "ICT",
        "Basket3_Marks": 95.0
    }

    print("Running ONNX Inference with sample student data...")
    result = predict_career(sample_student)
    print(f"\n[RESULT] Predicted Career: {result['predicted_career']}")
    print("\n[PROBABILITIES]:")
    for career, prob in sorted(result['probabilities'].items(), key=lambda x: x[1], reverse=True):
        print(f"  - {career}: {prob * 100:.2f}%")
