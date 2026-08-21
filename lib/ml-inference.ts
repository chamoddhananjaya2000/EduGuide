import modelExport from "@/ml/model_export.json"

export interface StudentMarkInput {
  Sinhala_Tamil: number
  Maths: number
  Science: number
  Buddhism: number
  English: number
  History: number
  Basket1_Subject: string
  Basket1_Marks: number
  Basket2_Subject: string
  Basket2_Marks: number
  Basket3_Subject: string
  Basket3_Marks: number
}

export interface PredictionOutput {
  predictedCareer: string
  confidence: number
  probabilities: { name: string; score: number; percentage: string }[]
}

export function runClientInference(input: StudentMarkInput): PredictionOutput {
  const { cat_columns, num_columns, categories, scaler, coefficients, intercept, classes } = modelExport

  // 1. One-Hot Encode categorical features
  const oheVector: number[] = []
  for (const catCol of cat_columns as (keyof typeof categories)[]) {
    const validCats = categories[catCol]
    const currentVal = input[catCol as keyof StudentMarkInput]
    for (const cat of validCats) {
      oheVector.push(currentVal === cat ? 1.0 : 0.0)
    }
  }

  // 2. Standardize numerical features
  const numVector: number[] = []
  for (let i = 0; i < num_columns.length; i++) {
    const colName = num_columns[i] as keyof StudentMarkInput
    const rawVal = Number(input[colName]) || 0
    const mean = scaler.mean[i]
    const scale = scaler.scale[i]
    const stdVal = (rawVal - mean) / scale
    numVector.push(stdVal)
  }

  // Combined feature vector
  const X = [...oheVector, ...numVector]

  // 3. Compute logits: dot(coefficients[k], X) + intercept[k]
  const logits: number[] = []
  for (let k = 0; k < classes.length; k++) {
    let logit = intercept[k]
    const weights = coefficients[k]
    for (let j = 0; j < X.length; j++) {
      logit += weights[j] * X[j]
    }
    logits.push(logit)
  }

  // 4. Softmax
  const maxLogit = Math.max(...logits)
  const expLogits = logits.map(l => Math.exp(l - maxLogit))
  const sumExp = expLogits.reduce((acc, v) => acc + v, 0)
  const probs = expLogits.map(v => v / sumExp)

  // 5. Find ArgMax
  let maxIdx = 0
  let maxProb = probs[0]
  for (let i = 1; i < probs.length; i++) {
    if (probs[i] > maxProb) {
      maxProb = probs[i]
      maxIdx = i
    }
  }

  const probList = classes.map((cls, idx) => ({
    name: cls,
    score: probs[idx],
    percentage: (probs[idx] * 100).toFixed(2),
  })).sort((a, b) => b.score - a.score)

  return {
    predictedCareer: classes[maxIdx],
    confidence: maxProb * 100,
    probabilities: probList,
  }
}
