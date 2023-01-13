import React, {useEffect, useState} from "react";
import {doc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "../../firebase";
import AdminForm from "./AdminForm";
import {DBCoin, transform, validateCoin, validateCoins} from "../../common/models/Coin";

const Coins = () => {
  const [coins, setCoins] = useState<DBCoin[]>([]);

  useEffect(() => {
    onSnapshot(doc(db, "settings", "coins"), (doc) => {
      setCoins(((doc.data() as { coins: DBCoin[] }) || {}).coins || []);
    });
  }, []);

  const topics = ["ID", "Symbol", "Name"];
  const setValues = async (newCoins: DBCoin[]) => {
    newCoins = newCoins.filter((c) => c);
    if (validateCoins(newCoins) && newCoins.every(validateCoin)) {
      await setDoc(
        doc(db, "settings", "coins"),
        {coins: newCoins},
        {merge: true},
      );
    }
    setCoins(newCoins);
  };
  return (
    <AdminForm<DBCoin>
      buttonTxt={"Upload coins csv (overwrite all)"}
      values={coins}
      setValues={setValues}
      id="coins"
      topics={topics}
      transform={(results) => transform(results, topics)}
      upload={async (results: DBCoin[]) => {
        await setValues(results);
      }}
    />
  );
};

export default Coins;
