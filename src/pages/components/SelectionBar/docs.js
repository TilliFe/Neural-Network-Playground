import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';

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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  maxWidth: '800px',
  height: '70%',
  bgcolor: 'background.paper',
  pt: 1,
  px: 1,
  pb: 1,
  borderRadius: '14px',
  border: 'none',
  overflow: 'auto',
  paddingLeft: '19px',
  paddingRight: '14px',
  paddingTop: '19px',
  paddingBottom: '19px',
};

export default function Docs() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [browserFlagsLink, setBrowserFlagsLink] = useState(null);

  useEffect(() => {
    const getBrowserFlagsLink = () => {
      const userAgent = navigator.userAgent;
      if (userAgent.includes('Chrome')) {
        return 'chrome://flags/#enable-unsafe-webgpu';
      } else if (userAgent.includes('Firefox')) {
        return 'about:config';
      } else if (userAgent.includes('Safari')) {
        return 'https://developer.apple.com/documentation/webkit/experimental_features';
      } else if (userAgent.includes('Edg/')) {
        return 'edge://flags/#enable-webgpu';
      } else {
        return null;
      }
    };

    setBrowserFlagsLink(getBrowserFlagsLink());
  }, []);

  return (
    <div>
      <style>
        {`
          /* For WebKit (Safari, Chrome, etc.) */
          ::-webkit-scrollbar {
            width: 4px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 20px;
            border: 4px solid transparent;
          }

          /* For Firefox */
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
          }
        `}
      </style>
      <Typography
        color="grey.300"
        textAlign="left"
        width="94%"
        padding="8px"
        zIndex={0}
      >
        <Button
          onClick={handleOpen}
          variant="contained"
          sx={{
            width: '100%',
            color: 'rgb(255,255,255)',
            backgroundColor: 'rgb(50,50,50)',
            borderRadius: '8px',
            fontSize: '14px',
            '&:hover': {
              backgroundColor: 'rgb(60,60,60)',
            },
          }}
        >
          Getting Started
        </Button>
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: 'blur(4px)',
            },
          },
        }}
      >
        <Box sx={{ ...style }}>
          <Typography
            id="modal-modal-title"
            variant="h3"
            component="h2"
            sx={{
              color: 'rgb(140,0,100)',
              margin: '0px',
              marginBottom: '40px',
              padding: '30px',
              borderRadius: '8px',
              background:
                'linear-gradient(45deg, rgb(50,20,30) 30%, rgb(40,10,50) 90%)',
            }}
          >
            <Typography
              variant="h6"
              component="div"
              noWrap
              sx={{
                margin: '15px',
                width: '100%',
                fontSize: { xs: '45px', md: '50px', lg: '55px' },
              }}
            >
              {characters}
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h4"
              sx={{
                margin: '15px',
                width: '100%',
                padding: 0,
                color: 'rgb(2000,200,200)',
                fontSize: { xs: '20px', md: '25px', lg: '30px' },
              }}
            >
              A Neural Network Plyground - Built with WebGPU
            </Typography>
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            variant="h6"
            component="h2"
          >
            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '10px', marginTop: '30px', mt: 5 }}
            >
              Enabling WebGPU
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
                variant="h6"
                component="h2"
              >
                In order to make CoViz work, please enable WebGPU by going to
                your browser&apos;s flags/settings page.
              </Typography>
              {browserFlagsLink && (
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                  variant="h6"
                  component="h2"
                >
                  <a
                    href={browserFlagsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go to your browser&apos;s flags page.
                  </a>
                </Typography>
              )}
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
                variant="h6"
                component="h2"
              >
                If enabling WebGPU in your current browser doesn&apos;t work,
                you could try updating it to the latest version or switching to
                Chrome Canary. This may be particularly useful when using CoViz
                on a mobile device.
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
                variant="h6"
                component="h2"
              >
                <a
                  href="https://www.google.com/chrome/canary/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Chrome Canary here.
                </a>
              </Typography>
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '10px', marginTop: '30px', mt: 5 }}
            >
              What even is a Neural Network?
              <Typography
                id="modal-modal-title"
                sx={{ mt: 2 }}
                variant="h6"
                component="h2"
              >
                A <strong>Neural Network</strong> is a machine learning model
                inspired by the human brain. It consists of layers of nodes
                connected by edges. Each node receives input, performs a
                computation, and passes the result to the next layer.
                <br />
                <br />
                The computation involves taking a weighted sum of inputs, adding
                a bias, and applying an activation function. The weights and
                biases are learned from data during training, allowing the
                network to approximate complex functions and make predictions.
                <br />
                <br />
                CoViz lets you build and train Neural Networks visually, making
                it easier to experiment with different architectures and
                understand how they work.
                <br />
                <br />
                For further reading, check out the{' '}
                <a
                  href="https://en.wikipedia.org/wiki/Neural_network"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikipedia page on artificial neural networks
                </a>
                .
              </Typography>
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '10px', marginTop: '30px', mt: 5 }}
            >
              Getting started with CoViz
              <Typography
                id="modal-modal-title"
                sx={{ mt: 2 }}
                variant="h6"
                component="h2"
              >
                We recommend starting by exploring the prebuilt Neural Networks,
                which can be found in the left sidebar. These include several
                simple Neural Network architectures for Classification and
                Regression tasks.
                <br />
                <br />
                Before starting training, you can select a dataset and adjust
                some of the hyperparameters such as the batchSize, learningRate,
                and the number of forward and backward iterations. For more
                information on each Node Type, click on the small Info Button on
                the top of the Nodes.
              </Typography>
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '10px', marginTop: '30px', mt: 5 }}
            >
              How to build your own Neural Network
              <Typography
                id="modal-modal-title"
                sx={{ mt: 2 }}
                variant="h6"
                component="h2"
              >
                After you have become familiar with the prebuilt Neural
                Networks, you can start building your own Neural Network by
                clicking on <strong>NEW MODEL</strong> or by manipulating the
                prebuilt Models to meet your needs, such as adding new layers or
                changing the hyperparameters.
                <br />
                <br />
                You can add a Tensor Node by right-clicking with your mouse.
                This will place a Node on the canvas. You can connect two Nodes
                by clicking on the output of the first Node and then dragging
                your cursor to the input of the second Node. You can delete a
                Node or an Edge between Nodes with a Double Click. You can drag
                a Node by clicking on the Image at the top and then dragging it
                to the desired position.
              </Typography>
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '10px', marginTop: '30px', mt: 5 }}
            >
              What if you encounter a deadlock?
              <Typography
                id="modal-modal-title"
                sx={{ mt: 2 }}
                variant="h6"
                component="h2"
              >
                CoViz and the underlying differentiable programming engine are
                still in development. Sometimes you might encounter a deadlock
                while training. In these situations, please reload the page and
                try again.
              </Typography>
            </Typography>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
