import { IconButton, Modal, Box, Typography } from '@mui/material';
import { HelpOutlineRounded } from '@mui/icons-material';
import { useState } from 'react';

export const HelpBtn = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <HelpOutlineRounded />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="casino-box
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            min-w-44 max-w-fit p-4
            shadow-[0_0_6px_2px] shadow-poker-highlight
            bg-black
            "
        >
          <Typography className="text-poker-highlight" id="modal-modal-title" variant="h6" component="h2">
            Rules
          </Typography>
          <Typography id="modal-modal-description" className="mt-1">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};
