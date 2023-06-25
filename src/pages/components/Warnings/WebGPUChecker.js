import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const WebGPUChecker = () => {
  const [webGPUSupported, setWebGPUSupported] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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

    const checkWebGPUSupport = () => {
      if ('gpu' in navigator) {
        setWebGPUSupported(true);
        setOpenModal(false);
      } else {
        setWebGPUSupported(false);
        setOpenModal(true);
      }
    };

    checkWebGPUSupport();
    const interval = setInterval(checkWebGPUSupport, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!webGPUSupported && (
        <Modal
          open={openModal}
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
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              bgcolor: 'background.paper',
              borderRadius: '13px',
              boxShadow: 24,
              p: 4,
              overflow: 'auto',
              backgroundImage:
                'linear-gradient(to bottom, rgb(230,240,255), rgb(225,230,255))',
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              WebGPU not supported
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Please enable WebGPU by going to your browser&apos;s
              flags/settings page.
            </Typography>
            {browserFlagsLink && (
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <a
                  href={browserFlagsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to your browser&apos;s flags page.
                </a>
              </Typography>
            )}

            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              If enabling WebGPU in your current browser doesn&apos;t work, you
              could try updating it to the latest version or switching to Chrome
              Canary. This may be particularly useful when using CoViz on a
              mobile device.
            </Typography>

            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <a
                href="https://www.google.com/chrome/canary/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Chrome Canary here.
              </a>
            </Typography>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default WebGPUChecker;
