import React from 'react'

export default function List({ bonds, handleDelete, isEditPageOpen}) {
  return (
    <div className='small-container'>
      <div className="bonds-container">
              {bonds.map((bond) => (
                <div className="bond-card" key={bond.id}>
                  <h2>{bond.issuerName}</h2>
                  <p>Ticker: {bond.ticker}</p>
                  <p>Coupon: {bond.coupon}</p>
                  {/* Add other bond details here */}
                  <button onClick={() => handleDelete(bond.id)}>Delete</button>
                </div>
              ))}
            </div>
    </div>
  )
}
