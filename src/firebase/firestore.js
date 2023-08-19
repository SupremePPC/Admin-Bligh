/*
* @license
* Copyright 2022 Google LLC
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
// import { db } from "./firebase";
import { db } from "./firebase";

const ADMINUSER_COLLECTION = "adminUser";
const USER_COLLECTION = "user";

export function addAdminUser(
  uid,
  fullName,
  email,
) {
  // Use the uid directly as the document ID
  return setDoc(doc(db, ADMINUSER_COLLECTION, uid), {
    fullName,
    email,
  });
}

export async function getUser(uid) {
  const userRef = doc(db, USER_COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  console.log("getuser UID:", uid);
  console.log("user snapshot data:", userSnap.data());

  if (userSnap.exists()) {
    return [{ ...userSnap.data(), id: userSnap.id }];
  } else {
    return [];
  }
}

export function updateuser(uid, userData) {
  const userDoc = doc(db, USER_COLLECTION, uid);
  return updateDoc(userDoc, userData);
}

export function deleteuser(uid) {
  const userDoc = doc(db, USER_COLLECTION, uid);
  return deleteDoc(userDoc);
}

// Transactions
const ADMINUSERS_COLLECTION = "adminUser";
const TRANSACTIONS_SUB_COLLECTION = "transactions";

export function addTransaction(uid, date, amount, type, status) {
  // Add a transaction to the user-specific transactions sub-collection
  return addDoc(
    collection(db, ADMINUSERS_COLLECTION, uid, TRANSACTIONS_SUB_COLLECTION),
    {
      date,
      amount,
      type,
      status,
    }
  );
}

export async function getTransactions(uid) {
  // Query the user-specific transactions sub-collection
  const transactionsQuery = query(
    collection(db, ADMINUSERS_COLLECTION, uid, TRANSACTIONS_SUB_COLLECTION),
    orderBy("date")
  );
  const querySnapshot = await getDocs(transactionsQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no transactions are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

// Banking Details
const BANKING_DETAILS_SUB_COLLECTION = "bankingDetails";

export async function addBankingDetails(uid, accountName,
  bankName,
  branch,
  iban,
  swiftCode,) {
  console.log("Add Function Params:", {
    uid,
    accountName,
    bankName,
    branch,
    iban,
    swiftCode,
  });

  const bankingDetailsRef = collection(
    db,
    ADMINUSERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION
  );

  return addDoc(bankingDetailsRef, {
    accountName,
      bankName,
      branch,
      iban,
      swiftCode,
  });
}

export async function updateBankingDetails(uid, accountName,
      bankName,
      branch,
      iban,
      swiftCode,) {
  console.log("Update Function Params:", { uid, accountName,
      bankName,
      branch,
      iban,
      swiftCode, });

  const bankingDetailsRef = collection(
    db,
    ADMINUSERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION
  );
  const snapshot = await getDocs(bankingDetailsRef);

  if (!snapshot.empty) {
    const docId = snapshot.docs[0].id;
    return setDoc(
      doc(db, ADMINUSERS_COLLECTION, uid, BANKING_DETAILS_SUB_COLLECTION, docId),
      {
        accountName,
      bankName,
      branch,
      iban,
      swiftCode,
      }
    );
  } else {
    console.error("No banking details found to update!");
  }
}

export async function getBankingDetails(uid) {
  const bankingDetailsQuery = query(
    collection(db, ADMINUSERS_COLLECTION, uid, BANKING_DETAILS_SUB_COLLECTION)
  );
  const querySnapshot = await getDocs(bankingDetailsQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no banking details are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}

export function deleteBankingDetails(uid, bankingDetailsId) {
  return deleteDoc(
    doc(
      db,
      ADMINUSERS_COLLECTION,
      uid,
      BANKING_DETAILS_SUB_COLLECTION,
      bankingDetailsId
    )
  );
}
