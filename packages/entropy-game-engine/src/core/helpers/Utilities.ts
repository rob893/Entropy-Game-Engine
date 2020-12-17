export class Utilities {
  public static removeItemFromArray<T>(arr: T[], item: T): boolean {
    const indexOfItem = arr.indexOf(item);

    if (indexOfItem >= 0) {
      arr.splice(indexOfItem, 1);
      return true;
    }

    return false;
  }
}
