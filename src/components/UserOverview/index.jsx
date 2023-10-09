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
import Swal from "sweetalert2";g
import "./style.css";

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

  const [modalState, setModalState] = useState({
    isAddTransactionOpen: false,
    isAddBondOpen: false,
    isAddAccountOpen: false,
    isAddBankingDetails: false,
    isEditBankingDetails: false,
    isEditTransactionOpen: false,
    isUserDetailsOpen: false,
    isAddTransactionOpen: false,
    isEditUserDetailsOpen: false,
    isAddNewTermOpen: false,
    isAddNewIpos: false,
  });

  const handleOpenModal = (modalType) => {
    setModalState({
      ...modalState,
      [modalType]: true,
    });
  };

  const handleCloseModal = (modalType) => {
    setModalState({
      ...modalState,
      [modalType]: false,
    });
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

  useEffect(() => {
    if (user && user.userId) {
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

  const totalBalance = accountTypes.reduce(
    (total, item) => total + parseFloat(item.balance),
    0
  );

  const calculateMaturityAmount = (principal, interestRate, term) => {
    // Parse principal and interestRate to float numbers
    const principalNumber = parseFloat(principal);
    const interestRateNumber = parseFloat(interestRate);

    // Parse the term string to extract the number and the unit
    const termParts = term.split(" ");
    if (termParts.length !== 2) {
      console.error("Invalid term format:", term); // Log error for invalid term
      return "Invalid Input"; // Return error message for invalid term
    }

    let termNumber = parseFloat(termParts[0]);
    const termUnit = termParts[1];

    // If the term is in months, convert it to years
    if (termUnit.startsWith("Month")) {
      termNumber = termNumber / 12;
    } else if (!termUnit.startsWith("Year")) {
      console.error("Invalid term unit:", termUnit); // Log error for invalid termUnit
      return "Invalid Input"; // Return error message for invalid termUnit
    }

    // Check for invalid inputs
    if (
      isNaN(principalNumber) ||
      isNaN(interestRateNumber) ||
      isNaN(termNumber)
    ) {
      return "Invalid Input"; // Return error message for NaN values
    }

    // Calculate the maturity amount
    const maturityAmount =
      principalNumber * (1 + (interestRateNumber / 100) * termNumber);
    return maturityAmount.toFixed(2);
  };

  const firestoreTimestampToDate = (timestamp) => {
    return timestamp
      ? new Date(timestamp.seconds * 1000).toLocaleDateString()
      : "";
  };

  const numberOfShares = ipos.amountInvested / ipos.sharePrice;

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
        !modalState.isAddNewTermOpen &&
        !modalState.isAddNewIpos && (
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
                      onClick={() => handleOpenModal("isAddBankingDetails")}
                    >
                      Add Banking Details
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
                      <p className="bold_text"> IBAN :</p>
                      <span className="reg_text">{item.iban}</span>
                    </div>
                    <div className="text_wrap">
                      <p className="bold_text">Swift Code:</p>
                      <span className="reg_text">{item.swiftCode}</span>
                    </div>
                    <div className="text_wrap">
                      <p className="bold_text"> Branch:</p>
                      <span className="reg_text">{item.branch}</span>
                    </div>
                    <div className="text_wrap">
                      <p className="bold_text">Account Name: </p>
                      <span className="reg_text">{item.accountName}</span>
                    </div>
                  </div>
                ))
              )}
              <div className="dropdown_btn">
                <button onClick={() => handleOpenModal("isEditBankingDetails")}>
                  Edit Banking Details
                </button>
              </div>
            </div>

            {/* Account types and balances*/}
            <div className="user_details">
              <h3>Account Types and Balance</h3>
              {accountTypes.length === 0 ? (
                <p className="bold_text">
                  This user has no account or balance at the moment.
                </p>
              ) : (
                <ul className="user_wrap">
                  {accountTypes.map((item, index) => (
                    <li key={index} className="text_wrap">
                      <p className="bold_text">{item.type} :</p>
                      <span className="reg_text">€ {item.balance} </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="text_wrap">
                <p className="bold_text">Total Balance :</p>
                <span className="reg_text">€ {totalBalance}</span>
              </div>
              {/* <div className="dropdown_btn">
              <button onClick={() => handleOpenModal("isAddAccountOpen")}>Add to Account</button>
            </div> */}
            </div>

            {/* Transactions List */}
            <div className="user_details">
              <h3>Transaction List</h3>
              {transactions.length === 0 ? (
                <p className="bold_text">
                  No Transaction has been carried out yet.
                </p>
              ) : (
                <table className="transaction_table">
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
                                <span className="reg_text">
                                  € {deposits[i].amount}
                                </span>
                              )}
                            </td>
                            <td>
                              {withdrawals[i] && (
                                <span className="reg_text">
                                  € {withdrawals[i].amount}
                                </span>
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
                        <p className="bold_text">Company Website:</p>
                        <span className="reg_text">{item.companyWebsite}</span>
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">Coupon Frequency:</p>
                        <span className="reg_text">{item.couponFrequency}</span>
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">Coupon Rate:</p>
                        <span className="reg_text">{item.couponRate}%</span>
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">Current Value:</p>
                        <span className="reg_text">$ {item.currentValue}</span>
                      </div>
                      <div className="text_wrap">
                        <p className="bold_text">ISIN:</p>
                        <span className="reg_text">{item.isin}</span>
                      </div>

                      <div className="text_wrap">
                        <p className="bold_text">Minimum Amount:</p>
                        <span className="reg_text">$ {item.minimumAmount}</span>
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
                      <div className="text_wrap">
                        <p className="bold_text">Sector:</p>
                        <span className="reg_text">{item.sector}</span>
                      </div>

                      <div className="text_wrap">
                        <p className="bold_text">Type:</p>
                        <span className="reg_text">{item.type}</span>
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
              <table className="term_table">
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
                          <td>€ {term.principalAmount}</td>
                          <td>{term.term}</td>
                          <td>{term.interestRate} %</td>
                          <td>
                            €{" "}
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
              <table className="terms_table">
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
                          <td>€ {ipos.amountInvested}</td>
                          <td>{numberOfShares}</td>
                          <td>€ {ipos.sharePrice}</td>
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
            {/* <div className="user_details">
              <h3>Document</h3>
              {docs.length === 0 ? (
                <>
                  <p className="bold_text">No document has been added yet.</p>
                  <div className="dropdown_btn">
                    <button onClick={handleAddBond}>Add Document</button>
                  </div>
                </>
              ) : (
                docs.map((item) => (
                  <div className="user_wrap" key={item.id}>
                    <div className="text_wrap">
                      <div className="text_wrap">
                        <p className="bold_text">File Description :</p>
                        <span className="reg_text">{item.fileDescription}</span>
                      </div>
                    </div>
                    <div className="text_wrap">
                      <a className="bold_text" href={item.downloadURL}>
                        <u>Download URL</u>
                      </a>
                    </div>
                    <div className="dropdown_btn">
                      <button onClick={handleAddBond}>Edit Document</button>
                    </div>
                  </div>
                ))
              )}
            </div> */}
          </div>
        )}
      {modalState.isAddBankingDetails && (
        <AddBankingDetails
          onClose={() => {
            handleCloseModal("isAddBankingDetails");
            setSelectedUserForAdd(null);
          }}
          userId={user}
        />
      )}
      {modalState.isEditUserDetailsOpen && (
        <EditUser
          onClose={() => {
            handleCloseModal("isEditUserDetailsOpen");
          }}
          user={userDetails}
        />
      )}
      {modalState.isEditBankingDetails && (
        <EditBankingDetails
          onClose={() => {
            handleCloseModal("isEditBankingDetails");
            setSelectedUserForAdd(null);
          }}
          userId={user}
          bankingDetailsId={bankingDetails[0].id}
          bankingDetails={bankingDetails[0]}
        />
      )}
      {modalState.isAddTransactionOpen && (
        <AddTransaction
          onClose={() => {
            handleCloseModal("isAddTransactionOpen");
            setSelectedUserForAdd(null);
          }}
          setTransactions={setTransactions}
          transactions={transactions}
          totalBalance={totalBalance}
          userId={user}
        />
      )}
      {modalState.isEditTransactionOpen && (
        <EditTransaction
          onClose={() => {
            handleCloseModal("isEditTransactionOpen");
            setSelectedUserForAdd(null);
          }}
          transactionId={transactions[0].id}
          selectedTransactions={transactions[0]}
          setTransactions={setTransactions}
          setIsEditing={setIsEditing}
          userId={user}
        />
      )}
      {modalState.isAddBondOpen && (
        <AddBond
          onClose={() => {
            handleCloseModal("isAddBondOpen");
            setSelectedUserForAdd(null);
          }}
          bonds={bondsHoldings}
          setBonds={setBondsHoldings}
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
          }}
          ipos={ipos}
          setIpos={setIpos}
          userId={user}
        />
      )}
      {/* 
      {isAddNewDocumentOpen && (
        <AddDocument
          onClose={() => {
            setIsAddNewDocumentOpen(false);
            setSelectedUserForAdd(null);
          }}
          document={document}
          setDocument={setDocument}
          userId={user}
        />
      )}  */}
    </div>
  );
};

export default UserOverview;
