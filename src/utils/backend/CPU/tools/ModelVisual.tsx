import { Tensor } from './TensorClass';

export class Model {
  tensors: Array<Tensor> = [];
  numTensors = -1;
  lastTensor = 0;
  learningRate = 0.3;
  momentum = 0;
  outputTensor = 0;
  trueTensor = 0;
  batchSize: number;

  tensor(
    _type: string,
    _rows: number,
    _cols: number,
    _requiresGradient: boolean,
    initialization: string
  ): Tensor {
    this.numTensors = this.numTensors + 1;
    const newTensor = new Tensor(
      _type,
      _rows,
      _cols,
      _requiresGradient,
      this.numTensors
    );
    if (initialization == 'random') {
      newTensor.setRandomData();
    } else if (initialization == 'ones') {
      newTensor.setAllOnes();
    } else if (initialization == 'zeros') {
      newTensor.setAllOnes();
    }
    this.tensors.push(newTensor);
    return newTensor;
  }

  add(left: Tensor, right: Tensor): Tensor {
    if (left.rows != right.rows || left.cols != right.cols) {
      console.log('Error: Addition requires same dimensions of added tensors!');
      // process.exit(1);
    }
    this.numTensors = this.numTensors + 1;
    const resRequiresGradient = true; //left.requiresGradient || right.requiresGradient;
    const res = new Tensor(
      'add',
      left.rows,
      left.cols,
      resRequiresGradient,
      this.numTensors
    );
    res.addParent(left.id);
    res.addParent(right.id);
    this.tensors[left.id].addChild(this.numTensors);
    this.tensors[right.id].addChild(this.numTensors);
    this.tensors.push(res);
    return res;
  }

  mult(left: Tensor, right: Tensor): Tensor {
    if (left.cols != right.rows) {
      console.log('Error: Multiplication requires cols(left) = rows(right)!');
      // process.exit(1);
    }
    this.numTensors = this.numTensors + 1;
    const resRequiresGradient = true; //left.requiresGradient || right.requiresGradient;
    const res = new Tensor(
      'mult',
      left.rows,
      right.cols,
      resRequiresGradient,
      this.numTensors
    );
    res.addParent(left.id);
    res.addParent(right.id);
    this.tensors[left.id].addChild(this.numTensors);
    this.tensors[right.id].addChild(this.numTensors);
    this.tensors[right.id].isRightMultiplicator = true;
    this.tensors.push(res);
    return res;
  }

  ReLU(single: Tensor): Tensor {
    this.numTensors = this.numTensors + 1;
    const resRequiresGradient = true; //single.requiresGradient;
    const res = new Tensor(
      'ReLU',
      single.rows,
      single.cols,
      resRequiresGradient,
      this.numTensors
    );
    res.addParent(single.id);
    this.tensors[single.id].addChild(this.numTensors);
    this.tensors.push(res);
    return res;
  }

  OneHot(single: Tensor): Tensor {
    this.numTensors = this.numTensors + 1;
    const resRequiresGradient = false; //single.requiresGradient;
    const res = new Tensor(
      'OneHot',
      single.rows,
      single.cols,
      resRequiresGradient,
      this.numTensors
    );
    res.addParent(single.id);
    this.tensors[single.id].addChild(this.numTensors);
    this.tensors.push(res);
    return res;
  }

  softmax(single: Tensor): Tensor {
    this.numTensors = this.numTensors + 1;
    const resRequiresGradient = true; //single.requiresGradient;
    const res = new Tensor(
      'softmax',
      single.rows,
      single.cols,
      resRequiresGradient,
      this.numTensors
    );
    res.addParent(single.id);
    this.tensors[single.id].addChild(this.numTensors);
    this.tensors.push(res);
    return res;
  }

  CE(trueValues: Tensor, predValues: Tensor): Tensor {
    if (
      trueValues.rows != predValues.rows ||
      trueValues.cols != predValues.cols
    ) {
      console.log(
        'Error: Cross Entropy requires same dimensions of comparing tensors!'
      );
      // process.exit(1);
    }
    this.numTensors = this.numTensors + 1;
    const resRequiresGradient = false; // : boolean = trueValues.requiresGradient || predValues.requiresGradient;
    const res = new Tensor('CE', 1, 1, resRequiresGradient, this.numTensors);
    res.addParent(trueValues.id);
    res.addParent(predValues.id);
    trueValues.addChild(this.numTensors);
    predValues.addChild(this.numTensors);
    this.tensors.push(res);
    return res;
  }

  MSE(trueValues: Tensor, predValues: Tensor): Tensor {
    if (
      trueValues.rows != predValues.rows ||
      trueValues.cols != predValues.cols
    ) {
      console.log('Error: MSE requires same dimensions of comparing tensors!');
      // process.exit(1);
    }
    this.numTensors = this.numTensors + 1;
    const resRequiresGradient = false; // : boolean = trueValues.requiresGradient || predValues.requiresGradient;
    const res = new Tensor('MSE', 1, 1, resRequiresGradient, this.numTensors);
    res.addParent(trueValues.id);
    res.addParent(predValues.id);
    trueValues.addChild(this.numTensors);
    predValues.addChild(this.numTensors);
    this.tensors.push(res);
    return res;
  }

  print() {
    for (let i = 1; i < this.numTensors; ++i) {
      this.tensors[i].print();
    }
  }

  setData(tensor: Tensor, dataArray: Array<number>) {
    this.tensors[tensor.id].data = dataArray;
  }
}
