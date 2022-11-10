import dynamic from 'next/dynamic';
import React from 'react';

const App = dynamic(() => import('../components/AppShell'), {
  ssr: false,
});

export default function Index() {
  return <App history={undefined} />;
}
