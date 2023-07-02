// import structs
import structs from '../wgsl_operations/structs.wgsl';

// forward computation imports
import copyInput from '../wgsl_operations/forwardOperations/copyInput.wgsl';
import forward from '../wgsl_operations/forwardOperations/forward.wgsl';
import addTensors from '../wgsl_operations/forwardOperations/addTensors.wgsl';
import correlateTensors from '../wgsl_operations/forwardOperations/correlateTensors.wgsl';
import multiplyTensors from '../wgsl_operations/forwardOperations/multiplyTensors.wgsl';
import ReLUTensor from '../wgsl_operations/forwardOperations/ReLUTensor.wgsl';
import softmaxTensor from '../wgsl_operations/forwardOperations/softmaxTensor.wgsl';
import CETensors from '../wgsl_operations/forwardOperations/CETensors.wgsl';
import MSETensor from '../wgsl_operations/forwardOperations/MSETensor.wgsl';
import OneHotTensor from '../wgsl_operations/forwardOperations/OneHotTensor.wgsl';
const forwards =
  copyInput +
  addTensors +
  correlateTensors +
  multiplyTensors +
  ReLUTensor +
  softmaxTensor +
  CETensors +
  OneHotTensor +
  MSETensor +
  forward;

// partial derivative computation imports
import computePartialDerivatives from '../wgsl_operations/partialDerivativesOperations/computePartialDerivatives.wgsl';
import pd_add from '../wgsl_operations/partialDerivativesOperations/pd_add.wgsl';
import pd_multiply from '../wgsl_operations/partialDerivativesOperations/pd_multiply.wgsl';
import pd_correlate from '../wgsl_operations/partialDerivativesOperations/pd_correlate.wgsl';
import pd_softmaxCE from '../wgsl_operations/partialDerivativesOperations/pd_softmaxCE.wgsl';
import pd_MSE from '../wgsl_operations/partialDerivativesOperations/pd_MSE.wgsl';
const partialDerivatives =
  pd_add +
  pd_multiply +
  pd_correlate +
  pd_softmaxCE +
  pd_MSE +
  computePartialDerivatives;

// partial derivative computation imports
import computeGradients from '../wgsl_operations/addGradientsOperations/computeGradients.wgsl';
import gr_add from '../wgsl_operations/addGradientsOperations/gr_add.wgsl';
import gr_multiply from '../wgsl_operations/addGradientsOperations/gr_multiply.wgsl';
import gr_correlate from '../wgsl_operations/addGradientsOperations/gr_correlate.wgsl';
import gr_ReLU from '../wgsl_operations/addGradientsOperations/gr_ReLU.wgsl';
import gr_softmaxCE from '../wgsl_operations/addGradientsOperations/gr_softmaxCE.wgsl';
import gr_MSE from '../wgsl_operations/addGradientsOperations/gr_MSE.wgsl';
const addGradients =
  gr_add +
  gr_multiply +
  gr_correlate +
  gr_ReLU +
  gr_softmaxCE +
  gr_MSE +
  computeGradients;

// update data operations
import updateData from '../wgsl_operations/updateDataOperations/updateData.wgsl';

// main function import

import main from '../wgsl_operations/main.wgsl';

// others

import { getxValues } from './testSet.js';
import { getPredValues } from './testSet.js';
import { getTrueValues } from './testSet.js';
import { getErrorValue } from './testSet.js';

