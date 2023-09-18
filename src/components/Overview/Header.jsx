import React from "react";
import { BiSortAlt2, BiSearch } from "react-icons/bi";
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
}) => {
  const handleSort = (event) => {
    const sortType = event.target.value;
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
      <h1 className="header_title">All Registered Users</h1>
      <div className="header__wrap">
        <div className="addRow_btn">
          <button onClick={() => setIsAdding(true)}>Add User</button>
        </div>
        <div className="search__field">
          <input
            type="text"
            placeholder="Search by email or name..."
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
          {/* <input type="search" name="search-bar" className="search__field" placeholder="Search for users..." /> */}
          <div className="sort">
            <button className="sort__button" onClick={isSortToggled}>
              Sort <BiSortAlt2 />
            </button>
            <div className={toggleSort ? "show__sort" : "sort__group"}>
              <div className="sort__item">
                <label htmlFor="location">Sort items:</label>
                <div className="items">
                  <div className="check__item">
                    {" "}
                    <input
                      type="checkbox"
                      className="sort__check"
                      value="name_ascend"
                      onChange={handleSort}
                    />
                    <p>
                      Name
                      <AiOutlineSortAscending />
                    </p>
                  </div>
                  <div className="check__item">
                    {" "}
                    <input
                      type="checkbox"
                      className="sort__check"
                      value="name_descend"
                      onChange={handleSort}
                    />
                    <p>
                      Name
                      <AiOutlineSortDescending />
                    </p>
                  </div>
                  <div className="check__item">
                    {" "}
                    <input
                      type="checkbox"
                      className="sort__check"
                      value="email_ascend"
                      onChange={handleSort}
                    />
                    <p>
                      Email
                      <AiOutlineSortAscending />
                    </p>
                  </div>
                  <div className="check__item">
                    {" "}
                    <input
                      type="checkbox"
                      className="sort__check"
                      value="email_descend"
                      onChange={handleSort}
                    />
                    <p>
                      Email
                      <AiOutlineSortDescending />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header__right"></div>
      </div>
    </header>
  );
};

export default Header;
