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
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { ref, deleteObject, getStorage } from "firebase/storage";

const ADMINUSER_COLLECTION = "adminUser";
// const USER_COLLECTION = "user";

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
const ADMINDASH_COLLECTION = "adminDash";
const BONDS_REQUEST_SUB_COLLECTION = "bondsRequest";

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
      const bondRequestsRef = collection(
        db,
        ADMINDASH_COLLECTION,
        userId,
        "bondsRequest"
      );
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
    console.error("Invalid bondData:", bondData);
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
    if (
      currentData.quantity === undefined ||
      currentData.currentValue === undefined ||
      bondData.amount === undefined
    ) {
      console.error(
        "Undefined fields in currentData or bondData:",
        currentData,
        bondData
      );
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
      console.error("Undefined amount in bondData:", bondData);
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

//DOCUMENTS
export const fetchDocument = async () => {
  const usersCollection = collection(db, "users");
  const userDocs = await getDocs(usersCollection);
  const allDocuments = [];
  for (const userDoc of userDocs.docs) {
    const user = userDoc.data();
    const docCollection = collection(userDoc.ref, "docs");
    const docDocs = await getDocs(docCollection);
    docDocs.docs.forEach((docDoc) => {
      allDocuments.push({
        userId: userDoc.id,
        ...docDoc.data(),
        fullName: user.fullName,
        docId: docDoc.id,
      });
    });
  }
  return allDocuments;
};

export const deleteDocument = async (userId, docId, fileName) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${userId}/${fileName}`); // Construct the reference correctly

  try {
    await deleteObject(storageRef);
    const docRef = doc(db, "users", userId, "docs", docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error during deletion:", error);
    throw error;
  }
};

//BONDS
const BONDS_COLLECTION = "bonds";
//get all bonds
export async function getAllBonds() {
  // Get a reference to the 'bonds' collection
  const bondsRef = collection(db, BONDS_COLLECTION);
  const bondsSnapshot = await getDocs(bondsRef);

  const allBonds = bondsSnapshot.docs.map((doc) => ({
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
    const bondsRef = collection(db, "bonds");
    const newBondRef = await addDoc(bondsRef, bondData);
    return { success: true, id: newBondRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//add new bonds for a particular user
export async function addBondUser(userId, bondData) {
  try {
    const bondsRef = collection(db, USERS_COLLECTION, userId, "bondsHoldings");
    const newBondRef = await addDoc(bondsRef, bondData);
    return { success: true, id: newBondRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//uodate existing bond
export async function updateBond(bondId, updatedData) {
  try {
    const bondRef = doc(db, "bonds", bondId);
    await updateDoc(bondRef, updatedData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//delete
export async function deleteBond(bondId) {
  try {
    const bondRef = doc(db, "bonds", bondId);
    await deleteDoc(bondRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//TERMS
const TERMS_COLLECTION = "fixedTermDeposit";
//get all terms
export async function getAllTerms() {
  // Get a reference to the 'terms' collection
  const termsRef = collection(db, TERMS_COLLECTION);
  const termsSnapshot = await getDocs(termsRef);

  const allTerms = termsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  // If there are no terms at all, return null
  if (allTerms.length === 0) {
    return null;
  }

  return allTerms;
}

//add new terms
export async function addNewTerm(termData) {
  try {
    const termsRef = collection(db, TERMS_COLLECTION);
    const newTermRef = await addDoc(termsRef, termData);
    return { success: true, id: newTermRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//uodate existing term
export async function updateTerm(termId, updatedData) {
  try {
    const termRef = doc(db, TERMS_COLLECTION, termId);
    await updateDoc(termRef, updatedData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//delete
export async function deleteTerm(termId) {
  try {
    const termRef = doc(db, TERMS_COLLECTION, termId);
    await deleteDoc(termRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//NOTIFICATION
const NOTIFICATIONS_SUB_COLLECTION = "notifications";

export async function addNotification(userId, message, type = "info") {
  try {
    const notificationsRef = collection(
      db,
      USERS_COLLECTION,
      userId,
      NOTIFICATIONS_SUB_COLLECTION
    );
    const notificationRef = await addDoc(notificationsRef, {
      message,
      type,
      timestamp: new Date(),
    });
    return { success: true, id: notificationRef.id };
  } catch (error) {
    console.error("Error adding notification:", error);
    return { success: false, error: error.message };
  }
}

//TERMS REQUEST
const TERMS_REQUEST_SUB_COLLECTION = "termDepositRequest";

export async function getTermRequests() {
  try {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDashSnapshot = await getDocs(adminDashRef);

    if (adminDashSnapshot.empty) {
      console.warn("No documents found in adminDash collection");
      return [];
    }

    let allTermRequests = [];

    for (const adminDoc of adminDashSnapshot.docs) {
      const userId = adminDoc.id;
      const termRequestsRef = collection(
        db,
        ADMINDASH_COLLECTION,
        userId,
        TERMS_REQUEST_SUB_COLLECTION
      );
      const termRequestsSnapshot = await getDocs(termRequestsRef);

      if (termRequestsSnapshot.empty) continue;

      const userTermRequests = termRequestsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: userId,
      }));

      allTermRequests = [...allTermRequests, ...userTermRequests];
    }

    return allTermRequests;
  } catch (error) {
    console.error("Error in getTermRequests: ", error);
    return [];
  }
}

// Function to handle withdraw terms
export async function handleWithdrawalApproval(uid, termData) {
  const userTermsPath = `users/${uid}/fixedTermDeposits`;
  const termDocRef = doc(db, `${userTermsPath}/${termData.id}`); // Assuming termData.id is unique for each term

  const termDoc = await getDoc(termDocRef);

  if (termDoc.exists()) {
    await deleteDoc(termDocRef);
  } else {
    console.error("Term does not exist in user's fixed term deposit");
  }
}

// Function to handle deposit terms
export async function handleDepositApproval(uid, termData) {
  try {
    // Check if termData and its id are defined
    if (!termData || !termData.id || termData.principalAmount === undefined) {
      console.error("Invalid termData:", termData);
      return;
    }

    const userTermsPath = `users/${uid}/fixedTermDeposits`;
    const termDocRef = doc(db, `${userTermsPath}/${termData.id}`);
    const termDoc = await getDoc(termDocRef);

    // If termDoc doesn't exist, then this is the first document in the fixedTermDeposits collection
    if (!termDoc.exists()) {
      console.log(
        "Document does not exist, creating the fixedTermDeposits subcollection and setting the document..."
      );
      await setDoc(termDocRef, { ...termData });
      return;
    }
    await updateDoc(termDocRef, { amount: termData.amount });
  } catch (error) {
    console.error("Error in handleDepositApproval:", error);
  }
}

// Function to update fixed term request status in the Firestore
export async function updateFixedTermRequestStatus(
  userId,
  requestId,
  newStatus
) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${TERMS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await updateDoc(requestDocPath, { status: newStatus });
}

// Function to delete request from termsRequest sub-collection
export async function deleteFixedTermRequestStatus(userId, requestId) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${TERMS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await deleteDoc(requestDocPath);
}

// Function to add term to user's terms sub-collection
export async function addTermToUserCollection(userId, termData) {
  try {
  const userTermsHoldingsPath = collection(
    db,
    `users/${userId}/fixedTermDeposits`
  );
  const docRef= await addDoc(userTermsHoldingsPath, termData);
  const docId = docRef.id;

    return { success: true, id: docId };
  } catch (error) {
    console.error('Error adding term:', error);
    return { success: false, error: error.message };
  }
};

//IPOS
const IPOS_COLLECTION = "ipos";

//getIPOS
export const getAllIpos = async () => {
  const iposQuery = query(
    collection(db, IPOS_COLLECTION)
    // orderBy("date")
  );
  const querySnapshot = await getDocs(iposQuery);

  if (querySnapshot.empty) {
    return null; // Return null if no ipos are found
  }

  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

//Update
export const updateIpo = async (ipoId, updatedData) => {
  try {
    const ipoRef = doc(db, IPOS_COLLECTION, ipoId);
    await updateDoc(ipoRef, updatedData);
  } catch (error) {
    console.error("Error updating IPO: ", error);
    throw error;
  }
};

//Add New
export const addNewIpos = async (ipoData) => {
  try {
    const iposCollectionRef = collection(db, IPOS_COLLECTION);
    const docRef = await addDoc(iposCollectionRef, ipoData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding IPO: ", error);
    throw error;
  }
};

//Delete
export const deleteIpos = async (ipoId) => {
  try {
    const ipoRef = doc(db, IPOS_COLLECTION, ipoId);
    await deleteDoc(ipoRef);
  } catch (error) {
    console.error("Error deleting IPO: ", error);
    throw error;
  }
};

//IPOrequest
const IPOS_REQUESTS_COLLECTION = "ipoInvestmentRequests";

// 1. Add IPO details to a sub-collection in the user's document
export const addIposToUserCollection = async (userId, ipoData) => {
  const userIpoCollectionRef = collection(db, USERS_COLLECTION, userId, "ipos");
  await addDoc(userIpoCollectionRef, ipoData);
};

// 3. Delete the IPO request status from the user's request collection
export const deleteIposRequestStatus = async (uid, requestId) => {
  const requestRef = doc(db, ADMINDASH_COLLECTION, uid, IPOS_REQUESTS_COLLECTION, requestId);
  await deleteDoc(requestRef);
};

// 4. Fetch all the IPO requests
export async function getIposRequests() {
  try {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDashSnapshot = await getDocs(adminDashRef);

    if (adminDashSnapshot.empty) {
      console.warn("No documents found in adminDash collection");
      return [];
    }

    let allIposRequests = [];

    for (const adminDoc of adminDashSnapshot.docs) {
      const userId = adminDoc.id;
      const iposRequestsRef = collection(
        db,
        ADMINDASH_COLLECTION,
        userId,
        IPOS_REQUESTS_COLLECTION
      );
      const iposRequestsSnapshot = await getDocs(iposRequestsRef);

      if (iposRequestsSnapshot.empty) continue;

      const userIposRequests = iposRequestsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: userId,
      }));

      allIposRequests = [...allIposRequests, ...userIposRequests];
    }

    return allIposRequests;
  } catch (error) {
    console.error("Error in getIposRequests: ", error);
    return [];
  }
}

// 5. Handle the IPO approval logic
export const handleIpoApproval = async (uid, requestId, requestData) => {
  try {
    if (!requestId || requestData.amountInvested === undefined) {
      console.error("Invalid requestId:", requestId);
      return;
    }

    // Move to `ipos` sub-collection
    const userIposPath = USERS_COLLECTION/uid/IPOS_COLLECTION;
    const iposDocRef = doc(db, `${userIposPath}/${requestId.id}`);
    await setDoc(iposDocRef, { ...requestId, status: "Approved" }); // set the status to Approved

    // Add Notification
    const userNotificationPath = collection(
      db,
      USERS_COLLECTION,
      uid,
      NOTIFICATIONS_SUB_COLLECTION
    );
    await addDoc(userNotificationPath, {
      message: "Your IPO request has been approved.",
      type: "Approved",
    });

  } catch (error) {
    console.error("Error in Approval:", error);
  }
};

// 6. Handle the IPO decline logic
export const handleIpoDecline = async (uid, requestId,) => {
  try {
    if (!requestId) {
      console.error("Invalid requestId:", requestId);
      return;
    }

    // Add Notification
    const userNotificationPath = `${USERS_COLLECTION}/${uid}/${NOTIFICATIONS_SUB_COLLECTION}`;
    await addDoc(userNotificationPath, {
      message: "Your IPO request has been declined.",
      // timestamp: Timestamp.now(),
      type: "Decline",
    });
    await deleteDoc(requestRef);
  } catch (error) {
    console.error("Error in Decline:", error);
  }
};

export const getSpecificIpoRequest = async (requestId, uid) => {
  const requestRef = doc(
    db,
    ADMINDASH_COLLECTION,
    uid,
    IPOS_REQUESTS_COLLECTION,
    requestId
  );
  const requestSnapshot = await getDoc(requestRef);
  return requestSnapshot.data();
};