export async function MatMul(
  setAvgError,
  setEdgesActive,
  setXVals,
  setTrueVals,
  setPredVals,
  Offsets,
  FlatData,
  BackwardTape,
  GradientTape,
  _iterations,
  data,
  model,
  forwardTape,
  gradientTape,
  backwardTape,
  stopLearning,
  setBreakTraining
) {
  // init GPU access
  // console.log('startGPU');
  // console.log('here');
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    return;
  }
  const device = await adapter.requestDevice();
  const numIterations = _iterations;

  // init buffers
  const gpuBufferBackwardTape = device.createBuffer({
    mappedAtCreation: true,
    size: BackwardTape.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  const arrayBufferBackwardTape = gpuBufferBackwardTape.getMappedRange();
  new Float32Array(arrayBufferBackwardTape).set(BackwardTape);
  gpuBufferBackwardTape.unmap();

  const gpuBufferOffsets = device.createBuffer({
    mappedAtCreation: true,
    size: Offsets.byteLength,
    usage: GPUBufferUsage.STORAGE,
  });
  const arrayBufferOffsets = gpuBufferOffsets.getMappedRange();
  new Float32Array(arrayBufferOffsets).set(Offsets);
  gpuBufferOffsets.unmap();

  const gpuBufferFlatData = device.createBuffer({
    mappedAtCreation: true,
    size: FlatData.byteLength,
    usage:
      GPUBufferUsage.STORAGE |
      GPUBufferUsage.COPY_SRC |
      GPUBufferUsage.COPY_DST,
  });

  const arrayBufferFlatData = gpuBufferFlatData.getMappedRange();
  new Float32Array(arrayBufferFlatData).set(FlatData);
  gpuBufferFlatData.unmap();

  const resultMatrixBuffer = device.createBuffer({
    mappedAtCreation: true,
    size: FlatData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
  const arrayBufferResData = resultMatrixBuffer.getMappedRange();
  new Float32Array(arrayBufferResData).set(FlatData);
  resultMatrixBuffer.unmap();

  const controlBuffer = device.createBuffer({
    size: 20,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST, // GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC // | GPUBufferUsage.MAP_WRITE
  });

  data.shuffle();
  let inputData = new Float32Array(data.getInputDataBuffer());
  const inputDataBuffer = device.createBuffer({
    size: inputData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST, // GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC // | GPUBufferUsage.MAP_WRITE
  });

  let trueValues = new Float32Array(data.getTrueValuesAny());
  const trueValuesBuffer = device.createBuffer({
    size: trueValues.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST, // GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC // | GPUBufferUsage.MAP_WRITE
  });

  const gpuBufferGradientTape = device.createBuffer({
    mappedAtCreation: true,
    size: GradientTape.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });
  const arrayBufferGradientTape = gpuBufferGradientTape.getMappedRange();
  new Float32Array(arrayBufferGradientTape).set(GradientTape);
  gpuBufferGradientTape.unmap();

  let EmptyAccuracies = new Float32Array(numIterations);
  const gpuBufferAvgAccuracy = device.createBuffer({
    mappedAtCreation: true,
    size: EmptyAccuracies.byteLength,
    usage:
      GPUBufferUsage.STORAGE |
      GPUBufferUsage.COPY_SRC |
      GPUBufferUsage.COPY_DST,
  });
  const arrayBufferAvgAccuracy = gpuBufferAvgAccuracy.getMappedRange();
  new Float32Array(arrayBufferAvgAccuracy).set(EmptyAccuracies);
  gpuBufferAvgAccuracy.unmap();

  // init Layout
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'read-only-storage',
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },

      {
        binding: 2,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 3,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 4,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 5,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 6,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
      {
        binding: 7,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
    ],
  });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: gpuBufferOffsets,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: gpuBufferFlatData,
        },
      },
      {
        binding: 2,
        resource: {
          buffer: gpuBufferBackwardTape,
        },
      },
      {
        binding: 3,
        resource: {
          buffer: controlBuffer,
        },
      },
      {
        binding: 4,
        resource: {
          buffer: inputDataBuffer,
        },
      },
      {
        binding: 5,
        resource: {
          buffer: gpuBufferGradientTape,
        },
      },
      {
        binding: 6,
        resource: {
          buffer: trueValuesBuffer,
        },
      },
      {
        binding: 7,
        resource: {
          buffer: gpuBufferAvgAccuracy,
        },
      },
    ],
  });

  // + dataAccesHelpers + ...  + backward
  const shaderModule = device.createShaderModule({
    code:
      structs +
      forwards +
      partialDerivatives +
      addGradients +
      updateData +
      main,
  });

  const computePipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module: shaderModule,
      entryPoint: 'main',
    },
  });

  const gpuReadBuffer = device.createBuffer({
    size: FlatData.byteLength,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const gpuReadAvgAccuracyBuffer = device.createBuffer({
    size: EmptyAccuracies.byteLength,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  // var startTime = performance.now();
  let xValues_all = [];
  let predValues_all = [];
  let trueValues_all = [];
  let errorsArray = [];

  var numExtraIterations = 1;
  if (model.batchSize < 50) {
    numExtraIterations = 10;
  } else if (model.batchSize < 100) {
    numExtraIterations = 5;
  } else if (model.batchSize < 200) {
    numExtraIterations = 2;
  }
  const framerate = 20;

  for (
    let iteration = 0;
    iteration < numIterations + 3 * framerate;
    iteration++
  ) {
    if (stopLearning.current) {
      stopLearning.current = false;
      await setBreakTraining(false);
      await setEdgesActive(false);
      return;
    }
    data.shuffle();
    inputData = new Float32Array(data.getInputDataBuffer());
    trueValues = new Float32Array(data.getTrueValuesAny());

    // compute type 0 - update inputData
    device.queue.writeBuffer(
      inputDataBuffer,
      0,
      inputData.buffer,
      0,
      inputData.byteLength
    );
    let inputTensorId = data.tensorInputId;
    let commandEncoder = device.createCommandEncoder();
    let passEncoder = commandEncoder.beginComputePass();
    let control = new Float32Array([
      inputTensorId,
      -1,
      -1,
      0 /* compute type */,
      iteration,
    ]);
    device.queue.writeBuffer(
      controlBuffer,
      0,
      control.buffer,
      0,
      control.byteLength
    );
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    let workgroupCountX = Math.ceil(model.tensors[inputTensorId].rows / 16);
    let workgroupCountY = Math.ceil(model.tensors[inputTensorId].cols / 16);
    passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
    passEncoder.end();
    let gpuCommands = commandEncoder.finish();
    device.queue.submit([gpuCommands]);

    // compute type 0 - update trueValues
    device.queue.writeBuffer(
      trueValuesBuffer,
      0,
      trueValues.buffer,
      0,
      trueValues.byteLength
    );
    let trueValuesTensorId = data.tensorTrueId;
    commandEncoder = device.createCommandEncoder();
    passEncoder = commandEncoder.beginComputePass();
    control = new Float32Array([
      trueValuesTensorId,
      -1,
      -1,
      0 /* compute type */,
      iteration,
    ]);
    device.queue.writeBuffer(
      controlBuffer,
      0,
      control.buffer,
      0,
      control.byteLength
    );
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    workgroupCountX = Math.ceil(model.tensors[trueValuesTensorId].rows / 16);
    workgroupCountY = Math.ceil(model.tensors[trueValuesTensorId].cols / 16);
    passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
    passEncoder.end();
    gpuCommands = commandEncoder.finish();
    device.queue.submit([gpuCommands]);

    // compute type 1 - compute forward -------------------------------------------------------------------------------------------------------------------------------------------------------
    const numInferences = forwardTape.length;
    for (let i = 0; i < numInferences; ++i) {
      const currTensorId = forwardTape[i];
      let commandEncoder = device.createCommandEncoder();
      let passEncoder = commandEncoder.beginComputePass();
      let control = new Float32Array([
        currTensorId,
        -1 /* curr parent of interest */,
        -1 /*curr child of interest */,
        1 /* compute type */,
        iteration,
      ]);
      device.queue.writeBuffer(
        controlBuffer,
        0,
        control.buffer,
        0,
        control.byteLength
      );
      passEncoder.setPipeline(computePipeline);
      passEncoder.setBindGroup(0, bindGroup);
      let workgroupCountX = Math.ceil(model.tensors[currTensorId].rows / 16);
      let workgroupCountY = Math.ceil(model.tensors[currTensorId].cols / 16);
      passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
      passEncoder.end();

      if (
        iteration % framerate < numExtraIterations &&
        i == numInferences - 1
      ) {
        // Encode commands for copying buffer to buffer.
        commandEncoder.copyBufferToBuffer(
          gpuBufferFlatData /* source buffer */,
          0 /* source offset */,
          gpuReadBuffer /* destination buffer */,
          0 /* destination offset */,
          FlatData.byteLength /* size */
        );
        commandEncoder.copyBufferToBuffer(
          gpuBufferAvgAccuracy /* source buffer */,
          0 /* source offset */,
          gpuReadAvgAccuracyBuffer /* destination buffer */,
          0 /* destination offset */,
          EmptyAccuracies.byteLength /* size */
        );
        let gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        // Read buffer & setXVals, setTrueVals, setPredVals,
        await gpuReadBuffer.mapAsync(GPUMapMode.READ);
        await gpuReadAvgAccuracyBuffer.mapAsync(GPUMapMode.READ);
        const arrayBuffer = new Float32Array(gpuReadBuffer.getMappedRange());

        predValues_all.push(getPredValues(arrayBuffer, model, Offsets));
        trueValues_all.push(getTrueValues(arrayBuffer, model, Offsets));
        errorsArray.push(getErrorValue(arrayBuffer, model, Offsets));
        xValues_all.push(getxValues(arrayBuffer, data, Offsets));
        gpuReadBuffer.unmap();
        gpuReadAvgAccuracyBuffer.unmap();
      } else {
        let gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);
      }
    }

    if (iteration % framerate < numExtraIterations) {
      continue;
    }
    if (iteration % framerate == numExtraIterations) {
      let xVals = [].concat(...xValues_all);
      let predVals = [].concat(...predValues_all);
      let trueVals = [].concat(...trueValues_all);
      let avgError = 0;

      for (let error of errorsArray) {
        avgError += error;
      }
      if (errorsArray.length > 0) {
        avgError /= errorsArray.length;
      }

      if (iteration >= framerate - 1) {
        await setPredVals(predVals);
        await setTrueVals(trueVals);
        await setAvgError(avgError);
        await setXVals(xVals);
      }

      predValues_all = [];
      trueValues_all = [];
      xValues_all = [];
      errorsArray = [];
    }

    // compute type 2 - compute partial derivatives
    const numPds = gradientTape.length / 2;
    for (let i = 0; i < numPds; i++) {
      const currTensorId = gradientTape[2 * i + 1];
      const currParentId = gradientTape[2 * i];

      let commandEncoder = device.createCommandEncoder();
      let passEncoder = commandEncoder.beginComputePass();
      let control = new Float32Array([
        currTensorId,
        currParentId /* curr parent of interest */,
        -1 /*curr child of interest */,
        2 /* compute type */,
        iteration,
      ]);
      device.queue.writeBuffer(
        controlBuffer,
        0,
        control.buffer,
        0,
        control.byteLength
      );
      passEncoder.setPipeline(computePipeline);
      passEncoder.setBindGroup(0, bindGroup);

      let workgroupCountX = 1;
      let workgroupCountY = 1;

      if (model.tensors[currTensorId].type == 1) {
        // addition
        workgroupCountX = Math.ceil(model.tensors[currTensorId].rows / 16);
        workgroupCountY = Math.ceil(model.tensors[currParentId].cols / 16);
      } else if (model.tensors[currTensorId].type == 2) {
        // multiplication
        let isRightMultiplicator =
          model.tensors[currParentId].isRightMultiplicator;
        if (isRightMultiplicator) {
          workgroupCountX = Math.ceil(model.tensors[currTensorId].rows / 16);
          workgroupCountY = Math.ceil(model.tensors[currParentId].rows / 16);
        } else {
          workgroupCountX = Math.ceil(model.tensors[currParentId].cols / 16);
          workgroupCountY = Math.ceil(model.tensors[currTensorId].cols / 16);
        }
      } else if (model.tensors[currTensorId].type == 3) {
        // ReLU
        // workgroupCountX = Math.ceil(  model.tensors[ currTensorId ].rows / 16);
        // workgroupCountY = Math.ceil(  model.tensors[ currParentId ].cols / 16);
      } else if (model.tensors[currTensorId].type == 4) {
        //softmax
        workgroupCountX = Math.ceil(model.tensors[currParentId].rows / 16);
        workgroupCountY = Math.ceil(model.tensors[currParentId].cols / 16);
      } else if (model.tensors[currTensorId].type == 5) {
        // CE
        workgroupCountX = Math.ceil(model.tensors[currParentId].rows / 16);
        workgroupCountY = Math.ceil(model.tensors[currParentId].cols / 16);
      } else if (model.tensors[currTensorId].type == 7) {
        // CE
        workgroupCountX = Math.ceil(model.tensors[currParentId].rows / 16);
        workgroupCountY = Math.ceil(model.tensors[currParentId].cols / 16);
      }

      passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
      passEncoder.end();

      let gpuCommands = commandEncoder.finish();
      device.queue.submit([gpuCommands]);
    }

    // compute type 3 - compute and add gradients
    const numGrds = gradientTape.length / 2;
    for (let i = 0; i < numGrds; ++i) {
      const currTensorId = gradientTape[2 * i];
      const currChildId = gradientTape[2 * i + 1];

      let commandEncoder = device.createCommandEncoder();
      let passEncoder = commandEncoder.beginComputePass();
      let control = new Float32Array([
        currTensorId,
        -1 /* curr parent of interest */,
        currChildId /*curr child of interest */,
        3 /* compute type */,
        iteration,
      ]);
      device.queue.writeBuffer(
        controlBuffer,
        0,
        control.buffer,
        0,
        control.byteLength
      );
      passEncoder.setPipeline(computePipeline);
      passEncoder.setBindGroup(0, bindGroup);

      let workgroupCountX = Math.ceil(model.tensors[currTensorId].rows / 16);
      let workgroupCountY = Math.ceil(model.tensors[currTensorId].cols / 16);
      passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
      passEncoder.end();

      let gpuCommands = commandEncoder.finish();
      device.queue.submit([gpuCommands]);
    }

    // compute type 4 - update data
    const numUpdates = backwardTape.length;
    for (let i = 3; i < numUpdates; ++i) {
      const currTensorId = backwardTape[i];

      let commandEncoder = device.createCommandEncoder();
      let passEncoder = commandEncoder.beginComputePass();
      let control = new Float32Array([
        currTensorId,
        -1 /* curr parent of interest */,
        -1 /*curr child of interest */,
        4 /* compute type */,
        iteration,
      ]);
      device.queue.writeBuffer(
        controlBuffer,
        0,
        control.buffer,
        0,
        control.byteLength
      );
      passEncoder.setPipeline(computePipeline);
      passEncoder.setBindGroup(0, bindGroup);

      let workgroupCountX = Math.ceil(model.tensors[currTensorId].rows / 16);
      let workgroupCountY = Math.ceil(model.tensors[currTensorId].cols / 16);
      passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
      passEncoder.end();

      let gpuCommands = commandEncoder.finish();
      device.queue.submit([gpuCommands]);
    }
  }

  // await setBreakTraining(false);
  stopLearning.curren = false;
  await setBreakTraining(false);
  await setEdgesActive(false);

  return;
}
