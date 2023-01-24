enum IMAGE_STATE {
  FOUND,
  NOT_FOUND
}

const MAX_WIDTH = 400;
const MAX_HEIGHT = 225;

class ImageService {
  private imageStateMap = new Map<string, IMAGE_STATE>();
  private player: KalturaPlayerTypes.Player;

  constructor(player: KalturaPlayerTypes.Player) {
    this.player = player;
  }

  async getImageUrl(url: string): Promise<string | null> {
    if (!url) return null;

    const posterData = {poster: url};
    this.player.updateKalturaPoster(posterData, posterData, {width: MAX_WIDTH, height: MAX_HEIGHT});
    if (await this.imageFound(posterData.poster)) {
      return posterData.poster;
    }
    return null;
  }

  private async imageFound(url: string): Promise<boolean> {
    if (!this.imageStateMap.has(url)) {
      try {
        await this.fetchImage(url);
        this.imageStateMap.set(url, IMAGE_STATE.FOUND);
      } catch (e: any) {
        this.imageStateMap.set(url, IMAGE_STATE.NOT_FOUND);
      }
    }

    return this.imageStateMap.get(url) === IMAGE_STATE.FOUND;
  }

  private fetchImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        resolve(url);
      };
      image.onerror = () => {
        reject();
      };
    });
  }
}

export {ImageService};
