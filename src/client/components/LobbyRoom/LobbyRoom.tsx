/* eslint-disable react/no-array-index-key */
import { useCallback, useMemo, useState } from 'react';

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
  options?: GameOption[];
};

const LobbyRoom = (props: LobbyRoomProps) => {
  const {
    lobbyHash,
    players,
    results,
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
      margin={5}
      height="90vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Stack gap={1} width="100%" maxWidth={800}>
        <Link href={SiteRoute.Home} style={{ alignSelf: 'center' }}>
          <Image alt="Logo" src={logo} priority height={250} />
        </Link>

        <Results results={results} players={players} />

        <ShareUrlButton lobbyHash={lobbyHash} />

        <Card
          sx={{
            p: 2,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack
            direction="row"
            gap={2}
            useFlexGap
            flexWrap="wrap"
            justifyContent="center"
            alignItems="flex-start"
          >
            {players.map((player, idx) => (
              <LobbyRoomPlayer key={`${player.name}-${idx}`} name={player.name} ready={player.ready} />
            ))}

            {missingPlayers.map((_, idx) => (
              <LobbyRoomPlayer key={idx} />
            ))}
          </Stack>

          <Stack px={1} direction="row" gap={5} justifyContent="space-between" alignItems="center">
            <Button
              onClick={isReady ? unReady : onReady}
              color={isReady ? 'primary' : 'secondary'}
              sx={{ maxWidth: 100 }}
            >
              {isReady ? 'ready' : 'ready'}
            </Button>

            <LobbyRoomCounter value={players.filter((p) => p.ready).length} outOf={players.length + missingPlayers.length} />
          </Stack>
        </Card>

        <Card>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography fontSize={20}>Challenges</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center" alignItems="center">
                {Array(GameOption.randomChallenge + 1)
                  .fill(1)
                  .map((_, idx) => {
                    const isActive = options?.includes(idx);
                    const onChange = () => onChangeOption(idx, !isActive);
                    return (
                      <Button key={idx} value={idx} fullWidth={false} onClick={onChange} color={isActive ? 'primary' : 'secondary'}>
                        {getOptionDescription(idx)}
                      </Button>
                    );
                  })}
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography fontSize={20}>Advantages</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="column" gap={2} width="full" alignItems="center" padding={2}>

                <Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center" alignItems="center">
                  {Array(GameOption.randomAdvantage - GameOption.randomChallenge)
                    .fill(1)
                    .map((_, idx) => {
                      // eslint-disable-next-line no-param-reassign
                      idx += GameOption.randomChallenge + 1;
                      const isActive = options?.includes(idx);
                      const onChange = () => onChangeOption(idx, !isActive);
                      return (
                        <Button key={idx} value={idx} fullWidth={false} onClick={onChange} color={isActive ? 'primary' : 'secondary'}>
                          {getOptionDescription(idx)}
                        </Button>
                      );
                    })}
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Card>
      </Stack>
    </Box>
  );
};

export default LobbyRoom;
