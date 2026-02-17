import { IconButton, Modal, Box, Typography, List, ListItem, Divider } from '@mui/material';
import { HelpOutlineRounded } from '@mui/icons-material';
import { useMemo, useState } from 'react';

export const HelpBtn = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const rankOrder = useMemo(() => (
    [
      {
        name: 'Royal flush',
        example: [{ value: 'A♠️', used: true }, { value: 'K♠️', used: true }, { value: 'Q♠️', used: true }, { value: 'J♠️', used: true }, { value: '10♠️', used: true }],
      },
      {
        name: 'Royal flush',
        example: [{ value: 'A♠️', used: true }, { value: 'K♠️', used: true }, { value: 'Q♠️', used: true }, { value: 'J♠️', used: true }, { value: '10♠️', used: true }],
      },
      {
        name: 'Royal flush',
        example: [{ value: 'A♠️', used: true }, { value: 'K♠️', used: true }, { value: 'Q♠️', used: true }, { value: 'J♠️', used: true }, { value: '10♠️', used: true }],
      },
      {
        name: 'Royal flush',
        example: [{ value: 'A♠️', used: true }, { value: 'K♠️', used: true }, { value: 'Q♠️', used: true }, { value: 'J♠️', used: true }, { value: '10♠️', used: true }],
      },
      {
        name: 'Royal flush',
        example: [{ value: 'A♠️', used: true }, { value: 'K♠️', used: true }, { value: 'Q♠️', used: true }, { value: 'J♠️', used: true }, { value: '10♠️', used: true }],
      },
    ]
  ), []);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <HelpOutlineRounded />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
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
          <List aria-label="Rank Order">
            <Divider />
            {rankOrder.map((rank) => (
              <>
                <ListItem key={rank.name}>
                  <div className="flex gap-1 w-50">
                    {rank.example.map((card) => (
                      <div
                        key={card.value}
                        className={`w-10 h-8 text-[12px] flex justify-center items-center border rounded-md border-solid ${card.used ? 'border-poker-highlight' : 'border-poker-disabled'}`}
                      >
                        {card.value}
                      </div>
                    ))}
                  </div>
                  {rank.name}
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};
