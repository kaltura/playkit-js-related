declare global {
  interface Window {
    KalturaPlayer: {
      setup: (config: any) => any;
      getPlayer: () => any;
    };
  }
}

import {
  clickOnNextButton,
  clickOnListToggle,
  clickOnCloseButton,
  clickOnRelatedEntry
} from './utils/actions';
import {
  expectElementContains,
  expectElementDoesntExist,
  expectElementExists,
  expectRelatedGridVisible,
  expectRelatedListVisible,
  setupAndExpect
} from './utils/expects';
import {
  getRelatedGridElement,
  getRelatedListElement,
  getNextButtonElement,
  getListToggleButtonElement,
  getCountdownElement,
  getCloseButtonElement
} from './utils/getters';
import {loadPlayerAndSetMedia, mockRelatedEntries, getPlayer} from './utils/setup';
import {DEFAULT_COUNTDOWN_TIME, DEFAULT_ENTRIES_LIMIT} from './utils/values';

describe('Related plugin', () => {
  describe('entry relation methods', () => {
    beforeEach(() => {
      // Mock playlist API response
      cy.intercept('GET', '**/service/playlist/execute*', {
        body: {
          data: mockRelatedEntries
        }
      });

      // Mock context API response
      cy.intercept('GET', '**/service/playlist*', req => {
        if (req.body?.filter?.objectType === 'KalturaMediaEntryFilterForPlaylist') {
          req.reply({
            data: mockRelatedEntries
          });
        }
      });
    });

    it('should load related entries from playlistId', () => {
      const playlistId = 'test_playlist_123';
      setupAndExpect({playlistId}, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
        expectElementContains(getRelatedListElement, [mockRelatedEntries[0].name, mockRelatedEntries[1].name]);
      });
    });

    it('should load related entries from entryList', () => {
      const entryList = mockRelatedEntries.map(entry => ({
        entryId: entry.id,
        ...entry
      }));
      setupAndExpect({entryList}, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
        expectElementContains(getRelatedListElement, [mockRelatedEntries[0].name, mockRelatedEntries[1].name]);
      });
    });

    it('should load related entries from sourcesList', () => {
      const sourcesList = mockRelatedEntries.map(entry => ({
        id: entry.id,
        duration: entry.duration,
        metadata: {
          name: entry.name,
          description: entry.description
        },
        poster: entry.thumbnailUrl,
        progressive: [
          {
            mimetype: 'video/mp4',
            url: 'test-video.mp4'
          }
        ]
      }));
      setupAndExpect({sourcesList}, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
        expectElementContains(getRelatedListElement, [mockRelatedEntries[0].name, mockRelatedEntries[1].name]);
      });
    });

    it('should load related entries using context when useContext is true', () => {
      setupAndExpect({useContext: true, entriesByContextLimit: 2}, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
        expectElementContains(getRelatedListElement, [mockRelatedEntries[0].name, mockRelatedEntries[1].name]);
      });
    });

    it('should prioritize playlistId over other methods', () => {
      const playlistEntries = [
        {
          id: 'playlist_1',
          name: 'Playlist Video 1',
          description: 'From Playlist',
          thumbnailUrl: 'thumb1.jpg',
          duration: 120
        }
      ];

      // Mock playlist response with different entries
      cy.intercept('GET', '**/service/playlist/execute*', {
        body: {
          data: playlistEntries
        }
      });

      setupAndExpect({
        playlistId: 'test_playlist',
        entryList: mockRelatedEntries,
        sourcesList: mockRelatedEntries,
        useContext: true
      }, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
        expectElementContains(getRelatedListElement, [playlistEntries[0].name]);
        expectElementDoesntExist(() => cy.contains(mockRelatedEntries[0].name));
      });
    });

    it('should prioritize entryList over sourcesList and context', () => {
      const sourcesList = [{
        id: 'source_1',
        metadata: { name: 'Source Video' },
        progressive: [{ mimetype: 'video/mp4', url: 'test.mp4' }]
      }];

      setupAndExpect({
        entryList: mockRelatedEntries,
        sourcesList,
        useContext: true
      }, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
        expectElementContains(getRelatedListElement, [mockRelatedEntries[0].name]);
        expectElementDoesntExist(() => cy.contains('Source Video'));
      });
    });
  });

  describe('initialization', () => {
    it('should not show related content by default when video starts', () => {
      setupAndExpect({}, loadPlayerAndSetMedia, () => {
        expectElementDoesntExist(getRelatedGridElement);
        expectElementDoesntExist(getRelatedListElement);
      });
    });

    it('should load with provided related entries', () => {
      setupAndExpect({entryList: mockRelatedEntries}, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
        expectElementContains(getRelatedListElement, [mockRelatedEntries[0].name, mockRelatedEntries[1].name]);
      });
    });
  });

  describe('list view', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/service/playlist*', {
        body: {
          data: mockRelatedEntries
        }
      });
    });

    it('should show list view when toggle button is clicked', () => {
      setupAndExpect({entryList: mockRelatedEntries}, loadPlayerAndSetMedia, () => {
        expectElementDoesntExist(getRelatedListElement);
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
      });
    });

    it('should hide list view when close button is clicked', () => {
      setupAndExpect({entryList: mockRelatedEntries}, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        expectElementExists(getRelatedListElement);
        clickOnCloseButton();
        expectElementDoesntExist(getRelatedListElement);
      });
    });

    it('should play selected entry when clicked', () => {
      setupAndExpect({entryList: mockRelatedEntries}, loadPlayerAndSetMedia, () => {
        clickOnListToggle();
        clickOnRelatedEntry(0);
        // Verify the video source has changed to the selected entry
        cy.window().then(win => {
          expect((win as any).KalturaPlayer.getPlayer().sources.id).to.equal(mockRelatedEntries[0].id);
        });
      });
    });
  });

  describe('auto continue', () => {
    it('should show countdown when video ends with autoContinue enabled', () => {
      setupAndExpect({entryList: mockRelatedEntries, autoContinue: true}, loadPlayerAndSetMedia, player => {
        player.currentTime = player.duration;
        expectElementExists(getCountdownElement);
      });
    });

    it('should not show countdown when autoContinue is disabled', () => {
      setupAndExpect({entryList: mockRelatedEntries, autoContinue: false}, loadPlayerAndSetMedia, player => {
        player.currentTime = player.duration;
        expectElementDoesntExist(getCountdownElement);
      });
    });

    it('should auto continue to next video after countdown', () => {
      setupAndExpect(
        {entryList: mockRelatedEntries, autoContinue: true, autoContinueTime: 1},
        loadPlayerAndSetMedia,
        player => {
          player.currentTime = player.duration;
          cy.wait(1500).then(() => {
            cy.window().then(win => {
              expect((win as any).KalturaPlayer.getPlayer().sources.id).to.equal(mockRelatedEntries[0].id);
            });
          });
        }
      );
    });
  });

  describe('grid view', () => {
    it('should show grid view on pause when showOnPlaybackPaused is true', () => {
      setupAndExpect({entryList: mockRelatedEntries, showOnPlaybackPaused: true}, loadPlayerAndSetMedia, player => {
        player.pause();
        expectElementExists(getRelatedGridElement);
      });
    });

    it('should not show grid view on pause when showOnPlaybackPaused is false', () => {
      setupAndExpect({entryList: mockRelatedEntries, showOnPlaybackPaused: false}, loadPlayerAndSetMedia, player => {
        player.pause();
        expectElementDoesntExist(getRelatedGridElement);
      });
    });

    it('should play selected entry from grid when clicked', () => {
      setupAndExpect({entryList: mockRelatedEntries, showOnPlaybackPaused: true}, loadPlayerAndSetMedia, player => {
        player.pause();
        clickOnRelatedEntry(0);
        expect(getPlayer().sources.id).to.equal(mockRelatedEntries[0].id);
      });
    });
  });

  describe('next button', () => {
    it('should show next button when there are related entries', () => {
      setupAndExpect({entryList: mockRelatedEntries}, loadPlayerAndSetMedia, () => {
        expectElementExists(getNextButtonElement);
      });
    });

    it('should play next entry when next button is clicked', () => {
      setupAndExpect({entryList: mockRelatedEntries}, loadPlayerAndSetMedia, () => {
        clickOnNextButton();
        cy.window().then(win => {
          expect((win as any).KalturaPlayer.getPlayer().sources.id).to.equal(mockRelatedEntries[0].id);
        });
      });
    });
  });
});
