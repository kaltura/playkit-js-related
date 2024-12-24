const defaultSource: any = {
  id: '1234',
  progressive: [
    {
      mimetype: 'video/mp4',
      url: './media/video1.mp4'
    }
  ]
};

export const mockRelatedEntries = [
  {
    id: '1',
    name: 'Test Video 1',
    poster: './media/thumbnail1.jpg',
    mediaUrl: './media/video1.mp4',
    duration: 120
  },
  {
    id: '2',
    name: 'Test Video 2',
    poster: './media/thumbnail2.jpg',
    mediaUrl: './media/video2.mp4',
    duration: 90
  }
];

export const loadPlayer = (pluginConf: any, playbackConf: Record<string, any> = {}) => {
  cy.visit('index.html');
  return cy.window().then(win => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      const kalturaPlayer = win.KalturaPlayer.setup({
        targetId: 'player-placeholder',
        provider: {
          partnerId: -1,
          env: {
            cdnUrl: 'http://mock-cdn',
            serviceUrl: 'http://mock-api'
          }
        },
        plugins: {
          related: pluginConf,
          uiManagers: {}
        },
        playback: {muted: true, ...playbackConf}
      });

      kalturaPlayer.configure({plugins: {related: pluginConf}});

      return Promise.resolve(kalturaPlayer);
    } catch (e: any) {
      return Promise.reject(e.message);
    }
  });
};

export const setMedia = (player: any, sourcesConfig = defaultSource) => {
  player?.setMedia({
    sources: sourcesConfig
  });
};

export const loadPlayerAndSetMedia = (pluginConf: any, playbackConf: Record<string, any> = {}, sourcesConfig?: any): Promise<any> => {
  return new Promise(resolve => {
    loadPlayer(pluginConf, playbackConf).then(kalturaPlayer => {
      setMedia(kalturaPlayer, sourcesConfig);
      if (playbackConf.autoplay) {
        kalturaPlayer.ready().then(() => resolve(kalturaPlayer));
      }
      resolve(kalturaPlayer);
    });
  });
};
