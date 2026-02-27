import React from 'react';
import ReactDOM from 'react-dom/client';
import { Player } from '@remotion/player';
import { OpenClawTutorial, openClawSchema } from './OpenClawTutorial';
import { zIndex } from 'zod';

// Player 组件
const App: React.FC = () => {
  const inputProps = {
    backgroundColor: '#1a1a2e',
    cardBg: '#16213e',
    accentColor: '#FF5A36',
    textColor: '#ffffff',
    secondaryTextColor: '#a0a0a0',
  };

  return (
    <Player
      component={OpenClawTutorial}
      inputProps={inputProps}
      durationInFrames={2460}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      style={{
        width: '100%',
        maxWidth: '1920px',
      }}
      controls
      loop
      showVolumeControls
    />
  );
};

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('player')!);
root.render(<App />);
