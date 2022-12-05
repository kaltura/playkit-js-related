const {PLAYER_SIZE} = KalturaPlayer.ui.components;

import {GridEntry} from 'components/entry/grid-entry';
import {ListEntry} from 'components/entry/list-entry';
import {MinimalGridEntry} from 'components/entry/minimal-grid-entry';
import {MinimalNextEntry} from 'components/entry/minimal-next-entry';
import {NextEntry} from 'components/entry/next-entry';
import {EntryDimensions} from 'types/entry-dimensions';
import {Sources} from 'types/sources';

import * as entryStyles from '../entry/entry.scss';

const SIZE_CLASS = {
  [PLAYER_SIZE.SMALL]: 'extraSmall',
  [PLAYER_SIZE.SMALL]: 'small',
  [PLAYER_SIZE.MEDIUM]: 'medium',
  [PLAYER_SIZE.LARGE]: 'large',
  [PLAYER_SIZE.EXTRA_LARGE]: 'extraLarge'
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
  [PLAYER_SIZE.EXTRA_SMALL]: {
    width: 167,
    imageHeight: 94,
    contentHeight: 34
  },
  [PLAYER_SIZE.SMALL]: {
    width: 167,
    imageHeight: 94,
    contentHeight: 34
  },
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
const getSizeClass = (sizeBreakpoint: string, styles: Record<string, string>) => styles[SIZE_CLASS[sizeBreakpoint]];
const getPageSize = (sizeBreakpoint: string) => NUM_ENTRIES[sizeBreakpoint];
const getGridEntry = (sizeBreakpoint: string, data: Sources, entryDimensions: EntryDimensions) => {
  const props = {
    id: data.internalIndex,
    duration: data.duration,
    durationText: data.durationText,
    type: data.type,
    poster: data.poster,
    title: data.metadata?.name,
    entryDimensions
  };

  return sizeBreakpoint === PLAYER_SIZE.MEDIUM ? <MinimalGridEntry {...props} /> : <GridEntry {...props} />;
};
const getListEntry = (sizeBreakpoint: string, data: Sources) => {
  const props = {
    id: data.internalIndex,
    duration: data.duration,
    durationText: data.durationText,
    type: data.type,
    poster: data.poster,
    title: data.metadata?.name,
    entryDimensions: {width: 269, imageHeight: 56, contentHeight: 'auto'}
  };

  //return; sizeBreakpoint === PLAYER_SIZE.MEDIUM ? <ListEntry {...props} /> :
  return <ListEntry {...props} />;
};
const getNextEntry = (sizeBreakpoint: string, countdown: number, data: Sources, onCancel?: () => void) => {
  const {duration, type, poster, metadata, durationText} = data;
  const props = {
    id: 0,
    duration,
    durationText,
    type,
    poster,
    entryDimensions: NEXT_ENTRY_DIMENSIONS[sizeBreakpoint],
    title: metadata?.name,
    description: metadata?.description,
    countdown,
    sizeClass: getSizeClass(sizeBreakpoint, entryStyles),
    alwaysShowButtons: sizeBreakpoint === PLAYER_SIZE.EXTRA_SMALL || sizeBreakpoint === PLAYER_SIZE.SMALL,
    onCancel
  };

  return sizeBreakpoint === PLAYER_SIZE.LARGE || sizeBreakpoint === PLAYER_SIZE.EXTRA_LARGE ? (
    <NextEntry {...props} />
  ) : (
    <MinimalNextEntry {...props} />
  );
};

export {getEntryDimensions, getExpandedEntryDimensions, getNextEntry, getGridEntry, getListEntry, getSizeClass, getPageSize};
