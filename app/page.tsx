import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';

import { APP_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Check my score',
    },
  ],
  image: {
    src: `${APP_URL}/karma-cover.png`,
    aspectRatio: '1:1',
  },
  postUrl: `${APP_URL}/api/frame/score`,
});

export const metadata: Metadata = {
  title: 'Got hash?',
  description: 'Check your #_ karma',
  openGraph: {
    images: [`${APP_URL}/karma-cover.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <main className="flex flex-col items-center min-h-screen w-screen bg-grid bg-primary">
      <h1 className="font-mono">#_</h1>
    </main>
  );
}
