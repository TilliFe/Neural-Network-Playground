function generateNormalRandom(mean: number, stdDev: number) {
  const u = Math.random(); // uniformly distributed random number between 0 and 1
  const z =
    Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
  return z * stdDev + mean; // transform the standard normal variable into a normal variable with mean and standard deviation
}

export class Tensor {
  constructor(
    _type: string,
    _rows: number,
    _cols: number,
    _requiresGradient: boolean,
    _tensorId: number,
    _metaDims: Array<number> = new Array<number>(0)
  ) {
    this.typestring = _type;
    this.setType(_type);
    this.rows = _rows;
    this.cols = _cols;
    this.metaDims = _metaDims;
    this.requiresGradient = _requiresGradient; // == true ? 1 : 0;
    this.data = new Array<number>(_rows * _cols).fill(0);
    // this.gradientData = _requiresGradient ? new Array<number>(_rows * _cols).fill(0) : new Array<number>(0);
    this.gradientData = new Array<number>(_rows * _cols).fill(0);
    this.velocity_momentum = new Array<number>(_rows * _cols).fill(0);
    this.velocity_RMSProp = new Array<number>(_rows * _cols).fill(0);
    this.id = _tensorId;
  }

  setType(type: string) {
    if (type == 'none') {
      this.type = 0;
    } else if (type == 'add') {
      this.type = 1;
    } else if (type == 'mult') {
      this.type = 2;
    } else if (type == 'ReLU') {
      this.type = 3;
    } else if (type == 'softmax') {
      this.type = 4;
    } else if (type == 'CE') {
      this.type = 5;
    } else if (type == 'OneHot') {
      this.type = 6;
    } else if (type == 'MSE') {
      this.type = 7;
    } else if (type == 'conv2D') {
      this.type = 8;
    }
  }

  setRandomData() {
    const numEntries = this.rows * this.cols;
    for (let i = 0; i < numEntries; ++i) {
      this.data[i] = generateNormalRandom(0, Math.sqrt(2.0 / this.cols));
    }
  }
  //  	  generateNormalRandom(0, 0.5); //
  // Math.random() * 1.0 - 0.5;

  setAllOnes() {
    const numEntries = this.rows * this.cols;
    for (let i = 0; i < numEntries; ++i) {
      this.data[i] = 1;
    }
  }

  addParent(_parent: number) {
    this.parents.push(_parent);
  }

  setParents(_parents: Array<number>) {
    this.parents = _parents;
  }

  addChild(_child: number) {
    this.children.push(_child);
  }

  setChildren(_children: Array<number>) {
    this.children = _children;
  }

  setData(dataArray: Array<number>) {
    if (dataArray.length != this.rows * this.cols) {
      console.log(
        'Error: To set the data of a tensor with an array the dimensions must fit!!!'
      );
    }
    this.data = this.data;
  }

  print() {
    console.log(
      '------------------------------------------------------------------'
    );

    console.log('Type: ' + this.typestring);
    console.log('Id: ' + this.id);
    console.log('Dimension: [' + this.rows + ',' + this.cols + ']');

    let parentsEntries = '';
    for (let i = 0; i < this.parents.length; ++i) {
      parentsEntries += this.parents[i] + ',';
    }
    console.log('Parents: [' + parentsEntries + ']');

    let childrenEntries = '';
    for (let i = 0; i < this.children.length; ++i) {
      childrenEntries += this.children[i] + ',';
    }
    console.log('Children: [' + childrenEntries + ']');

    console.log('\nData:');
    for (let i = 0; i < this.rows; i++) {
      let rowEntries = '    ';
      for (let j = 0; j < this.cols; j++) {
        rowEntries += this.data[i * this.cols + j].toFixed(3) + '  ';
      }
      console.log(rowEntries);
    }

    if (this.gradientData.length > 0) {
      console.log('\nGradient Data: ');
      for (let i = 0; i < this.rows; i++) {
        let rowEntries = '    ';
        for (let j = 0; j < this.cols; j++) {
          rowEntries += this.gradientData[i * this.cols + j].toFixed(3) + '  ';
        }
        console.log(rowEntries);
      }
    }
  }

  // public
  id = 0;
  typestring: string;
  type = 0;
  // numDimensions = 2;
  // dimensions = [1,1];
  rows = 1;
  cols = 1;
  metaDims = [1];
  data = [];
  requiresGradient: boolean;
  isRightMultiplicator = false;
  gradientData = [];
  velocity_momentum = [];
  velocity_RMSProp = [];
  children = [];
  parents = [];
  partialDerivativeLeft = [];
  partialDerivativeRight = [];

  partner_rows = 1;
  partner_cols = 1;

  isInput = false;
  isOutput = false;
  isTrue = false;
  isLast = false;
}
