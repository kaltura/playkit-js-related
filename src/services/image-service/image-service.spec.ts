import {describe, expect, test, beforeEach, afterEach, jest, afterAll} from '@jest/globals';
import {ImageService} from './image-service';

const IMAGE_URL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
const MODIFIED_IMAGE_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII';

describe('ImageService', () => {
  const updateKalturaPoster = jest.fn<(posterData: {poster: string}) => void>();
  const kalturaPlayer = {updateKalturaPoster};
  const mockImage = {
    src: undefined,
    onload: () => undefined,
    onerror: () => undefined
  };

  let imageService: ImageService | null;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.Image = () => mockImage;
    jest.spyOn(window, 'Image');
    imageService = new ImageService(kalturaPlayer);
  });

  afterEach(() => {
    imageService = null;
    jest.resetAllMocks();
  });

  describe('getImageUrl', () => {
    describe('when url is empty', () => {
      test('should immediately return null for an empty url', async () => {
        const imageUrl = await imageService?.getImageUrl('');
        expect(imageUrl).toBe(null);
        expect(updateKalturaPoster).not.toHaveBeenCalled();
      });
    });

    describe('when url is not empty', () => {
      describe('when url is not modified by player', () => {
        beforeEach(() => {
          updateKalturaPoster.mockImplementation(posterData => {
            posterData.poster = IMAGE_URL;
          });
        });

        test('should return image url if image successfully loaded', async () => {
          setTimeout(() => {
            mockImage.onload();
          });
          const imageUrl = await imageService?.getImageUrl(IMAGE_URL);
          expect(updateKalturaPoster).toHaveBeenCalled();
          expect(imageUrl).toBe(IMAGE_URL);
        });

        test('should return null if image failed to load', async () => {
          setTimeout(() => {
            mockImage.onerror();
          });
          const imageUrl = await imageService?.getImageUrl(IMAGE_URL);
          expect(updateKalturaPoster).toHaveBeenCalled();
          expect(imageUrl).toBe(null);
        });

        test('should not try to fetch an image a second time for the same url', async () => {
          setTimeout(() => {
            mockImage.onload();
          });
          const imageUrl = await imageService?.getImageUrl(IMAGE_URL);
          expect(updateKalturaPoster).toBeCalledTimes(1);
          expect(window.Image).toHaveBeenCalledTimes(1);
          expect(imageUrl).toBe(IMAGE_URL);
          const repeatedImageUrl = await imageService?.getImageUrl(IMAGE_URL);
          expect(updateKalturaPoster).toBeCalledTimes(2);
          expect(repeatedImageUrl).toBe(IMAGE_URL);
          expect(window.Image).toHaveBeenCalledTimes(1);
        });
      });

      describe('when url is modified by player', () => {
        beforeEach(() => {
          updateKalturaPoster.mockImplementation(posterData => {
            posterData.poster = MODIFIED_IMAGE_URL;
          });
        });

        test('should return image url if image successfully loaded', async () => {
          setTimeout(() => {
            mockImage.onload();
          });
          const imageUrl = await imageService?.getImageUrl(IMAGE_URL);
          expect(updateKalturaPoster).toHaveBeenCalled();
          expect(imageUrl).toBe(MODIFIED_IMAGE_URL);
        });

        test('should return null if image failed to load', async () => {
          setTimeout(() => {
            mockImage.onerror();
          });
          const imageUrl = await imageService?.getImageUrl(IMAGE_URL);
          expect(updateKalturaPoster).toHaveBeenCalled();
          expect(imageUrl).toBe(null);
        });

        test('should not try to fetch an image a second time for the same url', async () => {
          setTimeout(() => {
            mockImage.onload();
          });
          const imageUrl = await imageService?.getImageUrl(IMAGE_URL);
          expect(updateKalturaPoster).toBeCalledTimes(1);
          expect(window.Image).toHaveBeenCalledTimes(1);
          expect(imageUrl).toBe(MODIFIED_IMAGE_URL);

          const repeatedImageUrl = await imageService?.getImageUrl(IMAGE_URL);
          expect(updateKalturaPoster).toBeCalledTimes(2);
          expect(repeatedImageUrl).toBe(MODIFIED_IMAGE_URL);
          expect(window.Image).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
