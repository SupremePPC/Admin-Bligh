import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { db } from "../../firebaseConfig/firebase";
import { Link } from "react-router-dom";
import AddTransaction from "./AddTransaction";

const UserOverview = () => {
  const user = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [accountTypes, setAccountTypes] = useState([]);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [bondsHoldings, setBondsHoldings] = useState([]);
  const [bondsRequest, setBondsRequest] = useState([]);
  const [docs, setDocs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedUserForAdd, setSelectedUserForAdd] = useState(null);
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);

  const handleAdd = () => {
    setIsAddPageOpen(true);
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
      fetchSubCollection("bondsRequest", setBondsRequest);
      fetchSubCollection("docs", setDocs);
      fetchSubCollection("transactions", setTransactions);
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

  return (
    <div className="container">
      {
        !isAddPageOpen && (
      <div className="userOverview_container">
        {/* <h1>Overview {user ? user.userId : "User ID Missing"} </h1> */}
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
          </div>
        )}

        {bankingDetails.map((item) => (
          <div className="user_details" key={item.id}>
            <h3>Banking Details</h3>
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
        ))}

        <div className="user_details">
          <h3>Account Types and Balance</h3>
          {accountTypes.length === 0 ? (
            <p className="bold_text">
              This user has no account or balance at the moment.
            </p>
          ) : (
            <ul className="dropdown_col">
              {accountTypes.map((item) => (
                <li key={item.id} className="dropdown_row">
                  <p className="bold_text">{item.type} :</p>
                  <span className="reg_text">$ {item.balance} </span>
                </li>
              ))}
            </ul>
          )}
          <div className="dropdown_row">
            <p className="bold_text">Total Balance :</p>
            <span className="reg_text">$ {totalBalance}</span>
          </div>
        </div>

        <div className="user_details">
          <h3>Bonds Holdings</h3>
          {bondsHoldings.length === 0 ? (
            <p className="bold_text">This user holds no bonds at the moment.</p>
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
                <div className="user_wrap">
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
        </div>

        <div className="user_details">
          <h3>Document</h3>
          {docs.length === 0 ? (
            <p className="bold_text">No document has been added yet.</p>
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
              </div>
            ))
          )}
        </div>

        <div className="user_details">
          <h3>Transaction List</h3>
          {transactions.length === 0 ? (
            <p className="bold_text">
              No Transaction has been carried out yet.
            </p>
          ) : (
            <>
              <ul className="dropdown_col">
                {transactions.map((transaction) => (
                  <li className="dropdown_row" key={transaction.id}>
                    <p className="bold_text">{transaction.type} :</p>
                    <span className="reg_text">$ {transaction.amount} </span>
                  </li>
                ))}
              </ul>
              <div className="dropdown_btn">
                <button onClick={handleAdd}>Add Transaction</button>
              </div>
            </>
          )}
        </div>
      </div>

        )
      }
          {isAddPageOpen && (
            <AddTransaction
              onClose={() => {
                setIsAddPageOpen(false);
                setSelectedUserForAdd(null);
              }}
              transactions={transactions}
              setTransactions={setTransactions}
              userId={user}
              totalBalance={totalBalance}
            />
          )}
    </div>
  );
};

export default UserOverview;
