import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CommissionsClient } from "./types";
import COLLECTIONS from "./collections";

const dataToCommissionDB = (data: any, id: string): CommissionsClient => {
  return {
    ...data,
    id,
  };
};

const getCommissionById = async (id: string): Promise<CommissionsClient> => {
  const commissionRef = doc(db, COLLECTIONS.COMMISSIONSCLIENT, id);
  const snapshot = await getDoc(commissionRef);

  if (!snapshot.exists()) {
    throw new Error(`Commission with ID ${id} not found`);
  }

  return dataToCommissionDB(snapshot.data(), snapshot.id);
};

const getCommissionByAmount = async (
  amount: number
): Promise<CommissionsClient | null> => {
  const commissionsCollection = collection(db, COLLECTIONS.COMMISSIONSCLIENT);
  const snapshot = await getDocs(commissionsCollection);

  const applicableCommissions = snapshot.docs
    .map((doc) => dataToCommissionDB(doc.data(), doc.id))
    .filter(
      (commission) =>
        (commission.minTreshold === null || amount >= commission.minTreshold) &&
        (commission.maxTreshold === null || amount <= commission.maxTreshold)
    );

  if (applicableCommissions.length > 0) {
    return applicableCommissions.reduce((prev, current) => {
      const prevRange =
        (prev.maxTreshold || Infinity) - (prev.minTreshold || 0);
      const currentRange =
        (current.maxTreshold || Infinity) - (current.minTreshold || 0);

      return currentRange < prevRange ? current : prev;
    });
  }

  return null;
};

const getCommissions = async (): Promise<CommissionsClient[]> => {
  const commissionsCollection = collection(db, COLLECTIONS.COMMISSIONSCLIENT);
  const snapshot = await getDocs(commissionsCollection);

  const commissions: CommissionsClient[] = [];
  snapshot.forEach((doc) => {
    commissions.push(dataToCommissionDB(doc.data(), doc.id));
  });

  return commissions;
};

export { getCommissionById, getCommissionByAmount, getCommissions };
