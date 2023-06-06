import { Tensor } from './TensorClass';

function transpose(matrix: number[][]) {
  return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
}

export default class Data {
  constructor(
    _dataArray: number[][],
    _indexMin: number,
    _indexMax: number,
    _inputDimension: number,
    _outputDimension: number,
    _batchSize: number
  ) {
    this.input2DTranspose = [];
    this.trueValues2D = [];
    this.indexMin = _indexMin;
    this.indexMax = _indexMax;
    this.numSamples = _indexMax - _indexMin + 1;
    this.inputDimension = _inputDimension;
    this.outputDimension = _outputDimension;
    this.batchSize = _batchSize;
    this.dataArray = _dataArray;

    this.randomIndeces = [];
    for (let i = 0; i < this.batchSize; ++i) {
      const index = Math.floor(Math.random() * this.numSamples) + this.indexMin;
      this.randomIndeces.push(index);
    }
  }

  shuffle() {
    this.randomIndeces = [];
    for (let i = 0; i < this.batchSize; ++i) {
      const index = Math.floor(Math.random() * this.numSamples) + this.indexMin;
      this.randomIndeces.push(index);
    }
    // console.log(this.randomIndeces);
  }

  getInputData() {
    const dataFlat = [];
    for (let i = 0; i < this.batchSize; ++i) {
      const index = this.randomIndeces[i];
      dataFlat.push(this.dataArray[index].slice(1));
    }
    return [].concat(...transpose(dataFlat));
    // return [].concat.apply([], transpose(dataFlat));
  }

  getTrueValues() {
    const trueValuesFlat = [];
    for (let i = 0; i < this.batchSize; ++i) {
      trueValuesFlat.push([]);
      const index = this.randomIndeces[i];
      const trueValue = this.dataArray[index][0];
      for (let j = 0; j < this.outputDimension; ++j) {
        if (j == trueValue) {
          trueValuesFlat[i].push(1);
        } else {
          trueValuesFlat[i].push(0);
        }
      }
    }
    return [].concat(...transpose(trueValuesFlat));
    // return [].concat.apply([], transpose(trueValuesFlat));
  }

  getInputDataBuffer() {
    const dataFlat = [];
    for (let i = 0; i < this.batchSize; ++i) {
      const index = this.randomIndeces[i];
      dataFlat.push(this.dataArray[index].slice(1));
    }
    const res = [].concat(...transpose(dataFlat));
    // const res = [].concat.apply([], transpose(dataFlat));
    return [this.input_rows, this.input_cols, this.tensorInputId].concat(res);
  }

  getTrueValuesBufferClassification() {
    const trueValuesFlat = [];
    for (let i = 0; i < this.batchSize; ++i) {
      trueValuesFlat.push([]);
      const index = this.randomIndeces[i];
      const trueValue = this.dataArray[index][0];
      for (let j = 0; j < this.outputDimension; ++j) {
        if (j == trueValue) {
          trueValuesFlat[i].push(1);
        } else {
          trueValuesFlat[i].push(0);
        }
      }
    }

    const res = [].concat(...transpose(trueValuesFlat));
    return [this.true_rows, this.true_cols, this.tensorTrueId].concat(res);
  }

  getTrueValuesBufferClassify2D() {
    const trueValuesFlat = [];
    for (let i = 0; i < this.batchSize; ++i) {
      trueValuesFlat.push([]);
      const index = this.randomIndeces[i];
      const trueValue = this.dataArray[index][0];
      for (let j = 0; j < this.outputDimension; ++j) {
        if (j == trueValue) {
          trueValuesFlat[i].push(1);
        } else {
          trueValuesFlat[i].push(0);
        }
      }
    }

    const res = [].concat(...transpose(trueValuesFlat));
    // console.log(res)
    return [this.true_rows, this.true_cols, this.tensorTrueId].concat(res);
  }

  getTrueValuesBufferRegression() {
    const trueValuesFlat = [];
    for (let i = 0; i < this.batchSize; ++i) {
      trueValuesFlat.push([]);
      const index = this.randomIndeces[i];
      const trueValue = this.dataArray[index][0];
      trueValuesFlat[i].push(trueValue);
    }

    const res = [].concat(...transpose(trueValuesFlat));
    return [this.true_rows, this.true_cols, this.tensorTrueId].concat(res);
  }

  getTrueValuesAny() {
    if (this.dataSetName == 'simple_sine') {
      return this.getTrueValuesBufferRegression();
    } else if (this.dataSetName == 'MNIST') {
      return this.getTrueValuesBufferClassification();
    } else if (this.dataSetName == 'classify') {
      return this.getTrueValuesBufferClassify2D();
    }
  }

  setInputTensor(tensor: Tensor) {
    this.input_rows = tensor.rows;
    this.input_cols = tensor.cols;
    this.tensorInputId = tensor.id;
  }

  setTrueTensor(tensor: Tensor) {
    this.true_rows = tensor.rows;
    this.true_cols = tensor.cols;
    this.tensorTrueId = tensor.id;
  }

  //public
  indexMin = 0;
  indexMax = 0;
  numSamples = 0;
  inputDimension = 0;
  outputDimension = 0;
  batchSize = 0;

  randomIndeces = [];
  input2DTranspose = [];
  trueValues2D = [];
  dataArray: number[][];

  input_rows = 1;
  input_cols = 1;
  tensorInputId = 0;
  inputOffset = 0;

  true_rows = 1;
  true_cols = 1;
  tensorTrueId = 0;
  trueOffset = 0;

  dataSetName = '';
}
