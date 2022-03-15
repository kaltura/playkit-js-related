const {PLAYER_SIZE} = KalturaPlayer.ui.components;

import {GridEntry} from 'components/entry/grid-entry';
import {MinimalGridEntry} from 'components/entry/minimal-grid-entry';
import {MinimalNextEntry} from 'components/entry/minimal-next-entry';
import {NextEntry} from 'components/entry/next-entry';
import {EntryDimensions} from 'types/entry-dimensions';
import {Sources} from 'types/sources';
import * as styles from './related-grid.scss';

const SIZE_CLASS = {
  [PLAYER_SIZE.MEDIUM]: styles.medium,
  [PLAYER_SIZE.LARGE]: styles.large,
  [PLAYER_SIZE.EXTRA_LARGE]: styles.extraLarge
};

const NUM_ENTRIES = {
  [PLAYER_SIZE.MEDIUM]: 4,
  [PLAYER_SIZE.LARGE]: 6,
  [PLAYER_SIZE.EXTRA_LARGE]: 8
};

const ENTRY_DIMENSIONS = {
  [PLAYER_SIZE.MEDIUM]: {
    imageHeight: 56,
    contentHeight: 56,
    width: 208
  },
  [PLAYER_SIZE.LARGE]: {
    imageHeight: 98,
    contentHeight: 49,
    width: 174
  },
  [PLAYER_SIZE.EXTRA_LARGE]: {
    imageHeight: 98,
    contentHeight: 49,
    width: 174
  }
};

const ENTRY_DIMENSIONS_EXPANDED = {
  [PLAYER_SIZE.MEDIUM]: {
    imageHeight: 56,
    contentHeight: 56,
    width: 188
  },
  [PLAYER_SIZE.LARGE]: {
    imageHeight: 98,
    contentHeight: 49,
    width: 202.6
  },
  [PLAYER_SIZE.EXTRA_LARGE]: {
    imageHeight: 98,
    contentHeight: 49,
    width: 195.5
  }
};

const NEXT_ENTRY_DIMENSIONS = {
  [PLAYER_SIZE.MEDIUM]: {
    width: 167,
    imageHeight: 94,
    contentHeight: 34
  },
  [PLAYER_SIZE.LARGE]: {
    width: 260,
    imageHeight: 147,
    contentHeight: 163
  },
  [PLAYER_SIZE.EXTRA_LARGE]: {
    width: 260,
    imageHeight: 147,
    contentHeight: 163
  }
};

const getEntryDimensions = (sizeBreakpoint: string) => ENTRY_DIMENSIONS[sizeBreakpoint];
const getExpandedEntryDimensions = (sizeBreakpoint: string) => ENTRY_DIMENSIONS_EXPANDED[sizeBreakpoint];
const getSizeClass = (sizeBreakpoint: string) => SIZE_CLASS[sizeBreakpoint];
const getPageSize = (sizeBreakpoint: string) => NUM_ENTRIES[sizeBreakpoint];
const getGridEntry = (sizeBreakpoint: string, data: Sources, entryDimensions: EntryDimensions) => {
  const props = {
    id: data.internalIndex,
    key: data.internalIndex,
    duration: data.duration,
    type: data.type,
    poster: data.poster,
    title: data.metadata?.name,
    entryDimensions
  };

  return sizeBreakpoint === PLAYER_SIZE.MEDIUM ? <MinimalGridEntry {...props} /> : <GridEntry {...props} />;
};
const getNextEntry = (sizeBreakpoint: string, countdown: number, data: Sources) => {
  const {duration, type, poster, metadata} = data;
  const props = {
    id: 0,
    key: 0,
    duration,
    type,
    poster,
    entryDimensions: NEXT_ENTRY_DIMENSIONS[sizeBreakpoint],
    title: metadata?.name,
    description: metadata?.description,
    countdown
  };

  return sizeBreakpoint === PLAYER_SIZE.MEDIUM ? <MinimalNextEntry {...props} /> : <NextEntry {...props} />;
};

export {getEntryDimensions, getExpandedEntryDimensions, getNextEntry, getGridEntry, getSizeClass, getPageSize};
