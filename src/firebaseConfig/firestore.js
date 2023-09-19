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
  where,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const ADMINUSER_COLLECTION = "adminUser";
const USER_COLLECTION = "user";

export function addAdminUser(uid, fullName, email) {
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
const USERS_COLLECTION = "users";
const TRANSACTIONS_SUB_COLLECTION = "transactions";

// export function addTransaction(uid, date, amount, type, status) {
//   // Add a transaction to the user-specific transactions sub-collection
//   return addDoc(
//     collection(db, USERS_COLLECTION, uid, TRANSACTIONS_SUB_COLLECTION),
//     {
//       date,
//       amount,
//       type,
//       status,
//     }
//   );
// }

export async function getAllTransactions() {
  // Get a reference to the USERS_COLLECTION
  const usersRef = collection(db, USERS_COLLECTION);
  const usersSnapshot = await getDocs(usersRef);

  let allTransactions = [];

  // Iterate over each user and get their transactions
  for (const userDoc of usersSnapshot.docs) {
    const userUid = userDoc.id;
    const transactionsRef = collection(
      db,
      USERS_COLLECTION,
      userUid,
      TRANSACTIONS_SUB_COLLECTION
    );
    const transactionsSnapshot = await getDocs(transactionsRef);

    const userTransactions = transactionsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    allTransactions = [...allTransactions, ...userTransactions];
  }

  // If there are no transactions at all, return null
  if (allTransactions.length === 0) {
    return null;
  }

  return allTransactions;
}

export async function addTransaction(userId, newTransaction) {
  try {
    // Add the transaction to the specific user's transactions sub-collection
    const transactionsRef = collection(db, USERS_COLLECTION, userId, TRANSACTIONS_SUB_COLLECTION);
    const docRef = await addDoc(transactionsRef, newTransaction);

    return { success: true, id: docRef.id };
  } catch (error) {
    return { error: `Failed to add transaction: ${error.message}` };
  }
}


export async function editTransaction(userId, transactionId, updatedFields) {
  const transactionRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_SUB_COLLECTION,
    transactionId
  );

  await updateDoc(transactionRef, updatedFields);

  return { success: true };
}

// Banking Details
const BANKING_DETAILS_SUB_COLLECTION = "bankingDetails";
const ADMINUSERS_COLLECTION = "user";

export async function addBankingDetails(
  uid,
  accountName,
  bankName,
  branch,
  iban,
  swiftCode
) {
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

export async function updateBankingDetails(
  uid,
  accountName,
  bankName,
  branch,
  iban,
  swiftCode
) {
  console.log("Update Function Params:", {
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
  const snapshot = await getDocs(bankingDetailsRef);

  if (!snapshot.empty) {
    const docId = snapshot.docs[0].id;
    return setDoc(
      doc(
        db,
        ADMINUSERS_COLLECTION,
        uid,
        BANKING_DETAILS_SUB_COLLECTION,
        docId
      ),
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

//BONDS
// Function to handle buying bonds
export async function handleBuyApproval(uid, bondData) {
  const userBondsPath = `users/${uid}/bondsHoldings`;
  const bondDocRef = doc(db, `${userBondsPath}/${bondData.id}`); // Assuming bondData.id is unique for each bond

  const bondDoc = await getDoc(bondDocRef);

  if (bondDoc.exists()) {
    // If bond already exists in user's holdings, update it
    const currentData = bondDoc.data();
    const newQuantity = currentData.quantity + bondData.quantity;
    const newCurrentValue = currentData.currentValue + bondData.currentValue;

    await updateDoc(bondDocRef, {
      quantity: newQuantity,
      currentValue: newCurrentValue,
    });
  } else {
    // If bond doesn't exist in user's holdings, add it
    await setDoc(bondDocRef, bondData);
  }
}

// Function to handle selling bonds
export async function handleSellApproval(uid, bondData) {
  const userBondsPath = `users/${uid}/bondsHoldings`;
  const bondDocRef = doc(db, `${userBondsPath}/${bondData.id}`); // Assuming bondData.id is unique for each bond

  const bondDoc = await getDoc(bondDocRef);

  if (bondDoc.exists()) {
    // If bond exists in user's holdings, update it or delete it
    const currentData = bondDoc.data();

    if (currentData.quantity > bondData.quantity) {
      const newQuantity = currentData.quantity - bondData.quantity;
      const newCurrentValue = currentData.currentValue - bondData.currentValue;

      await updateDoc(bondDocRef, {
        quantity: newQuantity,
        currentValue: newCurrentValue,
      });
    } else {
      // If all units of this bond are being sold, remove it from user's holdings
      await deleteDoc(bondDocRef);
    }
  } else {
    console.error("Bond does not exist in user's holdings");
  }
}

// Function to update request status in the Firestore
export async function updateRequestStatusInFirestore(
  userId,
  requestId,
  newStatus
) {
  const requestDocPath = doc(
    db,
    `${ADMINUSER_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await updateDoc(requestDocPath, { status: newStatus });
}

// Function to add bond to user's bondsHoldings sub-collection
export async function addBondToUserHoldings(userId, requestData) {
  const userBondsHoldingsPath = collection(db, `users/${userId}/bondsHoldings`);
  await addDoc(userBondsHoldingsPath, requestData);
}

// Function to delete request from bondsRequest sub-collection
export async function deleteRequestFromFirestore(userId, requestId) {
  const requestDocPath = doc(
    db,
    `${ADMINUSER_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await deleteDoc(requestDocPath);
}

// Function to fetch data from a specific request
export async function fetchRequestData(userId, requestId) {
  const requestDocPath = doc(
    db,
    `${ADMINUSER_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  return (await getDoc(requestDocPath)).data();
}
