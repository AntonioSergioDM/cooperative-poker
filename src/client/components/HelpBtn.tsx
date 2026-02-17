import {
  IconButton, List, ListItem,
  Modal, Box, Typography, Divider,
} from '@mui/material';
import { HelpOutlineRounded } from '@mui/icons-material';
import { useMemo, useState, Fragment } from 'react';

export const HelpBtn = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const rankOrder = useMemo(() => (
    [
      {
        name: 'Royal Flush',
        example: [{ value: 'A ♠️', used: true }, { value: 'K ♠️', used: true }, { value: 'Q ♠️', used: true }, { value: 'J ♠️', used: true }, { value: '10 ♠️', used: true }],
      },
      {
        name: 'Straight Flush',
        example: [{ value: '9 ♥️', used: true }, { value: '8 ♥️', used: true }, { value: '7 ♥️', used: true }, { value: '6 ♥️', used: true }, { value: '5 ♥️', used: true }],
      },
      {
        name: 'Four of a Kind',
        example: [{ value: '7 ♣️', used: true }, { value: '7 ♦️', used: true }, { value: '7 ♠️', used: true }, { value: '7 ♥️', used: true }, { value: 'K ♠️', used: false }],
      },
      {
        name: 'Full House',
        example: [{ value: 'J ♦️', used: true }, { value: 'J ♠️', used: true }, { value: 'J ♥️', used: true }, { value: '4 ♣️', used: true }, { value: '4 ♦️', used: true }],
      },
      {
        name: 'Flush',
        example: [{ value: 'K ♣️', used: true }, { value: '10 ♣️', used: true }, { value: '7 ♣️', used: true }, { value: '6 ♣️', used: true }, { value: '2 ♣️', used: true }],
      },
      {
        name: 'Straight',
        example: [{ value: 'Q ♦️', used: true }, { value: 'J ♣️', used: true }, { value: '10 ♥️', used: true }, { value: '9 ♠️', used: true }, { value: '8 ♦️', used: true }],
      },
      {
        name: 'Three of a Kind',
        example: [{ value: 'Q ♣️', used: true }, { value: 'Q ♦️', used: true }, { value: 'Q ♠️', used: true }, { value: '9 ♥️', used: false }, { value: '2 ♠️', used: false }],
      },
      {
        name: 'Two Pair',
        example: [{ value: 'K ♥️', used: true }, { value: 'K ♠️', used: true }, { value: '5 ♦️', used: true }, { value: '5 ♣️', used: true }, { value: 'J ♥️', used: false }],
      },
      {
        name: 'Pair',
        example: [{ value: '10 ♥️', used: true }, { value: '10 ♦️', used: true }, { value: 'K ♣️', used: false }, { value: '4 ♠️', used: false }, { value: '2 ♥️', used: false }],
      },
      {
        name: 'High Card',
        example: [{ value: 'A ♠️', used: true }, { value: 'J ♥️', used: false }, { value: '8 ♣️', used: false }, { value: '6 ♦️', used: false }, { value: '2 ♠️', used: false }],
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
            w-[90vw] max-w-lg p-6
            shadow-[0_0_6px_2px] shadow-poker-highlight
            bg-black text-white
            max-h-[85vh] overflow-y-auto no-scrollbar
            rounded-xl border border-gray-800
            outline-none
            "
        >
          <Typography className="text-poker-highlight mb-6 text-center font-bold tracking-widest uppercase border-b border-gray-800 pb-4" id="modal-modal-title" variant="h5" component="h2">
            Hand Rankings
          </Typography>
          <List aria-label="Rank Order" className="flex flex-col gap-1">
            {rankOrder.map((rank, index) => (
              <Fragment key={rank.name}>
                <ListItem className="flex flex-col sm:flex-row justify-between items-center gap-3 py-2 px-0">
                  <Typography className="font-semibold text-gray-200 w-full sm:w-auto text-center sm:text-left">
                    {rank.name}
                  </Typography>
                  <div className="flex gap-2">
                    {rank.example.map((card) => (
                      <div
                        key={card.value}
                        className={`
                          w-8 h-11 sm:w-9 sm:h-12
                          text-wrap text-justify sm:text-sm
                          flex justify-center items-center
                          border border-solid rounded
                          ${card.used
                          ? 'border-poker-highlight text-poker-highlight bg-gray-900'
                          : 'border-poker-disabled text-poker-disabled bg-black opacity-75'
                          }
                          p-1
                        `}
                      >
                        {card.value}
                      </div>
                    ))}
                  </div>
                </ListItem>
                {index < rankOrder.length - 1 && <Divider className="bg-gray-900 my-1" />}
              </Fragment>
            ))}
          </List>
        </Box>
      </Modal>
    </>
  );
};
