import React from "react";
import { BiSearch } from "react-icons/bi";

const Header = ({searchQuery, handleSearch, setSearchQuery}) => {
  return (
    <header>
      <h1 className="header_title">Bonds Requests</h1>
      <div class="header__wrap">
        <div class="addRow_btn">
          {/* <button>Add User</button> */}
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
    </header>
  );
};

export default Header;
