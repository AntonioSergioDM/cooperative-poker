import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import Link from 'next/link';
import Image from 'next/image';

import { Stack, Box } from '@mui/material';

import logo from '@/public/cooperative-poker.png';
import { SiteRoute } from '@/shared/Routes';

import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
  <Stack
    gap={6}
    useFlexGap
    margin="0 auto"
    direction="column"
    alignItems="center"
    justifyContent="center"
    sx={{ position: 'relative', zIndex: 1 }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      whileHover={{ scale: 1.05 }}
      style={{ cursor: 'pointer' }}
    >
      <Link href={SiteRoute.Home}>
        <Box
          sx={{
            position: 'relative',
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

    <Stack
      gap={3}
      useFlexGap
      direction="column"
      alignItems="center"
      sx={{ width: '100%' }}
    >
      {children}
    </Stack>

    <Footer />
  </Stack>
);

export default Layout;
