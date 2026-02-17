/* eslint-disable react/no-array-index-key */
import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import Link from 'next/link';
import Image from 'next/image';

import {
  Box,
  Card,
  Stack,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { SiteRoute } from '@/shared/Routes';
import type { LobbyPlayerState, LobbyState } from '@/shared/SocketTypes';

import logo from '@/public/cooperative-poker.png';

import Results from '@/client/components/LobbyRoom/Results';
import { GameOption, getOptionDescription } from '@/shared/GameTypes';
import ShareUrlButton from '../ShareUrlButton';
import { useSocket } from '../../tools/useSocket';

import LobbyRoomPlayer from './LobbyRoomPlayer';
import LobbyRoomCounter from './LobbyRoomCounter';

type LobbyRoomProps = {
  lobbyHash: string;
  players: LobbyPlayerState[];
  results: LobbyState['results'];
  isHost?: boolean;
  options?: GameOption[];
};

const LobbyRoom = (props: LobbyRoomProps) => {
  const {
    lobbyHash,
    players,
    results,
    isHost,
    options,
  } = props;
  const socket = useSocket();

  const [playerIndex, setPlayerIndex] = useState<number | null>(null);

  const onReady = useCallback(() => {
    socket.emit('playerReady', (newPlayerIndex) => {
      if (typeof newPlayerIndex === 'number') {
        setPlayerIndex(newPlayerIndex);
      }
    });
  }, [socket]);

  const unReady = useCallback(() => {
    socket.emit('playerUnready', (newPlayerIndex) => {
      if (typeof newPlayerIndex === 'number') {
        setPlayerIndex(newPlayerIndex);
      }
    });
  }, [socket]);

  const onChangeOption = useCallback(
    (option: GameOption, status: boolean) => socket.emit('changeOption', option, status),
    [socket],
  );

  const missingPlayers = useMemo(() => {
    if (players.length >= 3) return [];

    return Array(3 - players.length).fill(0);
  }, [players.length]);

  const isReady = useMemo(() => (
    typeof playerIndex === 'number' && players[playerIndex].ready
  ), [playerIndex, players]);

  return (
    <Box
      className="casino-lights"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'auto',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack gap={3} width="100%">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={SiteRoute.Home} style={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  filter: 'drop-shadow(0 8px 24px rgba(147, 51, 234, 0.4))',
                  transition: 'filter 0.3s ease',
                  '&:hover': {
                    filter: 'drop-shadow(0 12px 32px rgba(147, 51, 234, 0.6))',
                  },
                }}
              >
                <Image alt="Logo" src={logo} priority height={200} />
              </Box>
            </Link>
          </motion.div>

          <Results results={results} players={players} />

          <ShareUrlButton lobbyHash={lobbyHash} />

          {/* Players Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="casino-box p-6" sx={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }} >
              <Stack gap={3} style={{ position: 'relative' }}>
                <div className="absolute top-0 right-0">
                  <LobbyRoomCounter
                    value={players.filter((p) => p.ready).length}
                    outOf={players.length + missingPlayers.length}
                  />
                </div>
                <Stack
                  direction="row"
                  gap={3}
                  useFlexGap
                  flexWrap="wrap"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  {players.map((player, idx) => (
                    <LobbyRoomPlayer
                      key={`${player.name}-${idx}`}
                      name={player.name}
                      ready={player.ready}
                      id={player.id}
                      canKick={(isHost || playerIndex === 0) && idx > 0}
                    />
                  ))}

                  {missingPlayers.map((_, idx) => (
                    <LobbyRoomPlayer key={idx} />
                  ))}
                </Stack>

                <Stack
                  direction="row"
                  gap={3}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Button
                    onClick={isReady ? unReady : onReady}
                    variant="contained"
                    size="large"
                    sx={{
                      minWidth: 150,
                      background: isReady
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      borderRadius: 2,
                      boxShadow: isReady
                        ? '0 4px 12px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                        : '0 4px 12px rgba(147, 51, 234, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: isReady
                          ? '0 6px 16px rgba(34, 197, 94, 0.6)'
                          : '0 6px 16px rgba(147, 51, 234, 0.6)',
                      },
                    }}
                  >
                    {isReady ? 'Ready ✓' : 'Ready Up'}
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </motion.div>

          {/* Options Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(26, 77, 46, 0.2) 0%, rgba(15, 40, 24, 0.2) 100%)',
                backdropFilter: 'blur(12px)',
                border: '2px solid rgba(255, 215, 0, 0.2)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Accordion
                sx={{
                  background: 'transparent',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#ffd700' }} />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      my: 1.5,
                    },
                  }}
                >
                  <Typography fontSize={20} fontWeight={600} color="#ffd700">
                    🎯 Challenges
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
                    {Array(GameOption.randomChallenge + 1)
                      .fill(1)
                      .map((_, idx) => {
                        const isActive = options?.includes(idx);
                        const onChange = () => onChangeOption(idx, !isActive);
                        return (
                          <Button
                            key={idx}
                            value={idx}
                            fullWidth={false}
                            onClick={onChange}
                            variant={isActive ? 'contained' : 'outlined'}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              ...(isActive && {
                                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                              }),
                            }}
                          >
                            {getOptionDescription(idx)}
                          </Button>
                        );
                      })}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion
                sx={{
                  background: 'transparent',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#ffd700' }} />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      my: 1.5,
                    },
                  }}
                >
                  <Typography fontSize={20} fontWeight={600} color="#ffd700">
                    ⭐ Advantages
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
                    {Array(GameOption.randomAdvantage - GameOption.randomChallenge)
                      .fill(1)
                      .map((_, idx) => {
                        idx += GameOption.randomChallenge + 1;
                        const isActive = options?.includes(idx);
                        const onChange = () => onChangeOption(idx, !isActive);
                        return (
                          <Button
                            key={idx}
                            value={idx}
                            fullWidth={false}
                            onClick={onChange}
                            variant={isActive ? 'contained' : 'outlined'}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              ...(isActive && {
                                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                                boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                              }),
                            }}
                          >
                            {getOptionDescription(idx)}
                          </Button>
                        );
                      })}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Card>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default LobbyRoom;
