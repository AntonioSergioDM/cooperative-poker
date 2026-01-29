import { useCallback, useMemo } from 'react';

import { CopyAll, IosShare } from '@mui/icons-material';
import { Card, IconButton, Typography } from '@mui/material';

import { SiteRoute } from '@/shared/Routes';

type ShareUrlButtonProps = {
  lobbyHash: string;
};

const ShareUrlButton = ({ lobbyHash }: ShareUrlButtonProps) => {
  const shareURL = useMemo(() => (
    `${process.env.NEXT_PUBLIC_URL}${SiteRoute.JoinLobby}/${lobbyHash}`
  ), [lobbyHash]);

  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(shareURL);
  }, [shareURL]);

  const onShare = useCallback(async () => {
    await navigator.share({
      url: shareURL,
      title: 'Cooperative Poker',
      text: 'Come and play!',
    });
  }, [shareURL]);

  return (
    <Card
      sx={{
        p: 1,
        gap: 1,
        flexGrow: 1,
        width: '100%',
        paddingLeft: 2,
        display: 'flex',
        direction: 'row',
        alignItems: 'center',
      }}
    >
      <Typography flexGrow={1}>{shareURL}</Typography>

      <IconButton onClick={onCopy}><CopyAll /></IconButton>
      <IconButton onClick={onShare}><IosShare /></IconButton>
    </Card>
  );
};

export default ShareUrlButton;
