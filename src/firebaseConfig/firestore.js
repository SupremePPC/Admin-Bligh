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

export async function getAllTransactions() {
  // Get a reference to the USERS_COLLECTION
  const usersRef = collection(db, USERS_COLLECTION);
  const usersSnapshot = await getDocs(usersRef);

  let allTransactions = [];

  // Iterate over each user and get their transactions
  for (const userDoc of usersSnapshot.docs) {
    const userUid = userDoc.id;
    const userName = userDoc.data().fullName;
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
      userId: userUid,
      userName: userName,
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
    const transactionsRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      TRANSACTIONS_SUB_COLLECTION
    );
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

//BONDS REQUEST
const ADMINDASH_COLLECTION = "adminDash"
const BONDS_REQUEST_SUB_COLLECTION = 'bondsRequest'

export async function getBondRequests() {
  try {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDashSnapshot = await getDocs(adminDashRef);

    if (adminDashSnapshot.empty) {
      console.warn("No documents found in adminDash collection");
      return [];
    }

    let allBondRequests = [];

    for (const adminDoc of adminDashSnapshot.docs) {
      const userId = adminDoc.id;
      const bondRequestsRef = collection(db, ADMINDASH_COLLECTION, userId, "bondsRequest");
      const bondRequestsSnapshot = await getDocs(bondRequestsRef);

      if (bondRequestsSnapshot.empty) continue;

      const userBondRequests = bondRequestsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: userId,
      }));

      allBondRequests = [...allBondRequests, ...userBondRequests];
    }

    return allBondRequests;
  } catch (error) {
    console.error("Error in getBondRequests: ", error);
    return [];
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

// Function to handle buying bonds
export async function handleBuyApproval(uid, bondData) {
  // Check if bondData and its id are defined
  if (!bondData || !bondData.id) {
    console.error('Invalid bondData:', bondData);
    return;
  }
  
  const userBondsPath = `users/${uid}/bondsHoldings`;
  const bondDocRef = doc(db, `${userBondsPath}/${bondData.id}`);
  
  const bondDoc = await getDoc(bondDocRef);
  
  // Calculate the quantity the user is buying
  const minInvestmentAmount = bondData.minInvestmentAmount || 1;
  const newQuantity = Math.floor(bondData.amount / minInvestmentAmount);
  
  if (bondDoc.exists()) {
    const currentData = bondDoc.data();
    
    // Check if all fields are defined
    if (currentData.quantity === undefined || currentData.currentValue === undefined || bondData.amount === undefined) {
      console.error('Undefined fields in currentData or bondData:', currentData, bondData);
      return;
    }
    
    const updatedQuantity = currentData.quantity + newQuantity;
    const updatedCurrentValue = currentData.currentValue + bondData.amount;
    
    await updateDoc(bondDocRef, {
      quantity: updatedQuantity,
      currentValue: updatedCurrentValue,
    });
  } else {
    // Check if bondData.amount is defined
    if (bondData.amount === undefined) {
      console.error('Undefined amount in bondData:', bondData);
      return;
    }
    
    await setDoc(bondDocRef, {
      ...bondData,
      quantity: newQuantity,
      currentValue: bondData.amount,
    });
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
    `${ADMINDASH_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await updateDoc(requestDocPath, { status: newStatus });
}

// Function to add bond to user's bondsHoldings sub-collection
export async function addBondToUserHoldings(userId, requestData) {
  const userBondsHoldingsPath = collection(db, `users/${userId}/bondsHoldings`);
  await addDoc(userBondsHoldingsPath, requestData);
}

// Function to delete request from bondsRequest sub-collection
export async function deleteRequestFromFirestore(userId, requestId, newStatus) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await deleteDoc(requestDocPath);
}

// Function to fetch data from a specific request
export async function fetchRequestData(userId, requestId) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${BONDS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  return (await getDoc(requestDocPath)).data();
}



//BONDS 
const BONDS_COLLECTION = 'bonds'
//get all bonds
export async function getAllBonds() {
  // Get a reference to the 'bonds' collection
  const bondsRef = collection(db, BONDS_COLLECTION);
  const bondsSnapshot = await getDocs(bondsRef);

  const allBonds = bondsSnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));

  // If there are no bonds at all, return null
  if (allBonds.length === 0) {
    return null;
  }

  return allBonds;
}

//add new bonds
export async function addNewBond(bondData) {
  try {
    const bondsRef = collection(db, 'bonds');
    const newBondRef = await addDoc(bondsRef, bondData);
    return { success: true, id: newBondRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//uodate existing bond
export async function updateBond(bondId, updatedData) {
  try {
    const bondRef = doc(db, 'bonds', bondId);
    await updateDoc(bondRef, updatedData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//delete
export async function deleteBond(bondId) {
  try {
    const bondRef = doc(db, 'bonds', bondId);
    await deleteDoc(bondRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//NOTIFICATION
const NOTIFICATIONS_SUB_COLLECTION = 'notifications';

export async function addNotification(userId, message, type = 'info') {
  try {
    const notificationsRef = collection(db, USER_COLLECTION, userId, NOTIFICATIONS_SUB_COLLECTION);
    const notificationRef = await addDoc(notificationsRef, { message, type, timestamp: new Date() });
    return { success: true, id: notificationRef.id };
  } catch (error) {
    console.error('Error adding notification:', error);
    return { success: false, error: error.message };
  }
}
