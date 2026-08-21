"""
EduGuide ML Model to ONNX Conversion Script
Converts trained scikit-learn (.joblib) pipelines into ONNX format for ultra-fast, cross-platform inference.
"""

import os
import joblib
import numpy as np
import pandas as pd
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType, StringTensorType

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define input schema matching student marksheets
INITIAL_TYPES = [
    ('Sinhala_Tamil', FloatTensorType([None, 1])),
    ('Maths', FloatTensorType([None, 1])),
    ('Science', FloatTensorType([None, 1])),
    ('Buddhism', FloatTensorType([None, 1])),
    ('English', FloatTensorType([None, 1])),
    ('History', FloatTensorType([None, 1])),
    ('Basket1_Subject', StringTensorType([None, 1])),
    ('Basket1_Marks', FloatTensorType([None, 1])),
    ('Basket2_Subject', StringTensorType([None, 1])),
    ('Basket2_Marks', FloatTensorType([None, 1])),
    ('Basket3_Subject', StringTensorType([None, 1])),
    ('Basket3_Marks', FloatTensorType([None, 1])),
]

MODELS_TO_CONVERT = [
    ("career_path_logistic_regression_final.joblib", "career_path_logistic_regression.onnx"),
    ("career_path_random_forest.joblib", "career_path_random_forest.onnx"),
    ("eduguide_career_prediction_model.joblib", "eduguide_career_prediction_model.onnx"),
]

def convert_all():
    print("=" * 60)
    print("EduGuide Model -> ONNX Converter")
    print("=" * 60)

    for joblib_name, onnx_name in MODELS_TO_CONVERT:
        joblib_path = os.path.join(BASE_DIR, joblib_name)
        onnx_path = os.path.join(BASE_DIR, onnx_name)

        if not os.path.exists(joblib_path):
            print(f"[SKIP] Joblib file not found: {joblib_name}")
            continue

        print(f"\n[CONVERT] Loading {joblib_name}...")
        model = joblib.load(joblib_path)

        print(f"[CONVERT] Converting to ONNX format (target opset 17)...")
        onx = convert_sklearn(
            model,
            name=onnx_name.replace(".onnx", ""),
            initial_types=INITIAL_TYPES,
            target_opset=17
        )

        with open(onnx_path, "wb") as f:
            f.write(onx.SerializeToString())

        size_kb = os.path.getsize(onnx_path) / 1024
        print(f"[SUCCESS] Saved ONNX model to: {onnx_name} ({size_kb:.2f} KB)")

    print("\n[DONE] All models converted successfully!")

if __name__ == "__main__":
    convert_all()
