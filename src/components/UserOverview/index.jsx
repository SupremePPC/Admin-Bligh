import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import AddBankingDetails from "../BankingDetails/Add";
import EditBankingDetails from "../BankingDetails/Edit";
import EditUser from "../RegisteredUsers/Edit";
import AddTransaction from "../TransactionManagement/AddTransaction";
import EditTransaction from "../TransactionManagement/Edit";
import AddBond from "../BondRequestManagement/Add";
import AddUserIpos from "../IPOrequests/Add";
import AddNewTerm from "../TermRequestManagement/Add";
import AddDocument from "../DocumentManagement/Add";
import Swal from "sweetalert2";
import "./style.css";
import EditDocument from "../DocumentManagement/Edit";
import { deleteBankingDetails } from "../../firebaseConfig/firestore";
import Edit from "../BankingDetails/Edit";

const UserOverview = () => {
  const user = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [bondsHoldings, setBondsHoldings] = useState([]);
  const [docs, setDocs] = useState([]);
  const [ipos, setIpos] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fixedTerm, setFixedTerm] = useState([]);
  const [selectedUserForAdd, setSelectedUserForAdd] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [modalState, setModalState] = useState({
    isAddTransactionOpen: false,
    isAddBondOpen: false,
    isAddAccountOpen: false,
    isAddBankingDetails: false,
    isEditBankingDetails: false,
    isEditTransactionOpen: false,
    isEditBondOpen: false,
    isUserDetailsOpen: false,
    isAddTransactionOpen: false,
    isEditUserDetailsOpen: false,
    isAddNewTermOpen: false,
    isAddNewIpos: false,
  });

  const handleOpenModal = (modalType, selectedId) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalType]: true,
    }));
  
    setSelectedTransaction(selectedId); 
  };
  
  const handleCloseModal = (modalType) => {
    setModalState({
      ...modalState,
      [modalType]: false,
    });
  };

  // Example function to select a document for editing
  const handleEditDocument = (document) => {
    setSelectedDocument(document);
    handleOpenModal("isEditDocumentOpen");
  };

  const handleDelete = async (bankingDetailsId) => {
    setIsLoading(true);
    const uid = user.userId;
    try {
      await deleteBankingDetails(uid, bankingDetailsId);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Banking Details deleted successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      fetchSubCollection("bankingDetails", setBankingDetails);
    } catch (error) {
      console.error("Failed to delete Banking Details:", error);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error in deleting Banking Details.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubCollection = async (subCollectionName, setFunction) => {
    const subCollectionRef = collection(
      db,
      "users",
      user.userId,
      subCollectionName
    );
    const subCollectionSnapshot = await getDocs(subCollectionRef);
    const subCollectionData = subCollectionSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setFunction(subCollectionData);
  };

  const fetchUserDetails = async () => {
    const userRef = doc(db, "users", user.userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      setUserDetails(userSnapshot.data());
    } else {
      Swal.fire({
        icon: "error",
        title: "User not found",
        text: "The specified user does not exist.",
      });
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchUserDetails();
      fetchSubCollection("accountTypes", setAccountTypes);
      fetchSubCollection("bankingDetails", setBankingDetails);
      fetchSubCollection("bondsHoldings", setBondsHoldings);
      fetchSubCollection("transactions", setTransactions);
      fetchSubCollection("fixedTermDeposits", setFixedTerm);
      fetchSubCollection("ipos", setIpos);
      fetchSubCollection("docs", setDocs);
      // console.log(bankingDetails, bankingDetails[0].id);
    } else {
      Swal.fire({
        icon: "error",
        title: "User ID Missing",
        text: "The user ID is missing. Please check the URL or the route parameters.",
      });
    }
  }, [user ? user.userId : null]);

  const totalDeposit = transactions
    .filter((item) => item.type === "Deposit")
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const totalWithdrawal = transactions
    .filter((item) => item.type === "Withdrawal" && item.status === "Approved")
    .reduce((total, item) => total + parseFloat(item.amount), 0);

  const totalBalance = totalDeposit - totalWithdrawal;

  const calculateMaturityAmount = (principal, interestRate, term) => {
    // Parse principal and interestRate to float numbers
    const principalNumber = parseFloat(principal);
    const interestRateNumber = parseFloat(interestRate);

    // Parse the term string to extract the number and the unit
    const termParts = term.split(" ");
    if (termParts.length !== 2) {
      console.error("Invalid term format:", term);
      return "Invalid Input";
    }

    const termNumber = parseFloat(termParts[0]);
    const termUnit = termParts[1].toLowerCase();

    if (!["year", "years", "month", "months"].includes(termUnit)) {
      console.error("Invalid term unit:", termUnit);
      return "Invalid Input";
    }

    if (
      isNaN(principalNumber) ||
      isNaN(interestRateNumber) ||
      isNaN(termNumber)
    ) {
      return "Invalid Input";
    }

    // Create a separate variable for the converted term in years
    let termInYears = termNumber;

    if (termUnit === "months" || termUnit === "month") {
      // Convert months to years
      termInYears /= 12;
    }

    const maturityAmount =
      principalNumber * (1 + (interestRateNumber / 100) * termInYears);
    return maturityAmount.toFixed(2);
  };

  const firestoreTimestampToDate = (timestamp) => {
    return timestamp
      ? new Date(timestamp.seconds * 1000).toLocaleDateString()
      : "";
  };

  return (
    <div className="container">
      {!modalState.isAddBondOpen &&
        !modalState.isAddAccountOpen &&
        !modalState.isAddBankingDetails &&
        !modalState.isAddTransactionOpen &&
        !modalState.isAddBondOpen &&
        !modalState.isEditUserDetailsOpen &&
        !modalState.isEditTransactionOpen &&
        !modalState.isEditBankingDetails &&
        !modalState.isEditBondOpen &&
        !modalState.isEditBankingDetails &&
        !modalState.isAddNewTermOpen &&
        !modalState.isAddNewIpos &&
        !modalState.isAddNewDocumentOpen &&
        !modalState.isEditDocumentOpen && (
          <div className="userOverview_container">
            {/* User Details */}
            {userDetails && (
              <div className="user_details">
                <h2>Overview of {userDetails.fullName}'s account</h2>
                <div className="text_wrap">
                  <p className="bold_text">Title :</p>
                  <span className="reg_text">{userDetails.title}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">Full Name :</p>
                  <span className="reg_text">{userDetails.fullName}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">Email :</p>
                  <span className="reg_text">{userDetails.email}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">Address :</p>
                  <span className="reg_text">{userDetails.address}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">City :</p>
                  <span className="reg_text">{userDetails.city}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">Country :</p>
                  <span className="reg_text">{userDetails.country}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">Home Phone :</p>
                  <span className="reg_text">{userDetails.homePhone}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">Mobile Phone :</p>
                  <span className="reg_text">{userDetails.mobilePhone}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">Postcode :</p>
                  <span className="reg_text">{userDetails.postcode}</span>
                </div>
                <div className="dropdown_btn">
                  <button
                    style={{ marginLeft: "12px" }}
                    onClick={() => handleOpenModal("isEditUserDetailsOpen")}
                  >
                    Edit User Details
                  </button>
                </div>
              </div>
            )}

            {/* Banking Details */}
            <div className="user_details">
              <h3>Banking Details</h3>
              {bankingDetails.length === 0 ? (
                <>
                  <p className="bold_text">
                    This user hasn't added any banking details yet.
                  </p>
                  <div className="dropdown_btn">
                    <button
                      style={{ marginLeft: "12px" }}
                      className="mutedButton"
                      type="button"
                      onClick={() => handleOpenModal("isAddBankingDetails")}
                    >
                      {" "}
                      Add Details
                    </button>
                  </div>
                </>
              ) : (
                bankingDetails.map((item, index) => (
                  <div className="user_wrap" key={index}>
                    <div className="text_wrap">
                      <p className="bold_text"> Bank Name :</p>
                      <span className="reg_text">{item.bankName}</span>
                    </div>
                    <div className="text_wrap">
                      <p className="bold_text">Account Name: </p>
                      <span className="reg_text">{item.accountName}</span>
                    </div>
                    <div className="text_wrap">
                      <p className="bold_text"> Branch:</p>
                      <span className="reg_text">{item.branch}</span>
                    </div>
                    <div className="text_wrap">
                      <p className="bold_text"> BSB Number :</p>
                      <span className="reg_text">{item.bsbNumber}</span>
                    </div>
                    <div className="text_wrap">
                      <p className="bold_text">Account Number:</p>
                      <span className="reg_text">{item.accountNumber}</span>
                    </div>

                    <div style={{ marginTop: "30px" }} className="dropdown_btn">
                      <button
                        type="submit"
                        onClick={() => handleDelete(bankingDetails[0].id)}
                      >
                        Delete Details
                      </button>
                      {isLoading && <div className="spinner"></div>}
                      <button
                        style={{ marginLeft: "12px" }}
                        className="mutedButton"
                        type="button"
                        onClick={() => handleOpenModal("isEditBankingDetails")}
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Account types and balances*/}
            <div className="user_details">
              <h3>
                Account Types and Balance with Total Balance of ${totalBalance}
              </h3>
              {accountTypes.length === 0 ? (
                <p className="bold_text">
                  This user has no account or balance at the moment.
                </p>
              ) : (
                <ul className="user_wrap">
                  {accountTypes.map((item, index) => (
                    <li key={index} className="text_wrap">
                      <p className="bold_text">{item.label} :</p>
                      <span className="reg_text">$ {item.amount || 0}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Transactions List */}
            <div className="user_details">
              <h3>Transaction List</h3>
              {transactions.length === 0 ? (
                <p className="bold_text">
                  No Transaction has been carried out yet.
                </p>
              ) : (
                <table className="overview_table">
                  <thead>
                    <tr>
                      <th className="bold_text">Deposit amount</th>
                      <th className="bold_text">Withdrawal amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const deposits = transactions.filter(
                        (t) => t.type === "Deposit"
                      );
                      const withdrawals = transactions.filter(
                        (t) => t.type === "Withdrawal"
                      );
                      const maxLength = Math.max(
                        deposits.length,
                        withdrawals.length
                      );
                      const rows = [];

                      for (let i = 0; i < maxLength; i++) {
                        rows.push(
                          <tr key={i}>
                              <td>
                              {deposits[i] && (
                            <div onClick={() => handleOpenModal('isEditTransactionOpen', deposits[i])}
                            >
                               <span className="bold_text">
                                    {deposits[i].status}
                                  </span>{" "}
                                  <span className="reg_text">
                                    ${deposits[i].amount}
                                  </span>
                                  <span> in </span>
                                  <span className="bold_text">
                                    {deposits[i].accountType}
                                  </span>
                              </div>
                              )}
                                </td>
                                <td>
                            {withdrawals[i] && (
                            <div onClick={() => handleOpenModal('isEditTransactionOpen', deposits[i])}
                            >
                              <span className="bold_text">
                                  {withdrawals[i].status}
                                </span>{" "}
                                <span className="reg_text">
                                  ${withdrawals[i].amount}
                                </span>
                                <span> in </span>
                                <span className="bold_text">
                                  {withdrawals[i].accountType}
                                </span>
                            </div>
                            )}
                              </td>
                          </tr>
                        );
                      }

                      return rows;
                    })()}
                  </tbody>
                </table>
              )}
              <div className="dropdown_btn">
                <button onClick={() => handleOpenModal("isAddTransactionOpen")}>
                  Add Transaction
                </button>
              </div>
            </div>

            {/* Bonds List */}
            <div className="user_details">
              <h3>Bonds Holdings</h3>
              {bondsHoldings.length === 0 ? (
                <p className="bold_text">
                  This user holds no bonds at the moment.
                </p>
              ) : (
                bondsHoldings.map((item) => {
                  const maturityObject = item.maturityDate?.toDate
                    ? item.maturityDate.toDate()
                    : new Date(item.maturityDate);
                  const maturityDay = String(maturityObject.getDate()).padStart(
                    2,
                    "0"
                  );
                  const maturityMonth = String(
                    maturityObject.getMonth() + 1
                  ).padStart(2, "0");
                  const maturityYear = maturityObject.getFullYear();
                  const formattedMaturity = `${maturityDay}/${maturityMonth}/${maturityYear}`;

                  const purchaseObject = item.purchaseDate?.toDate
                    ? item.purchaseDate.toDate()
                    : new Date(item.purchaseDate);
                  const day = String(purchaseObject.getDate()).padStart(2, "0");
                  const month = String(purchaseObject.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const year = purchaseObject.getFullYear();
                  const formattedPurchase = `${day}/${month}/${year}`;

                  return (
                    <div className="user_wrap" key={item.id}>
                      <div className="text_wrap">
                        <img
                          src={item.image}
                          alt="Bond image"
                          style={{ width: "100px" }}
                        />
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">Issuer Name:</p>
                        <span className="reg_text">{item.issuerName}</span>
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">Current Value:</p>
                        <span className="reg_text">$ {item.currentValue}</span>
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">Maturity Date:</p>
                        <span className="reg_text">{formattedMaturity}</span>
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">Purchase Date:</p>
                        <span className="reg_text">{formattedPurchase}</span>
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">Quantity:</p>
                        <span className="reg_text">{item.quantity}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div className="dropdown_btn">
                <button onClick={() => handleOpenModal("isAddBondOpen")}>
                  Add Bond
                </button>
              </div>
            </div>

            {/* Fixed Term Table */}
            <div className="user_details">
              <h3>Fixed Term Deposits</h3>
              <table className="overview_table">
                {fixedTerm.length > 0 ? (
                  <>
                    <thead>
                      <tr>
                        <th title="Unique identifier or name.">
                          Term Deposit Name
                        </th>
                        <th title="The initial amount deposited.">
                          Principal Amount
                        </th>
                        <th title="The date when the term deposit will mature.">
                          Maturity Date
                        </th>
                        <th title="The rate at which interest is earned.">
                          Interest Rate
                        </th>
                        <th title="The amount receivable upon maturity.">
                          Maturity Amount
                        </th>
                      </tr>
                    </thead>
                    {fixedTerm.map((term, index) => (
                      <tbody key={index}>
                        <tr>
                          <td>
                            <div className="button_grid">
                              <img src={term.logo} alt="logo" />
                              <p>{term.bankName}</p>
                            </div>
                          </td>
                          <td>$ {term.principalAmount}</td>
                          <td>{term.term}</td>
                          <td>{term.interestRate} %</td>
                          <td>
                            ${" "}
                            {calculateMaturityAmount(
                              term.principalAmount,
                              term.interestRate,
                              term.term
                            ) || 0}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td className="no_holding">
                        No Fixed Terms Deposits Available.
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
              <div className="dropdown_btn">
                <button onClick={() => handleOpenModal("isAddNewTermOpen")}>
                  Add Fixed Term Deposit
                </button>
              </div>
            </div>

            {/* IPOs  */}
            <div className="user_details">
              <h3>IPOs</h3>
              <table className="overview_table">
                {ipos.length > 0 ? (
                  <>
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Purchase Date</th>
                        <th>Purchase Price</th>
                        <th>Number of Shares</th>
                        <th>Current Price</th>
                      </tr>
                    </thead>
                    {ipos.map((ipos, index) => (
                      <tbody key={index}>
                        <tr>
                          <td>
                            <div className="button_grid">
                              <img src={ipos.logo} alt="logo" />
                              <p>{ipos.name}</p>
                            </div>
                          </td>
                          <td>{firestoreTimestampToDate(ipos.date)}</td>
                          <td>$ {ipos.amountInvested}</td>
                          <td>{ipos.numberOfShares}</td>
                          <td>$ {ipos.sharePrice}</td>
                        </tr>
                      </tbody>
                    ))}
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td className="no_holding">No current Holdings.</td>
                    </tr>
                  </tbody>
                )}
              </table>
              <div className="dropdown_btn">
                <button onClick={() => handleOpenModal("isAddNewIpos")}>
                  Add IPOs
                </button>
              </div>
            </div>

            {/* Document */}
            <div className="user_details">
              <h3>Document</h3>
              {docs.length === 0 ? (
                <>
                  <p className="bold_text">No document has been added yet.</p>
                </>
              ) : (
                docs.map((doc, item) => (
                  <div className="user_wrap" key={item}>
                    {/* <div className="text_wrap"> */}
                    <div className="text_wrap">
                      <p className="bold_text">File Description :</p>
                      <span className="reg_text">{doc.fileDescription}</span>
                    </div>
                    {/* </div> */}
                    <div className="text_wrap">
                      <p className="bold_text">File Url :</p>
                      <a className="bold_text" href={doc.downloadURL}>
                        <u>Download URL</u>
                      </a>
                    </div>
                    {/* <div className="text_wrap">
                      <div className="dropdown_btn">
                        <button
                          onClick={() => {
                            handleEditDocument(doc);
                          }}
                        >
                          Edit Document
                        </button>
                      </div>
                    </div> */}
                  </div>
                ))
              )}
              <div className="dropdown_btn">
                <button onClick={() => handleOpenModal("isAddNewDocumentOpen")}>
                  Add Document
                </button>
              </div>
            </div>
          </div>
        )}

      {modalState.isEditUserDetailsOpen && (
        <EditUser
          onClose={() => {
            handleCloseModal("isEditUserDetailsOpen");
          }}
          user={user}
          details={userDetails}
          refreshDetails={fetchUserDetails}
        />
      )}

      {modalState.isAddBankingDetails && (
        <AddBankingDetails
          onClose={() => {
            handleCloseModal("isAddBankingDetails");
            setSelectedUserForAdd(null);
          }}
          userId={user}
          refreshDetails={() => {
            fetchSubCollection("bankingDetails", setBankingDetails);
          }}
        />
      )}

      {modalState.isEditBankingDetails && (
        <EditBankingDetails
          onClose={() => {
            handleCloseModal("isEditBankingDetails");
            setSelectedUserForAdd(null);
          }}
          userId={user}
          bankingDetailsId={bankingDetails.id}
          bankingDetails={bankingDetails[0]}
          refreshDetails={() => {
            fetchSubCollection("bankingDetails", setBankingDetails);
          }}
        />
      )}

      {modalState.isAddTransactionOpen && (
        <AddTransaction
          onClose={() => {
            handleCloseModal("isAddTransactionOpen");
          }}
          setTransactions={setTransactions}
          transactions={transactions}
          totalBalance={totalBalance}
          userId={user}
          openEdit={() => {
            handleOpenModal("isEditTransactionOpen");
          }}
        />
      )}

      {modalState.isEditTransactionOpen && (
        <EditTransaction
          onClose={() => {
            handleCloseModal("isEditTransactionOpen");
            setSelectedUserForAdd(null);
          }}
          selectedTransaction={selectedTransaction}
          setTransactions={setTransactions}
          userId={user}
          totalBalance={totalBalance}
          refreshDetails={() => {
            fetchSubCollection("transactions", setTransactions);
          } }
        />
      )}

      {modalState.isAddBondOpen && (
        <AddBond
          onClose={() => {
            handleCloseModal("isAddBondOpen");
            setSelectedUserForAdd(null);
          }}
          bond={bondsHoldings}
          setBond={setBondsHoldings}
          userId={user}
          openEdit={() => {
            handleOpenModal("isEditBondOpen");
            setSelectedUserForAdd(user);
          }}
        />
      )}

      {modalState.isEditBondOpen && (
        <EditBond
          onClose={() => {
            handleCloseModal("isEditBondOpen");
            setSelectedUserForAdd(null);
          }}
          bond={bondsHoldings}
          setBond={setBondsHoldings}
          selectedBonds={bondsHoldings[0]}
          userId={user}
        />
      )}

      {modalState.isAddNewTermOpen && (
        <AddNewTerm
          onClose={() => {
            handleCloseModal("isAddNewTermOpen");
            setSelectedUserForAdd(null);
          }}
          fixedTerm={fixedTerm}
          setFixedTerm={setFixedTerm}
          userId={user}
        />
      )}

      {modalState.isAddNewIpos && (
        <AddUserIpos
          onClose={() => {
            handleCloseModal("isAddNewIpos");
            setSelectedUserForAdd(null);
            fetchSubCollection("ipos", setIpos);
          }}
          ipos={ipos}
          setIpos={setIpos}
          userId={user}
        />
      )}

      {modalState.isAddNewDocumentOpen && (
        <AddDocument
          onClose={() => {
            handleCloseModal("isAddNewDocumentOpen");
            setSelectedUserForAdd(null);
          }}
          docs={docs}
          setDocs={setDocs}
          userId={user}
        />
      )}

      {modalState.isEditDocumentOpen && (
        <EditDocument
          onClose={() => {
            handleCloseModal("isEditDocumentOpen");
            setSelectedDocument(null); // Clear the selected document when closing the modal
          }}
          docs={selectedDocument}
          setDocs={setDocs}
          userId={user}
        />
      )}
    </div>
  );
};

export default UserOverview;
