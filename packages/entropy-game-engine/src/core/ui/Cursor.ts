export abstract class Cursor {
  /**
   * Sets the mouse cursor to the specified image.
   *
   * @param imageUrl The url to the image. Can be an internet url or an imported image (ie import image from './assets/image.png';)
   */
  public static setCursor(imageUrl: string): void {
    document.documentElement.style.cursor = `url('${imageUrl}'), default`;
  }
}
