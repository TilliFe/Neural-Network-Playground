import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { useDispatch } from 'react-redux';
import { computeGraphActions } from '../../../store/ComputeGraph-slice';
import Typography from '@mui/material/Typography';

const buttonStyles = {
  height: '54px',
  borderRadius: '8px',
  backgroundColor: 'rgb(55,55,55)',
  color: 'rgb(255,255,255)',
  marginLeft: '10px',
  marginRight: '10px',
  marginTop: '10px',
  fontSize: '16px',

  '&:hover': {
    backgroundColor: 'rgb(80,80,80)',
  },
};

const SelectModel = () => {
  const [clickedButton, setClickedButton] = useState(1);

  const dispatch = useDispatch();
  const setPredefinedModel = (name) => {
    dispatch(computeGraphActions.setPredefinedModel(name));
  };
  const setClicked = (number) => {
    dispatch(computeGraphActions.setClicked(number));
  };
  const setEdgesActive = (name) => {
    dispatch(computeGraphActions.setEdgesActive(name));
  };

  const handleClick = (buttonNumber) => {
    setClickedButton(buttonNumber);
  };

  const [open, setOpen] = useState(false);

  const handleDocs = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Stack direction="column">
        <Button
          variant="contained"
          onClick={() => {
            handleClick(0);
            setPredefinedModel('');
            setClicked(0);
            setEdgesActive(false);
          }}
          sx={{
            ...buttonStyles,
            backgroundColor:
              clickedButton === 0
                ? 'rgb(90,90,90)'
                : buttonStyles.backgroundColor,
            border: 'solid 2px rgb(155,150,150)',
            height: '65px',
          }}
        >
          New Model
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleClick(1);
            setPredefinedModel('Regression1');
            setClicked(0);
            setEdgesActive(false);
          }}
          sx={{
            ...buttonStyles,
            backgroundColor:
              clickedButton === 1
                ? 'rgb(90,90,90)'
                : buttonStyles.backgroundColor,
          }}
        >
          Regression Model 1
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleClick(2);
            setPredefinedModel('Classification1');
          }}
          sx={{
            ...buttonStyles,
            backgroundColor:
              clickedButton === 2
                ? 'rgb(100,96,100)'
                : buttonStyles.backgroundColor,
          }}
        >
          Classification Model 1
        </Button>
      </Stack>

      <Typography
        variant="body1"
        color="grey.500"
        textAlign="left"
        position="absolute"
        bottom="330px"
        width="230px"
        padding="25px"
      >
        You need to enable <strong style={{ color: 'white' }}>WebGPU</strong> in
        your browser flags!
      </Typography>

      <Typography
        variant="body1"
        color="grey.500"
        textAlign="left"
        position="absolute"
        bottom="260px"
        width="230px"
        padding="25px"
      >
        <strong>Add</strong> a Tensor Node by &apos;Left Click&apos; +
        &apos;Ctrl&apos;
      </Typography>

      <Typography
        variant="body1"
        color="grey.500"
        textAlign="left"
        position="absolute"
        bottom="170px"
        width="230px"
        padding="25px"
      >
        <strong>Connect</strong> two Nodes by dragging from one Node to another
      </Typography>

      <Typography
        variant="body1"
        color="grey.500"
        textAlign="left"
        position="absolute"
        bottom="80px"
        width="230px"
        padding="25px"
      >
        <strong>Remove</strong> any Tensor Node or Edge between Nodes by double
        &apos;Left Click&apos; on it.
      </Typography>

      <Typography
        variant="body1"
        color="grey.500"
        textAlign="left"
        position="absolute"
        bottom="20px"
        width="245px"
        padding="25px"
      >
        <Button
          onClick={handleDocs}
          variant="contained"
          sx={{
            width: '100%',
            color: 'rgb(250,250,250)',
            backgroundColor: 'rgb(50,50,80)',
            borderRadius: '20px',
          }}
        >
          Documentation
        </Button>
      </Typography>
      {/* 
      <NestedModal /> */}
    </div>
  );
};

export default SelectModel;
