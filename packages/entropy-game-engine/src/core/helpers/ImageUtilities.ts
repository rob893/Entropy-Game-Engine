export class ImageUtilities {
  public static loadImage(imageUrl: string, timeout: number = 5000): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout when waiting on image to load.')), timeout);

      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        clearTimeout(timer);
        resolve(image);
      };
    });
  }
}
