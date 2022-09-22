enum IMAGE_STATE {
  IMAGE_FOUND,
  IMAGE_NOT_FOUND
}

class ImageService {
  private imageStateMap = new Map<string, IMAGE_STATE>();
  private player: KalturaPlayerTypes.Player;
  constructor(player: KalturaPlayerTypes.Player) {
    this.player = player;
  }

  async getImageUrl(url: string, width: number, height: number) {
    if (!url) return null;

    const posterData = {poster: url};
    this.player.updateKalturaPoster(posterData, posterData, {width, height});
    if (await this.imageFound(posterData.poster)) {
      return posterData.poster;
    }
    return null;
  }

  private async imageFound(url: string) {
    if (!this.imageStateMap.has(url)) {
      try {
        await this.fetchImage(url);
        this.imageStateMap.set(url, IMAGE_STATE.IMAGE_FOUND);
      } catch (e: any) {
        this.imageStateMap.set(url, IMAGE_STATE.IMAGE_NOT_FOUND);
      }
    }

    return this.imageStateMap.get(url) === IMAGE_STATE.IMAGE_FOUND;
  }

  private fetchImage(url: string) {
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
