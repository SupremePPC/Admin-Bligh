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
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  ref,
  deleteObject,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

const ADMINUSER_COLLECTION = "admin_users";
const ADMINDASH_COLLECTION = "admin_users";
const USERS_COLLECTION = "users";

//Get Current Date
export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

//Format Number
export function formatNumber(number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export function addAdminUser(uid, fullName, email) {
  // Use the uid directly as the document ID
  return setDoc(doc(db, ADMINUSER_COLLECTION, uid), {
    fullName,
    email,
  });
}

export async function getUser(uid) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return [{ ...userSnap.data(), id: userSnap.id }];
  } else {
    return [];
  }
}

export function updateUser(uid, userData) {
  const userDoc = doc(db, USERS_COLLECTION, uid);
  return updateDoc(userDoc, userData);
}

export function deleteuser(uid) {
  const userDoc = doc(db, USERS_COLLECTION, uid);
  return deleteDoc(userDoc);
}

// Transactions
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

export async function deleteTransaction(userId, transactionId) {
  const transactionRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    TRANSACTIONS_SUB_COLLECTION,
    transactionId
  );

  await deleteDoc(transactionRef);

  return { success: true };
}

//Account Types
export async function addToAccount(userId, label, amount) {
  const accountTypeRef = collection(db, "users", userId, "accountTypes");
  const docRef = doc(accountTypeRef, label);
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, { amount: amount });
    } else {
      await setDoc(docRef, {
        label: label,
        amount: amount,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding to account:", error);
    return { success: false, error: error.message };
  }
}

export async function getAccountTypes(userId) {
  const accountTypeRef = collection(db, "users", userId, "accountTypes");

  try {
    const querySnapshot = await getDocs(accountTypeRef);
    const accountTypes = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      accountTypes.push({ id: doc.id, label: data.label, amount: data.amount });
    });

    return accountTypes;
  } catch (error) {
    console.error("Error getting account types:", error);
    return [];
  }
}

// Banking Details
const BANKING_DETAILS_SUB_COLLECTION = "bankingDetails";

export async function addBankingDetails(
  uid,
  accountName,
  bankName,
  branch,
  bsbNumber,
  accountNumber
) {
  const bankingDetailsRef = collection(
    db,
    USERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION
  );

  // Create a query to check for existing documents with the same details
  const dets = query(
    bankingDetailsRef,
    where("accountName", "==", accountName),
    where("bankName", "==", bankName),
    where("branch", "==", branch),
    where("bsbNumber", "==", bsbNumber),
    where("accountNumber", "==", accountNumber)
  );

  // Execute the query to check for existing documents
  const querySnapshot = await getDocs(dets);

  // Check if any documents were found
  if (!querySnapshot.empty) {
    // Documents with the same details already exist
    throw new Error(
      "Details already exist. Proceed to the edit page to edit them."
    );
  } else {
    // No matching documents found, proceed to add a new document
    return addDoc(bankingDetailsRef, {
      accountName,
      bankName,
      branch,
      bsbNumber,
      accountNumber,
    });
  }
}

export async function updateBankingDetails(uid, formData, bankingDetailsId) {
  const updateBankingDetailsRef = doc(
    db,
    USERS_COLLECTION,
    uid,
    BANKING_DETAILS_SUB_COLLECTION,
    bankingDetailsId
  );
  try {
    await updateDoc(updateBankingDetailsRef, {
      accountName: formData.accountName,
      bankName: formData.bankName,
      branch: formData.branch,
      bsbNumber: formData.bsbNumber,
      accountNumber: formData.accountNumber,
    });
  } catch (error) {
    throw error;
  }
}

export async function getBankingDetails(uid) {
  const bankingDetailsQuery = query(
    doc(db, USERS_COLLECTION, uid),
    BANKING_DETAILS_SUB_COLLECTION
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
      USERS_COLLECTION,
      uid,
      BANKING_DETAILS_SUB_COLLECTION,
      bankingDetailsId
    )
  );
}

//BONDS REQUEST
const BONDS_REQUEST_SUB_COLLECTION = "bondsRequest";

