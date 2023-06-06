struct FlatData {
  entries: array<f32>,
}

/*
types:
  0 - copy
  1 - add
  2 - multiply
  3 - ReLU
  4 - softmax
  5 - CE
  6 - MSE
  7 - Conv2D
*/

struct Offset {
  types: f32,
  isRightMultiplicator: f32,
  requiresGradient: f32,
  rows: f32,
  cols: f32,
  data: f32,
  gradientData: f32,
  velocity_momentum: f32,
  velocity_RMSProp: f32,
  children: f32, 
  parents: f32,
  partialDerivativeLeft: f32,
  partialDerivativeRight: f32,
  metaDimsLength: f32,
  metaDims: f32,
}

struct Offsets {
  amountOfTensors: f32,
  totalLength: f32,
  maxBlockSize: f32,
  tensor: array<Offset>,
}


struct BackwardTape{
  amountOfTensors: f32,
  learningRate: f32,
  momentum: f32,
  order: array<f32>,
}

struct CurrGradient {
  curr : f32,
  child : f32,
}

struct GradientTape{
  order: array<CurrGradient>,
}

struct Control{
  currTensor : f32,
  currParent : f32,
  currChild : f32,
  computeType : f32,
  iteration : f32,
}

struct InputData{
  rows : f32,
  cols : f32,
  tensorId : f32,
  entries : array<f32>
}


struct TrueValues{
  rows : f32,
  cols : f32,
  tensorId : f32,
  entries : array<f32>
}

