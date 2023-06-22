import { useEffect, useRef } from 'react';
import Papa, { ParseResult } from 'papaparse';

import { useSelector, useDispatch } from 'react-redux';
import { computeGraphActions } from '../../../../store/ComputeGraph-slice';
// import 'reactflow/dist/style.css';

import Data from '../tools/DataClass';
import setUpModel from './setUpModel';

interface Tensor {
  id: string;
  modelId: number;
  modelParents: number[];
  modelChildren: number[];
  isRight: boolean;
  type: string;
  animated: boolean;
  dragHandle: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    type: string;
    initialization: string;
    rows: number;
    cols: number;
    requiresGradient: boolean;
    parents: number[];
    children: number[];
    isLast: boolean;
    isTrue: boolean;
    isInput: boolean;
    isOutput: boolean;
    metaDims: number[];
  };
}

interface RootState {
  computeGraph: {
    tensors: Tensor[];
    iterations: number;
    learningRate: number;
    momentum: number;
    dataset: string;
    batchSize: number;
    breakTraining: boolean;
  };
}

function SetUpData() {
  const tensors = useSelector((state: RootState) => state.computeGraph.tensors);
  const iterations = useSelector(
    (state: RootState) => state.computeGraph.iterations
  );
  const learningRate = useSelector(
    (state: RootState) => state.computeGraph.learningRate
  );
  const momentum = useSelector(
    (state: RootState) => state.computeGraph.momentum
  );
  const dataset = useSelector((state: RootState) => state.computeGraph.dataset);
  const batchSize = useSelector(
    (state: RootState) => state.computeGraph.batchSize
  );

  const breakTraining = useSelector(
    (state: RootState) => state.computeGraph.breakTraining
  );

  const stopLearning = useRef(false);

  useEffect(() => {
    if (breakTraining) {
      stopLearning.current = true;
    }
    // wait for a second to make sure the training is stopped
    // setTimeout(() => {
    //   stopLearning.current = false;
    // }, 500);
  }, [breakTraining]);

  const dispatch = useDispatch();
  const setXVals = (xVals: unknown) => {
    dispatch(computeGraphActions.setXVals(xVals));
  };
  const setPredVals = (predVals: unknown) => {
    dispatch(computeGraphActions.setPredVals(predVals));
  };
  const setTrueVals = (trueVals: unknown) => {
    dispatch(computeGraphActions.setTrueVals(trueVals));
  };
  const setAvgError = (avgError: unknown) => {
    dispatch(computeGraphActions.setAvgError(avgError));
  };
  const setEdgesActive = (bl: boolean) => {
    dispatch(computeGraphActions.setEdgesActive(bl));
  };
  const setBreakTraining = (bl: boolean) => {
    dispatch(computeGraphActions.setBreakTraining(bl));
  };

  const getCSV_regression = () => {
    const inputString =
      dataset == 'easy_regr.'
        ? '/Datasets/data.csv'
        : dataset == 'medium_regr.'
        ? '/Datasets/data2.csv'
        : dataset == 'hard_regr.'
        ? '/Datasets/data3.csv'
        : '';
    Papa.parse(inputString, {
      header: false,
      download: true,
      skipEmptyLines: true,
      delimiter: ',',
      complete: (results: ParseResult<unknown>) => {
        const dataArray = results.data.map(
          (row: unknown) =>
            Object.values(row).map((value: string, index: number) =>
              index == 0 ? Number(value) : Number(value) / 1
            ) // divide each value by 255
        );

        const data = new Data(dataArray, 2, 10000, 1, 1, batchSize);
        data.dataSetName = 'simple_sine';

        setUpModel(
          setAvgError,
          setEdgesActive,
          setXVals,
          setTrueVals,
          setPredVals,
          data,
          tensors,
          iterations,
          learningRate,
          momentum,
          batchSize,
          stopLearning,
          setBreakTraining
        );
      },
    });
  };

  const getCSV_classification = () => {
    Papa.parse('/Datasets/MNIST_train.csv', {
      header: false,
      download: true,
      skipEmptyLines: true,
      delimiter: ',',
      complete: (results: ParseResult<unknown>) => {
        const dataArray = results.data.map((row: unknown) =>
          Object.values(row).map((value: string, index: number) =>
            index == 0 ? Number(value) : Number(value) / 255
          )
        );

        const data = new Data(dataArray, 2, 1000, 784, 10, batchSize);
        data.dataSetName = 'MNIST';
        setUpModel(
          setAvgError,
          setEdgesActive,
          setXVals,
          setTrueVals,
          setPredVals,
          data,
          tensors,
          iterations,
          learningRate,
          momentum,
          batchSize,
          stopLearning,
          setBreakTraining
        );
      },
    });
  };

  const getCSV_classify = () => {
    const inputString =
      dataset == 'easy_class.'
        ? '/Datasets/dataClass1.csv'
        : dataset == 'medium_class.'
        ? '/Datasets/dataClass2.csv'
        : dataset == 'hard_class.'
        ? '/Datasets/dataClass3.csv'
        : '';
    Papa.parse(inputString, {
      header: false,
      download: true,
      skipEmptyLines: true,
      delimiter: ',',
      complete: (results: ParseResult<unknown>) => {
        const dataArray = results.data.map((row: unknown) =>
          Object.values(row).map((value: string, index: number) =>
            index == 0 ? Number(value) : Number(value)
          )
        );

        const data = new Data(dataArray, 2, 10000, 2, 2, batchSize);
        data.dataSetName = 'classify';
        setUpModel(
          setAvgError,
          setEdgesActive,
          setXVals,
          setTrueVals,
          setPredVals,
          data,
          tensors,
          iterations,
          learningRate,
          momentum,
          batchSize,
          stopLearning,
          setBreakTraining
        );
      },
    });
  };

  useEffect(() => {
    if (tensors.length == 0) {
      return;
    }
    setEdgesActive(true);
    if (
      dataset == 'easy_regr.' ||
      dataset == 'medium_regr.' ||
      dataset == 'hard_regr.'
    ) {
      getCSV_regression();
    } else if (dataset == 'MNIST') {
      getCSV_classification();
    } else if (
      dataset == 'easy_class.' ||
      dataset == 'medium_class.' ||
      dataset == 'hard_class.'
    ) {
      getCSV_classify();
    }
  }, [tensors]);

  return <></>;
}

export default SetUpData;
