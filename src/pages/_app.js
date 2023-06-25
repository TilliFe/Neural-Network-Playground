import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import SetUpData from '../utils/backend/CPU/ModelSetup/setUpData';
import Flow from './components/ReactFlow/FlowGraph';
import SelectModel from './components/SelectionBar/usableModels';
import WebGPUChecker from './components/Warnings/WebGPUChecker';

import { Provider } from 'react-redux';
import store from '../store/index';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import styles from '../styles/styles.css';

import { Analytics } from '@vercel/analytics/react';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    // padding: theme.spacing(10),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const text = 'CoViz';
const colors = [
  { r: 255, g: 165, b: 0 }, // orange
  { r: 255, g: 191, b: 64 },
  { r: 255, g: 218, b: 128 },
  { r: 255, g: 244, b: 191 },
  { r: 173, g: 216, b: 230 }, // light blue
];

const characters = text.split('').map((char, i) => {
  const color = colors[i];
  const style = {
    color: `rgb(${color.r}, ${color.g}, ${color.b})`,
  };

  return (
    <span key={i} style={style}>
      {char}
    </span>
  );
});

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Provider store={store} class={styles} sx={{ fontSize: '10px' }}>
        <ThemeProvider theme={darkTheme}>
          <WebGPUChecker />
          <Box sx={{ display: 'flex', bgcolor: 'rgb(40,40,40)' }}>
            <AppBar
              position="fixed"
              open={open}
              sx={{ border: '0px', color: 'white', bgcolor: 'rgb(40,40,40)' }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ mr: 1, ...(open && { display: 'none' }) }}
                >
                  <MenuIcon sx={{ color: 'rgb(230,230,230)' }} />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  noWrap
                  sx={{
                    width: '100%',
                    fontSize: 32,
                  }}
                >
                  {characters}
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              sx={{
                width: drawerWidth,

                flexShrink: 1,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  height: '100vh',
                  boxSizing: 'border-box',
                  color: 'white',
                },
              }}
              variant="persistent"
              anchor="left"
              open={open}
            >
              <DrawerHeader
                sx={{ bgcolor: 'rgb(40,40,40)', padding: 0, margin: 0 }}
              >
                <IconButton
                  onClick={handleDrawerClose}
                  sx={{ color: 'rgb(200,200,200)', margin: '10px' }}
                >
                  {theme.direction === 'ltr' ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <SelectModel />
            </Drawer>
            <Main open={open} style={{ height: '100vh' }}>
              <Flow />
              <SetUpData />
            </Main>
          </Box>
        </ThemeProvider>
      </Provider>
      <Analytics />
    </>
  );
}
