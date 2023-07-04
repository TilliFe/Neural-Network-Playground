import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { computeGraphActions } from '../../../store/ComputeGraph-slice';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Info from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import PlotSVG from '../D3/PlotSVG';
import LossPlot from '../D3/LossPlot';
import ClassifyPlot from '../D3/classificationPlot';
import InfoComponent from '../SelectionBar/InfoComponent';

function TensorNode({ data, isConnectable, id, modelId }) {
  // =========  states =====================================================

  const edgesActive = useSelector((state) => state.computeGraph.edgesActive);
  const predefinedModel = useSelector(
    // this is the model name
    (state) => state.computeGraph.predefinedModel
  );

  const [type, setType] = useState(data.type);
  const [initialization, setInitialization] = useState(data.initialization);
  const [rows, setRows] = useState(data.rows);
  const [cols, setCols] = useState(data.cols);
  const [metaDims, setMetaDims] = useState(data.metaDims.join(','));
  const [requiresGradient, setRequiresGradient] = useState(
    data.requiresGradient
  );
  const [isLast] = useState(data.isLast);
  const [isTrue, setIsTrue] = useState(data.isTrue);
  const [isInput, setIsInput] = useState(data.isInput);
  const [isOutput, setIsOutput] = useState(data.isOutput);
  const [addBias, setAddBias] = useState(data.addBias);
  const [dataSet, setDataSet] =
    predefinedModel === 'Regression1' || predefinedModel === 'Regression1raw'
      ? useState('medium_regr.')
      : predefinedModel === 'Classification1' ||
        predefinedModel === 'Classification1raw'
      ? useState('easy_class.')
      : useState('');
  const [iterations, setIterations] = useState(2000);
  const [learningRate, setLearningRate] =
    predefinedModel === 'Regression1' || predefinedModel === 'Regression1raw'
      ? useState(0.01)
      : predefinedModel === 'Classification1' ||
        predefinedModel === 'Classification1raw'
      ? useState(0.5)
      : useState(0.01);
  const [momentum, setMomentum] =
    predefinedModel === 'Regression1' || predefinedModel === 'Regression1raw'
      ? useState(0.96)
      : predefinedModel === 'Classification1' ||
        predefinedModel === 'Classification1raw'
      ? useState(0.9)
      : useState(0.9);
  const [batchSize, setBatchSize] =
    predefinedModel === 'Regression1' || predefinedModel === 'Regression1raw'
      ? useState(64)
      : predefinedModel === 'Classification1' ||
        predefinedModel === 'Classification1raw'
      ? useState(48)
      : useState(1);
  const [displayedDataType, setShowDisplayedDataType] =
    predefinedModel === 'Regression1' || predefinedModel === 'Regression1raw'
      ? useState('regr2D')
      : useState('classy2D');
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(0);

  // =========  setter for states =========================================

  React.useEffect(() => {
    data.type = type;
    if (type == 'input') {
      setIsInput(true);
    } else {
      setIsInput(false);
    }
    if (type == 'isTrue') {
      setIsTrue(true);
    } else {
      setIsTrue(false);
    }
    setTemp(temp + 1);
  }, [type]);

  React.useEffect(() => {
    return;
  }, [temp]);

  React.useEffect(() => {
    data.rows = Number(rows);
    setTemp(temp + 1);
    setMetaDims(String(rows));
  }, [rows]);

  React.useEffect(() => {
    data.addBias = addBias;
    setTemp(temp + 1);
  }, [addBias]);

  React.useEffect(() => {
    data.cols = Number(cols);
    setTemp(temp + 1);
  }, [cols]);

  React.useEffect(() => {
    data.metaDims = metaDims.split(',').map(Number);
    setTemp(temp + 1);
  }, [metaDims]);

  React.useEffect(() => {
    data.requiresGradient = requiresGradient;
    setTemp(temp + 1);
  }, [requiresGradient]);

  React.useEffect(() => {
    data.isLast = isLast;
    setTemp(temp + 1);
  }, [isLast]);

  React.useEffect(() => {
    if (type == 'MSE' || type == 'CE') {
      data.isLast = true;
      setTemp(temp + 1);
    } else {
      data.isLast = false;
      setTemp(temp + 1);
    }
  }, [type]);

  React.useEffect(() => {
    data.isTrue = isTrue;
    setTemp(temp + 1);
  }, [isTrue]);

  React.useEffect(() => {
    data.isOutput = isOutput;
    setTemp(temp + 1);
  }, [isOutput]);

  React.useEffect(() => {
    data.isInput = isInput;
    setTemp(temp + 1);
  }, [isInput]);

  React.useEffect(() => {
    data.initialization = initialization;
    setTemp(temp + 1);
  }, [initialization]);

  // =========  Redux states updates =====================================

  const dispatch = useDispatch();
  const setLastTensor = () => {
    dispatch(computeGraphActions.setLastTensor(id));
  };
  const setModelIterations = (its) => {
    dispatch(computeGraphActions.setModelIterations(its));
  };
  const setModelLearningRate = (lr) => {
    dispatch(computeGraphActions.setModelLearningRate(lr));
  };
  const setModelMomentum = (mtn) => {
    dispatch(computeGraphActions.setModelMomentum(mtn));
  };
  const setDataSetName = (name) => {
    dispatch(computeGraphActions.setDataSetName(name));
  };
  const setBatchSizeNumber = (bs) => {
    dispatch(computeGraphActions.setBatchSize(bs));
  };
  const setBreakTraining = (e) => {
    dispatch(computeGraphActions.setBreakTraining(e));
  };

  React.useEffect(() => {
    if (!isInput) {
      return;
    }
    setDataSetName(dataSet);
    setTemp(temp + 1);
  }, [dataSet]);

  useEffect(() => {
    if (!isLast) {
      return;
    }
    setModelIterations(iterations);
    setModelLearningRate(learningRate);
    setModelMomentum(momentum);
    setBatchSizeNumber(batchSize);
    setTemp(temp + 1);
  }, [iterations, learningRate, momentum, batchSize]);

  const clickButton = () => {
    setLastTensor();
    setTemp(temp + 1);
    // setIsTraining(true);
  };

  const clickBreakTraining = () => {
    setBreakTraining(true);
    setTemp(temp + 1);
  };

  const handleOpen = () => {
    setOpen(true);
    setTemp(temp + 1);
  };
  const handleClose = () => {
    setOpen(false);
    setTemp(temp + 1);
  };

  // =========  styling ==================================================

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const dragHandleStyle = {
    backgroundImage:
      data.type == 'add'
        ? `url('/tensorTypeImages/addition.png')`
        : data.type == 'mult'
        ? `url('/tensorTypeImages/multiplication.png')`
        : data.type == 'ReLU'
        ? `url('/tensorTypeImages/ReLU.png')`
        : data.type == 'Dense'
        ? `url('/tensorTypeImages/Dense.png')`
        : data.type == 'softmax'
        ? `url('/tensorTypeImages/softmax.png')`
        : data.type == 'CE' || data.type == 'MSE'
        ? `url('/tensorTypeImages/CE.png')`
        : `url('/tensorTypeImages/none.png')`,
    backgroundSize: 'cover',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1), 0 6px 15px 0 rgba(0,0 0,0.1)',
    backgroundPosition: 'center',
    height: '80px',
    width: '100%',
    marginBottom: 3,
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
  };

  const singleInput = {
    top: 50,
    zIndex: 1,
    background:
      data.type === 'ReLU' || data.type === 'softmax' || data.type === 'Dense'
        ? 'rgb(160,160,160)'
        : 'transparent',
    border: `7px solid ${
      data.type === 'ReLU' || data.type === 'softmax' || data.type === 'Dense'
        ? 'rgb(160,160,160)'
        : 'transparent'
    }`,
    left: -8,
  };
  const upperInput = {
    top: 30,
    zIndex: 1,
    background:
      data.type === 'add' ||
      data.type === 'mult' ||
      data.type === 'CE' ||
      data.type === 'MSE'
        ? 'rgb(160,160,160)'
        : 'transparent',
    border: `7px solid ${
      data.type === 'add' ||
      data.type === 'mult' ||
      data.type === 'CE' ||
      data.type === 'MSE'
        ? 'rgb(160,160,160)'
        : 'transparent'
    }`,
    left: -8,
  };
  const lowerInput = {
    top: 70,
    zIndex: 1,
    background:
      data.type === 'add' ||
      data.type === 'mult' ||
      data.type === 'CE' ||
      data.type === 'MSE'
        ? 'rgb(160,160,160)'
        : 'transparent',
    border: `7px solid ${
      data.type === 'add' ||
      data.type === 'mult' ||
      data.type === 'CE' ||
      data.type === 'MSE'
        ? 'rgb(160,160,160)'
        : 'transparent'
    }`,
    left: -8,
  };
  const output = {
    top: 50,
    background: 'rgb(160,160,160)',
    border: '7px solid rgb(160,160,160)',
    right: -8,
  };

  const nodeStyle = {
    height:
      isOutput && displayedDataType == 'none'
        ? '334px'
        : isOutput &&
          (displayedDataType == 'regr2D' || displayedDataType == 'classy2D')
        ? '574px'
        : type == 'CE' || type == 'MSE'
        ? '622px'
        : type == 'ReLU' || type == 'softmax'
        ? '186px'
        : type == 'Dense'
        ? '274px'
        : type == 'isTrue'
        ? '237px'
        : type == 'add' || type == 'mult'
        ? '208px'
        : '330px', // if none
    width: '250px',
    border: '2px solid rgb(160,160,160)',
    borderRadius: '10px',
    background: 'rgba(250,250,250,1.0)',
    padding: '10px',
  };

  const textBoxStyle = {
    marginTop: '7px',
    width: '100%',
  };

  // =========  return ==================================================

  return (
    <>
      <div style={nodeStyle}>
        <div style={{ position: 'relative' }}>
          <IconButton
            onClick={handleOpen}
            style={{ position: 'absolute', top: 0, zIndex: 1, color: 'grey' }}
          >
            <Info />
          </IconButton>
          <div style={labelStyle}>
            <span className="custom-drag-handle" style={dragHandleStyle} />
          </div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              {type == 'mult'
                ? 'Multiplication'
                : type == 'add'
                ? 'Addition'
                : type == 'ReLU'
                ? 'ReLU Activation'
                : type == 'Dense'
                ? 'Dense'
                : type == 'softmax'
                ? 'Softmax'
                : type == 'CE'
                ? 'Cross Entropy Loss'
                : type == 'MSE'
                ? 'Mean Squared Error Loss'
                : type == 'isTrue'
                ? 'Ground Truth'
                : type == 'input'
                ? 'Input'
                : 'None - Simple Matrix'}
            </DialogTitle>
            <DialogContent>
              <div
                style={{
                  width: 400,
                  height: 400,
                  overflow: 'auto',
                }}
              >
                <InfoComponent type={type} />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>

        <div>{modelId}</div>
        {type == 'MSE' || type == 'CE' ? (
          <>
            {!edgesActive ? (
              <Button
                onClick={clickButton}
                variant="contained"
                sx={{
                  marginTop: '5px',
                  width: '100%',
                  height: '35px',
                  bgcolor: 'rgb(190,210,210)',
                  borderRadius: '5px',
                  color: 'rgb(0,0,0)',
                  '&:hover': { bgcolor: 'rgb(200,210,210)' },
                  boxShadow:
                    '0 4px 8px 0 rgba(0,0,0,0.01), 0 6px 15px 0 rgba(0,0 0,0.01)',
                }}
              >
                Start Training
              </Button>
            ) : (
              <Button
                onClick={clickBreakTraining}
                variant="contained"
                sx={{
                  marginTop: '5px',
                  width: '100%',
                  height: '35px',
                  bgcolor: 'rgb(210,190,210)',
                  borderRadius: '5px',
                  color: 'rgb(0,0,0)',
                  '&:hover': { bgcolor: 'rgb(210,200,210)' },
                  boxShadow:
                    '0 4px 8px 0 rgba(0,0,0,0.01), 0 6px 15px 0 rgba(0,0 0,0.01)',
                }}
              >
                Stop Training
              </Button>
            )}
            <Box
              sx={{
                height: '0.2px',
                width: '100%',
                backgroundColor: 'rgba(100,100,100,3)',
                marginTop: '7px',
                marginBottom: '2px',
              }}
            />
          </>
        ) : null}

        <FormControl sx={textBoxStyle}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body1">Operator</Typography>
            </Grid>
            <Grid item xs={7}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                }}
                displayEmpty
                style={{ height: '40px', width: '100%' }}
              >
                <MenuItem value={'none'}>none</MenuItem>
                <MenuItem value={'input'}>Input</MenuItem>
                <MenuItem value={'isTrue'}>true Values</MenuItem>
                <MenuItem value={'add'}>Add</MenuItem>
                <MenuItem value={'mult'}>Multiply</MenuItem>
                <MenuItem value={'ReLU'}>ReLU</MenuItem>
                <MenuItem value={'softmax'}>Softmax</MenuItem>
                <MenuItem value={'CE'}>CE Loss</MenuItem>
                <MenuItem value={'MSE'}>MSE</MenuItem>
                <MenuItem value={'Dense'}>Dense</MenuItem>
                <MenuItem value={'conv2d'}>Conv2D</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </FormControl>

        {type != 'CE' && type != 'MSE' ? (
          <div>
            {type == 'none' ||
            type == 'input' ||
            type == 'isTrue' ||
            type == 'mult' ||
            type == 'add' ? (
              <>
                <FormControl sx={{ ...textBoxStyle, height: 'auto' }}>
                  <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {type == 'none' || type == 'mult' || type == 'add' ? (
                      <Grid item xs={5}>
                        <Typography variant="subtitle1">Rows/Cols</Typography>
                      </Grid>
                    ) : (
                      <Grid item xs={5}>
                        <Typography variant="subtitle1">SampleSize</Typography>
                      </Grid>
                    )}
                    {type == 'none' || type == 'mult' || type == 'add' ? (
                      <>
                        <Grid item xs={3.5}>
                          <TextField
                            id="rows"
                            value={rows}
                            onChange={(event) => setRows(event.target.value)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={3.5}>
                          <TextField
                            id="rows"
                            value={cols}
                            onChange={(event) => setCols(event.target.value)}
                            size="small"
                          />
                        </Grid>
                      </>
                    ) : (
                      <Grid item xs={7}>
                        <TextField
                          id="rows"
                          value={rows}
                          onChange={(event) => setRows(event.target.value)}
                          size="small"
                        />
                      </Grid>
                    )}
                  </Grid>
                </FormControl>
                {isInput ? (
                  <FormControl sx={{ ...textBoxStyle, height: 'auto' }}>
                    <Grid
                      container
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item xs={5}>
                        <Typography variant="subtitle1">MetaDims</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <TextField
                          id="rows"
                          value={metaDims}
                          onChange={(event) => setMetaDims(event.target.value)}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                ) : null}
              </>
            ) : null}

            {type == 'Dense' ? (
              <FormControl sx={{ ...textBoxStyle, height: 'auto' }}>
                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={5}>
                    <Typography variant="subtitle1">Neurons</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      id="rows"
                      value={rows}
                      onChange={(event) => setRows(event.target.value)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </FormControl>
            ) : null}

            {type == 'none' || isInput ? (
              isInput ? (
                <div>
                  <FormControl sx={textBoxStyle}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={5}>
                        <Typography variant="body1">Dataset</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={dataSet}
                          onChange={(event) => {
                            setDataSet(event.target.value);
                          }}
                          displayEmpty
                          style={{ height: '40px', width: '100%' }}
                        >
                          <MenuItem value={'easy_regr.'}>easy_regr.</MenuItem>
                          <MenuItem value={'medium_regr.'}>
                            medium_regr.
                          </MenuItem>
                          <MenuItem value={'hard_regr.'}>hard_regr.</MenuItem>
                          <MenuItem value={'easy_class.'}>easy_class.</MenuItem>
                          <MenuItem value={'medium_class.'}>
                            medium_class.
                          </MenuItem>
                          <MenuItem value={'hard_class.'}>hard_class.</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </FormControl>
                </div>
              ) : (
                <div>
                  <FormControl sx={textBoxStyle}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={5}>
                        <Typography variant="body1">Initialization</Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={initialization}
                          onChange={(event) => {
                            setInitialization(event.target.value);
                          }}
                          displayEmpty
                          style={{ height: '40px', width: '100%' }}
                        >
                          <MenuItem value={'zeros'}>all Zeros</MenuItem>
                          <MenuItem value={'ones'}>all Ones</MenuItem>
                          <MenuItem value={'random'}>Random</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </FormControl>
                </div>
              )
            ) : null}

            <FormGroup>
              {type == 'none' && !isInput && !isTrue ? (
                <FormControlLabel
                  sx={{ marginTop: '7px' }}
                  control={
                    <Checkbox
                      sx={{
                        '& .MuiSvgIcon-root': {
                          fontSize: 18,
                          color: 'rgb(25,25,20)',
                        },
                      }}
                      checked={requiresGradient}
                      label={'Requires Gradient'}
                      onChange={(event) =>
                        setRequiresGradient(event.target.checked)
                      }
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label={
                    <span style={{ fontSize: 15 }}>Requires Gradient</span>
                  }
                />
              ) : null}

              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: 18,
                        color: 'rgb(20,20,20)',
                      },
                    }}
                    id="isOutput"
                    label={'isOutput'}
                    checked={isOutput}
                    onChange={(event) => setIsOutput(event.target.checked)}
                  />
                }
                label={<span style={{ fontSize: 15 }}>Is Prediction</span>}
              />
            </FormGroup>
          </div>
        ) : null}

        {type == 'Dense' ? (
          <FormControlLabel
            sx={{ marginTop: '7px' }}
            control={
              <Checkbox
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: 'rgb(25,25,20)',
                  },
                }}
                checked={addBias}
                label={'Requires Gradient'}
                onChange={(event) => setAddBias(event.target.checked)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label={<span style={{ fontSize: 15 }}>Add Bias</span>}
          />
        ) : null}

        {isOutput ? (
          <>
            <FormControl sx={textBoxStyle}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={5}>
                  <Typography variant="body1">DisplayType</Typography>
                </Grid>
                <Grid item xs={7}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={displayedDataType}
                    onChange={(event) => {
                      setShowDisplayedDataType(event.target.value);
                    }}
                    displayEmpty
                    style={{ height: '40px', width: '100%' }}
                  >
                    <MenuItem value={'none'}>Do not show</MenuItem>
                    <MenuItem value={'regr2D'}>Regression2D</MenuItem>
                    <MenuItem value={'classy2D'}>Classification2D</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </FormControl>
            <Box
              sx={{
                height: '0.2px',
                width: '100%',
                backgroundColor: 'transparent',
                marginTop: '7px',
                marginBottom: '2px',
              }}
            />

            {displayedDataType == 'regr2D' ? (
              <PlotSVG />
            ) : displayedDataType == 'classy2D' ? (
              <ClassifyPlot />
            ) : null}
            {/* <div style={{ display: 'flex', margin: 2, marginLeft: '20px' }}> */}
            {displayedDataType == 'regr2D' ? (
              <div style={{ display: 'flex', margin: 2, marginLeft: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 40,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: 'rgb(20,140,250)',
                      margin: 7,
                    }}
                  />
                  <span style={{ fontSize: '10px' }}>True Values</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: 'rgb(250,150,20)',
                      margin: 7,
                    }}
                  />
                  <span style={{ fontSize: '10px' }}>Prediction</span>
                </div>
              </div>
            ) : displayedDataType == 'classy2D' ? (
              <>
                <div style={{ display: 'flex', margin: 2, marginLeft: '20px' }}>
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: 40,
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          backgroundColor: 'rgb(20,140,250)',
                          margin: 7,
                        }}
                      />
                      <span style={{ fontSize: '10px' }}>Label 0</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          backgroundColor: 'rgb(250,150,20)',
                          margin: 7,
                        }}
                      />
                      <span style={{ fontSize: '10px' }}>Label 1</span>
                    </div>
                  </div>
                </div>
                <div style={{ alignItems: 'center', marginLeft: 25 }}>
                  <span style={{ fontSize: '11px' }}>
                    Dots: Predictions, Voronoi: True Values
                  </span>
                </div>
              </>
            ) : null}
          </>
        ) : null}

        {type == 'MSE' || type == 'CE' ? (
          <div>
            <FormControl sx={{ ...textBoxStyle, height: 'auto' }}>
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Iterations</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="iterations"
                    value={iterations}
                    onChange={(event) =>
                      setIterations(Number(event.target.value))
                    }
                    size="small"
                  />
                </Grid>
              </Grid>
            </FormControl>

            <FormControl sx={{ ...textBoxStyle, height: 'auto' }}>
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Learning Rate</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="learningRate"
                    value={learningRate}
                    onChange={(event) =>
                      setLearningRate(Number(event.target.value))
                    }
                    size="small"
                  />
                </Grid>
              </Grid>
            </FormControl>

            <FormControl sx={{ ...textBoxStyle, height: 'auto' }}>
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Momentum</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="momentum"
                    value={momentum}
                    onChange={(event) =>
                      setMomentum(Number(event.target.value))
                    }
                    size="small"
                  />
                </Grid>
              </Grid>
            </FormControl>

            <FormControl sx={{ ...textBoxStyle, height: 'auto' }}>
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Typography variant="subtitle1">BatchSize</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="batchsize"
                    value={batchSize}
                    onChange={(event) =>
                      setBatchSize(Number(event.target.value))
                    }
                    size="small"
                  />
                </Grid>
              </Grid>
            </FormControl>
          </div>
        ) : null}

        {type == 'CE' || type == 'MSE' ? <LossPlot /> : null}

        <Handle
          type="target"
          position={Position.Left}
          id="Left"
          style={upperInput}
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="Single"
          style={singleInput}
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="Right"
          style={lowerInput}
          isConnectable={isConnectable}
        />

        <Handle
          type="source"
          position={Position.Right}
          id="Source"
          style={output}
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
}

export default TensorNode;
