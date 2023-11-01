import React from "react";
import { BiSearch, BiSortAlt2 } from "react-icons/bi";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

const Header = ({
  isSortToggled,
  toggleSort,
  onSort,
  handleSearch,
  searchQuery,
  setSearchQuery,
  statusFilter,
  handleFilter,
  cashDeposits,
}) => {
  const handleSort = (event) => {
    const sortType = event.target.value; // e.g., 'type_ascend'
    onSort(sortType);

    // Uncheck other checkboxes to ensure only one is active at a time
    document.querySelectorAll(".sort__check").forEach((checkbox) => {
      if (checkbox !== event.target) {
        checkbox.checked = false;
      }
    });
  };

  return (
    <header>
      <h1 className="header_title">Cash Deposits Dashboard</h1>
      {cashDeposits.length > 0 && (
        <>
          <div className="header__wrap">
            <div className="search__field">
              <input
                type="text"
                placeholder="Search by type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>
                <BiSearch />
              </button>
            </div>
          </div>
          <div className="header__wrap">
            <div className="header__left">
              <div className="sort">
                <button className="sort__button" onClick={toggleSort}>
                  Sort <BiSortAlt2 />
                </button>
                <div className={isSortToggled ? "show__sort" : "sort__group"}>
                  <div className="sort__item">
                    <label htmlFor="type">Sort items:</label>
                    <div className="items">
                      <div className="check__item">
                        <input
                          type="checkbox"
                          className="sort__check"
                          value="type_ascend"
                          onChange={handleSort}
                        />
                        <p>
                          Type <AiOutlineSortAscending />
                        </p>
                      </div>
                      <div className="check__item">
                        <input
                          type="checkbox"
                          className="sort__check"
                          value="type_descend"
                          onChange={handleSort}
                        />
                        <p>
                          Type <AiOutlineSortDescending />
                        </p>
                      </div>
                      <div className="check__item">
                        <input
                          type="checkbox"
                          className="sort__check"
                          value="date_ascend"
                          onChange={handleSort}
                        />
                        <p>
                          Date <AiOutlineSortAscending />
                        </p>
                      </div>
                      <div className="check__item">
                        <input
                          type="checkbox"
                          className="sort__check"
                          value="date_descend"
                          onChange={handleSort}
                        />
                        <p>
                          Date <AiOutlineSortDescending />
                        </p>
                      </div>
                      <div className="check__item">
                        <input
                          type="checkbox"
                          className="sort__check"
                          value="amount_ascend"
                          onChange={handleSort}
                        />
                        <p>
                          Amount <AiOutlineSortAscending />
                        </p>
                      </div>
                      <div className="check__item">
                        <input
                          type="checkbox"
                          className="sort__check"
                          value="amount_descend"
                          onChange={handleSort}
                        />
                        <p>
                          Amount <AiOutlineSortDescending />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="header__right">
              <div className="filter">
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => handleFilter(e.target.value)}
                  className="filter__button"
                >
                  <option value="All">Filter (All) </option>
                  <option value="Pending">Pending</option>
                  <option value="Cleared">Cleared</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