export async function getBondRequests(userId) {
  try {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDashSnapshot = await getDocs(adminDashRef);

    if (adminDashSnapshot.empty) {
      console.warn("No documents found in admin users collection");
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
  if (!bondData) {
    console.error("Invalid bondData:", bondData);
    return;
  }

  const userBondsPath = `users/${uid}/bondsHoldings`;
  const bondDocRef = doc(db, `${userBondsPath}/${bondData.id}`);

  const bondDoc = await getDoc(bondDocRef);

  // Calculate the quantity the user is buying
  const minInvestmentAmount = bondData.minimumAmount || 1;
  const newQuantity = Math.floor(
    bondData.amountRequested / minInvestmentAmount
  );

  if (bondDoc.exists()) {
    const currentData = bondDoc.data();

    // Check if all fields are defined
    if (
      currentData.quantity === undefined ||
      currentData.currentValue === undefined ||
      bondData.amountRequested === undefined
    ) {
      console.error(
        "Undefined fields in currentData or bondData:",
        currentData,
        bondData
      );
      return;
    }

    const updatedQuantity = currentData.quantity + newQuantity;
    const updatedCurrentValue =
      currentData.currentValue + bondData.amountRequested;

    await updateDoc(bondDocRef, {
      quantity: updatedQuantity,
      currentValue: updatedCurrentValue,
    });
  } else {
    // Check if bondData.amount is defined
    if (bondData.amountRequested === undefined) {
      console.error("Undefined amount in bondData:", bondData);
      return;
    }

    await setDoc(bondDocRef, {
      ...bondData,
      quantity: newQuantity,
      currentValue: bondData.amountRequested,
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

// Function to fetch bond data from a specific request
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

export const uploadDocument = async (userId, fileDescription, file) => {
  const storage = getStorage();
  const uid = userId.userId;
  const storageRef = ref(storage, `${uid}/${file.name}`);
  console.log(fileDescription, file, uid);
  try {
    // Upload the document to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Set up event listeners for the upload task if needed
    // For example, to track upload progress

    // Wait for the upload to complete
    const snapshot = await uploadTask;

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Add the metadata to Firestore
    const userDocCollectionRef = collection(db, "users", uid, "docs");
    const docData = {
      fileDescription,
      downloadURL,
    };

    await addDoc(userDocCollectionRef, docData);
  } catch (error) {
    console.error("Error during file upload or Firestore save:", error);
    throw error;
  }
};

export const updateDocumentInFirestore = async (
  userId,
  documentId,
  fileDescription,
  file
) => {
  try {
    // Create a reference to the Firestore document
    const docRef = doc(db, "users", userId, "docs", documentId);

    // Create a reference to the Firebase Storage for the user
    const storage = getStorage();
    const storagePath = ref(storage, `${userId}/${file.name}`);

    // Update the document data with the new file description and file URL
    const updatedDocData = {
      fileDescription,
      downloadURL: storagePath.fullPath, // You may need to adjust this based on your storage structure
    };

    // Update the document in Firestore
    await updateDoc(docRef, updatedDocData);
  } catch (error) {
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

//update existing bond
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

//update new bonds for a particular user
export async function updateBondUser(userId, bondId, bondData) {
  try {
    const userIposHoldingsPath = collection(
      db,
      `users/${userId}/bondsHoldings` // Reference to the subcollection
    );

    const docRef = doc(userIposHoldingsPath, bondId); // Reference to the specific document within the subcollection
    await updateDoc(docRef, bondData);
    const docId = docRef.id;
    return { success: true, id: docId };
  } catch (error) {
    console.error("Error updating ipos:", error);
    return { success: false, error: error.message };
  }
}

export const deleteBondUser = async (uid, requestId) => {
  try {
    const requestRef = doc(
      db,
      USERS_COLLECTION,
      uid,
      "bondsHoldings",
      requestId
    );
    await deleteDoc(requestRef);
  } catch (error) {
    console.error("Error deleting IPO: ", error);
    throw error;
  }
};

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

    const notificationData = {
      message,
      type,
      timestamp: new Date(),
    };

    const notificationRef = await addDoc(notificationsRef, notificationData);

    // Save the notification ID in the document data
    notificationData.notificationId = notificationRef.id;

    // Update the document with the notification ID
    await updateDoc(
      doc(
        db,
        USERS_COLLECTION,
        userId,
        NOTIFICATIONS_SUB_COLLECTION,
        notificationRef.id
      ),
      notificationData
    );

    return { success: true, id: notificationRef.id };
  } catch (error) {
    console.error("Error adding notification:", error);
    return { success: false, error: error.message };
  }
}

//TERMS REQUEST
const TERMS_REQUEST_SUB_COLLECTION = "termDepositRequest";

// 1.Function to fetch all the term requests
export async function getTermRequests() {
  try {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDashSnapshot = await getDocs(adminDashRef);

    if (adminDashSnapshot.empty) {
      console.warn("No documents found in admin users collection");
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

// 2.Function to handle withdraw terms
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

// 3.Function to handle deposit terms
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
      await setDoc(termDocRef, { ...termData });
      return;
    }
    await updateDoc(termDocRef, { amount: termData.amount });
  } catch (error) {
    console.error("Error in handleDepositApproval:", error);
  }
}

// 4.Function to update fixed term request status in the Firestore
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

// 5.Function to delete request from termsRequest sub-collection
export async function deleteFixedTermRequestStatus(userId, requestId) {
  const requestDocPath = doc(
    db,
    `${ADMINDASH_COLLECTION}/${userId}/${TERMS_REQUEST_SUB_COLLECTION}/${requestId}`
  );
  await deleteDoc(requestDocPath);
}

// 6.Function to add term to user's terms sub-collection
export async function addTermToUserCollection(userId, termData) {
  try {
    const userTermsHoldingsPath = collection(
      db,
      `users/${userId}/fixedTermDeposits`
    );
    const docRef = await addDoc(userTermsHoldingsPath, termData);
    const docId = docRef.id;

    return { success: true, id: docId };
  } catch (error) {
    console.error("Error adding term:", error);
    return { success: false, error: error.message };
  }
}

// 7.Function to update term in user's terms subcollection
export async function updateTermInUserCollection(userId, termId, termData) {
  try {
    const userTermsHoldingsPath = collection(
      db,
      `${USERS_COLLECTION}/${userId}/fixedTermDeposits/`
    );
    const docRef = doc(userTermsHoldingsPath, termId);
    await updateDoc(docRef, termData);
    const docId = docRef.id;
    return { success: true, id: docId };
  } catch (error) {
    console.error("Error updating term:", error);
    return { success: false, error: error.message };
  }
}

// 8.Function to delete term from user's terms subcollection
export async function deleteTermFromUserCollection(userId, termId) {
  try {
    const userTermsHoldingsPath = collection(
      db,
      `users/${userId}/fixedTermDeposits/`
    );
    const docRef = doc(userTermsHoldingsPath, termId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting term:", error);
    return { success: false, error: error.message };
  }
}

//IPOS
const IPOS_COLLECTION = "ipos";

// 1.Get all IPOs
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

// 2.Update
export const updateIpo = async (ipoId, updatedData) => {
  try {
    const ipoRef = doc(db, IPOS_COLLECTION, ipoId);
    await updateDoc(ipoRef, updatedData);
  } catch (error) {
    console.error("Error updating IPO: ", error);
    throw error;
  }
};

// 3.Add New
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

// 4.Delete
export const deleteIpos = async (ipoId) => {
  const ipoRef = doc(db, IPOS_COLLECTION, ipoId);
  try {
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
  try {
    const userIposHoldingsPath = collection(db, `users/${userId}/ipos`);
    const docRef = await addDoc(userIposHoldingsPath, ipoData);
    const docId = docRef.id;

    return { success: true, id: docId };
  } catch (error) {
    console.error("Error adding term:", error);
    return { success: false, error: error.message };
  }
};

// 2. Add IPO details to a sub-collection in the user's document
export const updateIposToUserCollection = async (userId, ipoId, ipoData) => {
  try {
    const userIposHoldingsPath = collection(
      db,
      `users/${userId}/ipos` // Reference to the subcollection
    );

    const docRef = doc(userIposHoldingsPath, ipoId); // Reference to the specific document within the subcollection
    await updateDoc(docRef, ipoData);
    const docId = docRef.id;

    return { success: true, id: docId };
  } catch (error) {
    console.error("Error updating ipos:", error);
    return { success: false, error: error.message };
  }
};

// 3. Delete IPO from user's ipos sub-collection
export const deleteIposFromUserCollection = async (uid, requestId) => {
  const requestRef = doc(db, USERS_COLLECTION, uid, IPOS_COLLECTION, requestId);
  await deleteDoc(requestRef);
};

// 3. Delete the IPO request status from the user's request collection
export const deleteIposRequestStatus = async (uid, requestId) => {
  const requestRef = doc(
    db,
    ADMINDASH_COLLECTION,
    uid,
    IPOS_REQUESTS_COLLECTION,
    requestId
  );
  await deleteDoc(requestRef);
};

// 4. Fetch all the IPO requests
export async function getIposRequests() {
  try {
    const adminDashRef = collection(db, ADMINDASH_COLLECTION);
    const adminDashSnapshot = await getDocs(adminDashRef);

    if (adminDashSnapshot.empty) {
      console.warn("No documents found in admin users collection");
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

    // Reference to the user's "ipos" subcollection
    const userIposPath = collection(db, USERS_COLLECTION, uid, IPOS_COLLECTION);

    // Reference to the specific "ipos" document within the subcollection
    const iposDocRef = doc(userIposPath, requestId);

    // Check if the user's "ipos" subcollection exists, and if not, create it
    await setDoc(iposDocRef, { ...requestData, status: "Approved" });

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

    console.log("Request granted", requestData, requestId, iposDocRef);
  } catch (error) {
    console.error("Error in Approval:", error);
  }
};

// 6. Handle the IPO decline logic
export const handleIpoDecline = async (uid, requestId) => {
  try {
    if (!requestId) {
      console.error("Invalid requestId:", requestId);
      return;
    }
    const requestRef = doc(
      db,
      ADMINDASH_COLLECTION,
      uid,
      IPOS_REQUESTS_COLLECTION,
      requestId
    );
    // Add Notification
    const userNotificationPath = `${USERS_COLLECTION}/${uid}/${NOTIFICATIONS_SUB_COLLECTION}`;
    await addDoc(userNotificationPath, {
      message: "Your IPO request has been declined.",
      timestamp: getCurrentDate(),
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

const CASH_DEPOSITS = "cashDeposits";

// Function to fetch all the cash deposits
export async function getCashDeposits() {
  try {
    // Get a reference to the USERS_COLLECTION
    const usersRef = collection(db, USERS_COLLECTION);
    const usersSnapshot = await getDocs(usersRef);

    let allCashDeposits = [];

    // Iterate over each user and get their cash deposits
    for (const userDoc of usersSnapshot.docs) {
      const userUid = userDoc.id;
      const userName = userDoc.data().fullName;
      const cashDepositsRef = collection(
        db,
        USERS_COLLECTION,
        userUid,
        CASH_DEPOSITS
      );
      const cashDepositsSnapshot = await getDocs(cashDepositsRef);

      const userCashDeposits = cashDepositsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userId: userUid,
        userName: userName,
      }));

      allCashDeposits = [...allCashDeposits, ...userCashDeposits];
    }

    // If there are no cash deposits at all, return null
    if (allCashDeposits.length === 0 || allCashDeposits === null) {
      return null;
    }

    return allCashDeposits;
  } catch (error) {
    console.error("Error in getCashDeposits:", error);
    throw new Error(
      "Failed to retrieve cash deposits. Please try again later."
    );
  }
}

// Handle Cash Deposits
export const addCashDeposit = async (uid, depositData) => {
  try {
    // Reference to the cash deposits collection for the user
    const cashDepositsCollection = collection(
      db,
      USERS_COLLECTION,
      uid,
      CASH_DEPOSITS
    );
    const docRef = await addDoc(cashDepositsCollection, depositData);
    const docId = docRef.id;

    return { success: true, id: docId };
  } catch (error) {
    console.error("Error in addCashDeposit:", error);
    throw new Error("Failed to add the cash deposit. Please try again later.");
  }
};

// Update a cash deposit
export const updateCashDeposit = async (uid, depositId, updatedDepositData) => {
  try {
    // Reference to the specific cash deposit document
    const cashDepositRef = doc(
      db,
      USERS_COLLECTION,
      uid,
      CASH_DEPOSITS,
      depositId
    );

    // Update the cash deposit document with the new data
    await setDoc(cashDepositRef, updatedDepositData, { merge: true });

    return { success: true, id: depositId };
  } catch (error) {
    console.error("Error in updateCashDeposit:", error);
    throw new Error(
      "Failed to update the cash deposit. Please try again later."
    );
  }
};

// Delete a cash deposit
export const deleteCashDeposit = async (uid, depositId) => {
  try {
    // Reference to the specific cash deposit document
    const cashDepositRef = doc(
      db,
      USERS_COLLECTION,
      uid,
      CASH_DEPOSITS,
      depositId
    );

    // Delete the cash deposit document
    await deleteDoc(cashDepositRef);
  } catch (error) {
    console.error("Error in deleteCashDeposit:", error);
    throw new Error(
      "Failed to delete the cash deposit. Please try again later."
    );
  }
};

// Function to fetch all the notifications
export async function getLoginNotifications() {
  try {
    const adminDashRef = collection(db, "admin_users");
    const notificationDashRef = doc(adminDashRef, "notifications");

    const loginNotificationsRef = collection(
      notificationDashRef,
      "loginNotifications"
    );
    const logoutNotificationsRef = collection(
      notificationDashRef,
      "logoutNotifications"
    );

    const loginNotificationsSnapshot = await getDocs(loginNotificationsRef);
    const logoutNotificationsSnapshot = await getDocs(logoutNotificationsRef);

    const loginNotifications = loginNotificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const logoutNotifications = logoutNotificationsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const allNotifications = [...loginNotifications, ...logoutNotifications];

    return allNotifications;
  } catch (error) {
    console.error("Error in getLoginNotifications: ", error);
    return [];
  }
}

//sum up all notfications
export async function SumNotifications(setNotifications) {
  const adminDashRef = collection(db, "admin_users");
  const notificationDashRef = doc(adminDashRef, "notifications");

  const loginNotificationsRef = collection(
    notificationDashRef,
    "loginNotifications"
  );
  const logoutNotificationsRef = collection(
    notificationDashRef,
    "logoutNotifications"
  );

  let loginNotificationsCount = 0;
  let logoutNotificationsCount = 0;

  // Listen to changes in the loginNotifications collection
  onSnapshot(loginNotificationsRef, (querySnapshot) => {
    loginNotificationsCount = querySnapshot.size;
    // Update your state here
    setNotifications(loginNotificationsCount + logoutNotificationsCount);
  });

  // Listen to changes in the logoutNotifications collection
  onSnapshot(logoutNotificationsRef, (querySnapshot) => {
    logoutNotificationsCount = querySnapshot.size;
    // Update your state here
    setNotifications(loginNotificationsCount + logoutNotificationsCount);
  });
}

// Function to delete all notifications
export async function deleteAllNotifications() {
  const adminDashRef = collection(db, "admin_users");
  const notificationDashRef = doc(adminDashRef, "notifications");

  const loginNotificationsRef = collection(
    notificationDashRef,
    "loginNotifications"
  );
  const logoutNotificationsRef = collection(
    notificationDashRef,
    "logoutNotifications"
  );

  try {
    // Delete all documents in the 'loginNotifications' sub-collection
    const loginQuerySnapshot = await getDocs(loginNotificationsRef);
    loginQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Delete all documents in the 'logoutNotifications' sub-collection
    const logoutQuerySnapshot = await getDocs(logoutNotificationsRef);
    logoutQuerySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

  } catch (error) {
    console.error("Error deleting all notifications:", error);
  }
}

export async function deleteNotification(notificationId, isLoggedIn) {
  const adminDashRef = collection(db, "admin_users");
  const notificationDashRef = doc(adminDashRef, "notifications");
  const subCollectionName = isLoggedIn
    ? "loginNotifications"
    : "logoutNotifications";

  const notificationsRef = collection(notificationDashRef, subCollectionName);

  try {
    // Delete the notification document by its ID
    await deleteDoc(doc(notificationsRef, notificationId));
  } catch (error) {
    console.error("Error deleting the notification:", error);
  }
}


// Function to fetch the password policy setting from Firestore
export const fetchPasswordPolicySetting = async () => {
  try {
    const docRef = doc(db, 'adminUsers', 'strongPasswordPolicy');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const isStrong = docSnap.data().isTrue;
      return isStrong;
    } else {;
      return true; 
    }
  } catch (error) {
    console.error('Error fetching password policy: ', error);
    throw error;
  }
};

// Function to update the password policy setting in Firestore
export const updatePasswordPolicySetting = async (newValue) => {
  try {
    const docRef = doc(db, 'adminUsers', 'strongPasswordPolicy');
    await updateDoc(docRef, {
      isTrue: newValue,
    });
  } catch (error) {
    console.error('Error updating password policy: ', error);
    throw error;
  }
};
