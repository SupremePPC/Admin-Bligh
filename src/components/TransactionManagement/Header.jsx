import React from "react";
import { BiSearch, BiSortAlt2 } from "react-icons/bi";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

const Header = ({
  setIsAdding,
  isSortToggled,
  toggleSort,
  onSort,
  handleSearch,
  searchQuery,
  setSearchQuery,
  statusFilter,
  handleFilter,
}) => {
  const handleSort = (event) => {
    const sortType = event.target.value; // e.g., 'userName_ascend'
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
      <h1 className="header_title">Transactions Dashboard</h1>
      <div className="header__wrap">
      <div className="addRow_btn">
        <button onClick={() => setIsAdding(true)}>Add Transaction</button>
      </div>
        <div className="search__field">
          <input
            type="text"
            placeholder="Search by name..."
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
                <label htmlFor="location">Sort items:</label>
                <div className="items">
                  <div className="check__item">
                    <input
                      type="checkbox"
                      className="sort__check"
                      value="userName_ascend"
                      onChange={handleSort}
                    />
                    <p>
                      Name <AiOutlineSortAscending />
                    </p>
                  </div>
                  <div className="check__item">
                    <input
                      type="checkbox"
                      className="sort__check"
                      value="userName_descend"
                      onChange={handleSort}
                    />
                    <p>
                      Name <AiOutlineSortDescending />
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
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;