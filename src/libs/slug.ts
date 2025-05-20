import { customAlphabet } from "nanoid";
import slugify from "slugify";

export function createSlug(text: string) {
  const nanoId = customAlphabet(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    6,
  );

  return `${slugify(text, { lower: true })}-${nanoId()}`;
}
