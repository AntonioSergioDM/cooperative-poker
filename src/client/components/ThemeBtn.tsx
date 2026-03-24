import {
  Box, Button, IconButton, Modal, Stack, Typography,
} from '@mui/material';
import { ColorLens } from '@mui/icons-material';
import { availableThemes, useCardTheme } from '@/client/tools/useTheme';
import { Fragment, useState } from 'react';
import AnimatedCard, { SMALL_CARD } from '@/client/components/AnimatedCard/AnimatedCard';

export const ThemeBtn = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [cover, setCover, front, setFront] = useCardTheme();

  const card = {
    suit: 1,
    value: 11,
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <ColorLens />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box
          className="casino-box
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[90vw] max-w-lg p-6
              shadow-[0_0_6px_2px] shadow-poker-highlight
              bg-black text-white
              max-h-[85vh] overflow-y-auto no-scrollbar
              rounded-xl border border-gray-800
              outline-none
              "
        >
          <Typography
            className="text-poker-highlight mb-6 text-center font-bold tracking-widest uppercase border-b border-gray-800 pb-4"
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            Card Themes
          </Typography>
          <div className="flex flex-row gap-5 justify-center flex-wrap">
            {availableThemes.map((theme) => (
              <Fragment key={theme}>
                <Stack spacing={-5} direction="row">
                  <Button variant="text" onClick={() => setCover(theme)}>
                    <AnimatedCard width={SMALL_CARD} card={null} theme={theme} pulse={theme === cover} clickable />
                  </Button>
                  <Button variant="text" onClick={() => setFront(theme)}>
                    <AnimatedCard width={SMALL_CARD} card={card} theme={theme} pulse={theme === front} clickable />
                  </Button>
                </Stack>
              </Fragment>
            ))}
          </div>
        </Box>
      </Modal>
    </>
  );
};
