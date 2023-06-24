import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';

import { useDispatch } from 'react-redux';
import { computeGraphActions } from '../../../store/ComputeGraph-slice';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';

const buttonStyles = {
  height: '53px',
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

  return (
    <Paper
      style={{
        backgroundColor: 'rgb(40,40,40)',
        height: '100vh',
        borderRadius: 0,
      }}
    >
      <Stack style={{ height: '65%', overflow: 'auto' }} direction="column">
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
            border: 'solid 0px rgb(155,150,150)',
            height: '53px',
            paddingLeft: '25px',
          }}
          startIcon={<AddIcon />}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              paddingLeft: '3px',
            }}
          >
            New Model
          </Box>
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              paddingLeft: '3px',
            }}
          >
            Regression Model 1
          </Box>
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              width: '100%',
              paddingLeft: '3px',
            }}
          >
            Classification Model 1
          </Box>
        </Button>
      </Stack>
      <Stack style={{ height: '27%', overflow: 'auto' }} direction="column">
        <Typography color="grey.500" padding="3px" margin="8px" fontSize="13px">
          You need to enable <strong style={{ color: 'white' }}>WebGPU</strong>{' '}
          in your browser flags!
        </Typography>

        <Typography color="grey.500" padding="3px" margin="8px" fontSize="13px">
          <strong>Add</strong> a Tensor Node by &apos;Left Click&apos; +
          &apos;Ctrl&apos;
        </Typography>

        <Typography color="grey.500" padding="3px" margin="8px" fontSize="13px">
          <strong>Connect</strong> two Nodes by dragging from one Node to
          another
        </Typography>

        <Typography color="grey.500" padding="3px" margin="8px" fontSize="13px">
          <strong>Remove</strong> any Tensor Node or Edge between Nodes by
          double &apos;Left Click&apos; on it.
        </Typography>

        <Typography color="grey.500" padding="3px" margin="8px"></Typography>
      </Stack>

      <Button
        onClick={() =>
          window.open(
            'https://github.com/TilliFe/CoViz-Neural-Network-Playground'
          )
        }
        variant="contained"
        sx={{
          position: 'relative',
          width: '270px',
          height: '48px',
          color: 'rgb(255,255,255)',
          backgroundColor: 'rgb(60,50,70)',
          borderRadius: '10px',
          fontSize: '15px',
          margin: '12px',
        }}
        startIcon={<GitHubIcon />}
      >
        GitHub Docs
      </Button>
    </Paper>
  );
};

export default SelectModel;
