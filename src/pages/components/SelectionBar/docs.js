import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: '15px',
  border: '2px solid rgb(50,50,80)',
  overflow: 'auto',
  margin: '20px',

  // q: change the scrollbar width
  '&::-webkit-scrollbar': {
    width: '10px',
  },
};

export default function NestedModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography
        variant="body1"
        color="grey.500"
        textAlign="left"
        position="absolute"
        bottom="14px"
        width="245px"
        padding="25px"
      >
        <Button
          onClick={handleOpen}
          variant="contained"
          sx={{
            width: '100%',
            color: 'rgb(255,255,255)',
            backgroundColor: 'rgb(60,60,100)',
            borderRadius: '20px',
            fontSize: '17px',
          }}
        >
          First Steps
        </Button>
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style }}>
          <Typography
            id="modal-modal-title"
            variant="h3"
            component="h2"
            sx={{
              color: 'rgb(140,0,100)',
              margin: '30px',
              marginBottom: '40px',
            }}
          >
            CoViz - First Steps
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              sx={{ marginTop: '10px' }}
            >
              Built with WebGPU, CoViz is a visual playground for building and
              training Neural Networks.
            </Typography>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '30px' }}
            >
              Enabling WebGPU
              <Typography id="modal-modal-title" variant="h6" component="h2">
                You must enable the WebGPU flag in your Browser to train a
                Neural Network. You can find the WebGPU flag in chrome://flags.
              </Typography>
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '30px' }}
            >
              Getting started
              <Typography id="modal-modal-title" variant="h6" component="h2">
                We recommend checking out the prebuild Neural Networks first.
                You find them in the left sidebar. We provide several simple
                Neural Network architectures for Classification and Regression
                tasks. Before clicking on <strong>Start Training</strong> you
                must select a dataset and tune some of the hyperparameters such
                as the
                <strong> batchSize</strong>, the <strong>learningRate</strong>{' '}
                and the number forward and backward <strong>iterations</strong>.
                Click on the small <strong> Info Button</strong> on the top of
                the Nodes to get a more Information on each Node Type.
              </Typography>
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '30px' }}
            >
              How to build your own Neural Network
              <Typography id="modal-modal-title" variant="h6" component="h2">
                After you got familiar with the prebuild Neural Networks you can
                start building your own Neural Network by clicking on{' '}
                <strong>NEW MODEL</strong> or you manipulate the prebuild Models
                to your needs such as adding new layers or changing the
                hyperparameters. You can add a Tensor Node by clicking on{' '}
                <strong>Ctrl</strong> + <strong>Left Click</strong>. This will
                place a Node on the canvas. You can connect two Nodes by
                clicking on the output of the first Node and then drag you
                curser to the input of the second Node. You can delete a Node or
                an Edge between Nodes with a<strong> Double Click</strong>. You
                can drag a Node by clicking on the Image at the top and then
                dragging it to the desired position.
              </Typography>
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h4"
              component="h2"
              sx={{ margin: '30px' }}
            >
              What if you encounter a deadlock?
              <Typography id="modal-modal-title" variant="h6" component="h2">
                CoViz and the underlying differentiable programming engine are
                still in development. Sometimes you might encounter a deadlock
                while traing. In these situations please reload the page and try
                again.
              </Typography>
            </Typography>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
