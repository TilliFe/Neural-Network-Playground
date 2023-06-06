import { Grid } from '@mui/material';
import SetUpData from '../utils/backend/CPU/ModelSetup/setUpData';
import Flow from './components/ReactFlow/FlowGraph';
import React from 'react';
import SelectModel from './components/SelectionBar/usableModels';

import { Provider } from 'react-redux';
import store from '../store/index';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import styles from '../styles/styles.css';
import NestedModal from './components/SelectionBar/docs';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function App() {
  return (
    <Provider store={store} class={styles}>
      <ThemeProvider theme={darkTheme}>
        <Grid container direction="column" style={{ height: '100vh' }}>
          <Grid item container style={{ flexGrow: 1 }}>
            <Grid item style={{ backgroundColor: 'rgb(40,40,40)', width: 300 }}>
              <Grid item style={{ height: 60 }}>
                <Toolbar
                  variant="dense"
                  sx={{ backgroundColor: 'rgb(10,10,10)', minHeight: '60px' }}
                >
                  <SportsBasketballIcon
                    sx={{
                      color: 'rgb(150,250,250)',
                      zIndex: 1,
                      marginLeft: '-13px',
                      fontSize: '30px',
                    }}
                  />
                  <Typography
                    marginLeft="9px"
                    backgroundColor="transparent"
                    color="rgb(250,250,250)"
                    fontWeight={500}
                    variant="h5"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  >
                    CoViz
                  </Typography>
                </Toolbar>
              </Grid>
              <SelectModel />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Flow />
              <SetUpData />
            </Grid>
          </Grid>
        </Grid>
        <NestedModal />
      </ThemeProvider>
    </Provider>
  );
}
