import { User } from "firebase/auth";
import { union } from "lodash";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const calcFavorites = async (
  favorites: string[],
  user: User | undefined,
  id: string = "BearVsBull"
) => {
  const checked = Array.from(
    document.forms
      .namedItem(id)
      ?.elements.namedItem("favorites") as RadioNodeList
  )
    .filter((i) => (i as HTMLInputElement).checked)
    .map((i) => (i as HTMLInputElement).value);

  let favs = union(favorites, checked);

  if (favs.length === favorites.length) {
    favs = checked;
  }

  const userRef = user?.uid && doc(db, "users", user?.uid);
  userRef && (await setDoc(userRef, { favorites: favs }, { merge: true }));
  return favs;
};
