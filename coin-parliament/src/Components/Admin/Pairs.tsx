import React, { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  DBPair,
  transform,
  validateCoin,
  validateCoins,
} from "../../common/models/Coin";
import AdminForm from "./AdminForm";

const Pairs = () => {
  const [pairs, setPairs] = useState<DBPair[]>([]);

  useEffect(() => {
    onSnapshot(doc(db, "settings", "pairs"), (doc) => {
      setPairs(((doc.data() as { pairs: DBPair[] }) || {}).pairs || []);
    });
  }, []);

  const setValues = async (newPairs: DBPair[]) => {
    newPairs = newPairs.filter((c) => c);
    if (validateCoins(newPairs) && newPairs.every(validateCoin)) {
      await setDoc(
        doc(db, "settings", "pairs"),
        { pairs: newPairs },
        { merge: true }
      );
    }
    setPairs(newPairs);
  };

  const topics = ["ID", "Symbol1", "Symbol2"];
  return (
    <AdminForm<DBPair>
      buttonTxt={"Upload pairs csv (overwrite all)"}
      values={pairs}
      setValues={setValues}
      id="pairs"
      topics={topics}
      transform={(results) => transform(results, topics)}
      upload={async (results: DBPair[]) => {
        await setValues(results);
      }}
    />
  );
};

export default Pairs;
