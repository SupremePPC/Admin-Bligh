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
import {
  deleteBankingDetails,
  formatNumber,
} from "../../firebaseConfig/firestore";
import EditIposUser from "../IPOrequests/Modals/EditModal";
import EditBondModal from "../BondRequestManagement/Modal/EditBondModal";
import EditTermUser from "../TermRequestManagement/Modal/EditTermModal";

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
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
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

    setSelectedForEdit(selectedId);
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
    } else {
      Swal.fire({
        icon: "error",
        title: "User ID Missing",
        text: "The user ID is missing. Please check the URL or the route parameters.",
      });
    }
  }, [user ? user.userId : null]);

  const totalDeposit = transactions
    .filter((item) => item.type === "Deposit" && item.status === "Approved")
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
      // console.error("Invalid term format:", term);
      // setError("Invalid term format");
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
        !modalState.isEditTermOpen &&
        !modalState.isAddNewIpos &&
        !modalState.isEditIposOpen &&
        !modalState.isAddNewDocumentOpen &&
        !modalState.isEditDocumentOpen && (
          <div className="userOverview_container">
            {/* User Details */}
            {userDetails && (
              <div className="user_details">
                <h2>
                  Overview of {userDetails.fullName}
                  {userDetails.jointAccount &&
                    ` and ${userDetails.secondaryAccountHolder}`}
                  {!userDetails.jointAccount && " Account"}
                  {userDetails.jointAccount && " Joint Account"}
                </h2>
                <div className="text_wrap">
                  <p className="bold_text">Primary Account Holder Title :</p>
                  <span className="reg_text">{userDetails.title}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">
                    Primary Account Holder Full Name :
                  </p>
                  <span className="reg_text">{userDetails.fullName}</span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">Secondary Account Holder Title :</p>
                  <span className="reg_text">
                    {userDetails.secondary_title}
                  </span>
                </div>
                <div className="text_wrap">
                  <p className="bold_text">
                    Secondary Account Holder Full Name :
                  </p>
                  <span className="reg_text">
                    {userDetails.secondaryAccountHolder}
                  </span>
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
                  <table className="overview_table">
                    <tbody>
                      <tr>
                        <td className="no_holding">
                          This user hasn't added any banking details yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

            {/* Document */}
            <div className="user_details">
              <h3>Document</h3>
              {docs.length === 0 ? (
                <table className="overview_table">
                  <tbody>
                    <tr>
                      <td className="no_holding">
                        No document has been added yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
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

            {/* Account types and balances*/}
            <div className="user_details">
              <h3>
                Account Types and Balance with Total Balance of $
                {formatNumber(totalBalance)}
              </h3>
              {accountTypes.length === 0 ? (
                <table className="overview_table">
                  <tbody>
                    <tr>
                      <td className="no_holding">
                        This user has no account or balance at the moment.
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <ul className="user_wrap">
                  {accountTypes.map((item, index) => (
                    <li key={index} className="text_wrap">
                      <p className="bold_text">{item.label} :</p>
                      <span className="reg_text">
                        $ {formatNumber(item.amount) || 0}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Transactions List */}
            <div className="user_details">
              <h3>Transaction List</h3>
              <table className="overview_table">
                {transactions.length === 0 ? (
                  <tbody>
                    <tr>
                      <td className="no_holding">
                        No Transaction has been carried out yet.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <>
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
                                  <div
                                    onClick={() =>
                                      handleOpenModal(
                                        "isEditTransactionOpen",
                                        deposits[i]
                                      )
                                    }
                                  >
                                    <span className="bold_text">
                                      {deposits[i].status}
                                    </span>{" "}
                                    <span className="reg_text">
                                      ${formatNumber(deposits[i].amount)}
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
                                  <div
                                    onClick={() =>
                                      handleOpenModal(
                                        "isEditTransactionOpen",
                                        withdrawals[i]
                                      )
                                    }
                                  >
                                    <span className="bold_text">
                                      {withdrawals[i].status}
                                    </span>{" "}
                                    <span className="reg_text">
                                      ${formatNumber(withdrawals[i].amount)}
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
                  </>
                )}
              </table>
              <div className="dropdown_btn">
                <button onClick={() => handleOpenModal("isAddTransactionOpen")}>
                  Add Transaction
                </button>
              </div>
            </div>

            {/* Bonds List */}
            <div className="user_details">
              <h3>Bonds Holdings</h3>
              <table className="overview_table">
                {bondsHoldings.length > 0 ? (
                  <>
                    <thead>
                      <tr>
                        <th>Issuer Name</th>
                        <th>Current Value</th>
                        <th>Amount</th>
                        <th>Maturity Date</th>
                        <th>Purchase Date</th>
                        {/* <th>Quantity</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const item = bondsHoldings;
                        const maxLength = Math.max(bondsHoldings.length);
                        const rows = [];

                        for (let i = 0; i < maxLength; i++) {
                          rows.push(
                            <tr
                              key={i}
                              onClick={() =>
                                handleOpenModal("isEditBondOpen", item[i])
                              }
                            >
                              <td>
                                <div className="button_grid">
                                  <img src={item[i].image} alt="Bond image" />
                                  <p>{item[i].issuerName}</p>
                                </div>
                              </td>
                              <td>{item[i].currentValue}</td>
                              <td>$ {formatNumber(item[i].amountRequested)}</td>
                              <td>{item[i].maturityDate}</td>
                              <td>{item[i].purchaseDate}</td>
                            </tr>
                          );
                        }
                        return rows;
                      })()}
                    </tbody>
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td className="no_holding">
                        This user holds no bonds at the moment.
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
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
                    <tbody>
                      {(() => {
                        const term = fixedTerm;
                        const maxLength = Math.max(fixedTerm.length);
                        const rows = [];

                        for (let i = 0; i < maxLength; i++) {
                          rows.push(
                            <tr
                              key={i}
                              onClick={() =>
                                handleOpenModal("isEditTermOpen", term[i])
                              }
                            >
                              <td>
                                <div className="button_grid">
                                  <img src={term[i].logo} alt="logo" />
                                  <p>{term[i].bankName}</p>
                                </div>
                              </td>
                              <td>$ {term[i].principalAmount}</td>
                              <td>{term[i].term}</td>
                              <td>{term[i].interestRate} %</td>
                              <td>
                                ${" "}
                                {calculateMaturityAmount(
                                  term[i].principalAmount,
                                  term[i].interestRate,
                                  term[i].term
                                ) || 0}
                              </td>
                            </tr>
                          );
                        }
                        return rows;
                      })()}
                    </tbody>
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
                    <tbody>
                      {(() => {
                        const item = ipos;
                        const maxLength = Math.max(ipos.length);
                        const rows = [];

                        for (let i = 0; i < maxLength; i++) {
                          rows.push(
                            <tr
                              key={i}
                              onClick={() =>
                                handleOpenModal("isEditIposOpen", item[i])
                              }
                            >
                              <td>
                                <div className="button_grid">
                                  <img src={item[i].logo} alt="logo" />
                                  <p>{item[i].name}</p>
                                </div>
                              </td>
                              <td>{item[i].date}</td>
                              <td>$ {formatNumber(item[i].amountInvested)}</td>
                              <td>{item[i].numberOfShares}</td>
                              <td>$ {item[i].sharePrice}</td>
                            </tr>
                          );
                        }
                        return rows;
                      })()}
                    </tbody>
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td className="no_holding">No current IPOs.</td>
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
          refreshDetails={() => {
            fetchSubCollection("transactions", setTransactions);
            fetchSubCollection("accountTypes", setAccountTypes);
          }}
        />
      )}

      {modalState.isEditTransactionOpen && (
        <EditTransaction
          onClose={() => {
            handleCloseModal("isEditTransactionOpen");
          }}
          selectedTransaction={selectedForEdit}
          setTransactions={setTransactions}
          userId={user}
          totalBalance={totalBalance}
          refreshDetails={() => {
            fetchSubCollection("transactions", setTransactions);
            fetchSubCollection("accountTypes", setAccountTypes);
          }}
          transactionId={selectedForEdit.id}
        />
      )}

      {modalState.isAddBondOpen && (
        <AddBond
          onClose={() => {
            handleCloseModal("isAddBondOpen");
          }}
          bond={bondsHoldings}
          setBond={setBondsHoldings}
          userId={user}
          refreshDetails={() => {
            fetchSubCollection("bondsHoldings", setBondsHoldings);
          }}
        />
      )}

      {modalState.isEditBondOpen && (
        <EditBondModal
          onClose={() => {
            handleCloseModal("isEditBondOpen");
            setSelectedForEdit(null);
            fetchSubCollection("bondsHoldings", setBondsHoldings);
          }}
          setBond={setBondsHoldings}
          bondId={selectedForEdit.id}
          bond={selectedForEdit}
          userId={user}
          refreshDetails={() => {
            fetchSubCollection("bondsHoldings", setBondsHoldings);
          }}
        />
      )}

      {modalState.isAddNewTermOpen && (
        <AddNewTerm
          onClose={() => {
            handleCloseModal("isAddNewTermOpen");
          }}
          fixedTerm={fixedTerm}
          setFixedTerm={setFixedTerm}
          userId={user}
        />
      )}

      {modalState.isEditTermOpen && (
        <EditTermUser
          onClose={() => {
            handleCloseModal("isEditTermOpen");
            setSelectedForEdit(null);
            fetchSubCollection("fixedTermDeposits", setFixedTerm);
          }}
          setFixedTerm={setFixedTerm}
          userId={user}
          fixedTerm={selectedForEdit}
          termId={selectedForEdit.id}
          refreshDetails={() => {
            fetchSubCollection("fixedTermDeposits", setFixedTerm);
          }}
        />
      )}

      {modalState.isAddNewIpos && (
        <AddUserIpos
          onClose={() => {
            handleCloseModal("isAddNewIpos");
            fetchSubCollection("ipos", setIpos);
          }}
          ipos={ipos}
          setIpos={setIpos}
          userId={user}
        />
      )}

      {modalState.isEditIposOpen && (
        <EditIposUser
          onClose={() => {
            handleCloseModal("isEditIposOpen");
            setSelectedForEdit(null);
            fetchSubCollection("ipos", setIpos);
          }}
          userId={user}
          setIpos={setIpos}
          ipo={selectedForEdit}
          iposId={selectedForEdit.id}
          refreshDetails={() => {
            fetchSubCollection("ipos", setIpos);
          }}
        />
      )}

      {modalState.isAddNewDocumentOpen && (
        <AddDocument
          onClose={() => {
            handleCloseModal("isAddNewDocumentOpen");
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
