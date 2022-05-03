enum IMAGE_STATE {
  IMAGE_FOUND,
  IMAGE_NOT_FOUND
}

class ImageService {
  private imageStateMap = new Map<string, IMAGE_STATE>();

  async getImageUrl(url: string, width: number, height: number) {
    if (!url) return null;

    const fullUrl = `${url}/width/${width}/height/${height}`;
    if (await this.imageFound(fullUrl)) {
      return fullUrl;
    } else if (await this.imageFound(url)) {
      return url;
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
