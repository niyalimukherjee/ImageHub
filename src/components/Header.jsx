import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Search, Notifications, AccountCircle, Menu as MenuIcon } from "@mui/icons-material";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Update search query on input change
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Handle pressing Enter or triggering search
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        handleMenuClose();
      }
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-800">Image~Hub</span>
        </Link>

        {/* Search bar - hidden on small screens
        <div className="hidden sm:flex flex-1 max-w-xl">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full">
            <Search className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search images"
              className="w-full bg-transparent focus:outline-none text-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div> */}

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <IconButton>
            <Notifications />
          </IconButton>
          <Link to="/profile">
            <IconButton>
              <AccountCircle />
            </IconButton>
          </Link>
        </div>

        {/* Hamburger menu for small screens */}
        <div className="sm:hidden">
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {/* Search inside dropdown */}
            <MenuItem disableRipple>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-full">
                <Search className="text-gray-500 mr-2" fontSize="small" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent focus:outline-none text-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchSubmit}
                />
              </div>
            </MenuItem>

            {/* Notifications */}
            <MenuItem onClick={handleMenuClose}>
              <Notifications className="mr-2" fontSize="small" /> Notifications
            </MenuItem>

            {/* Profile */}
            <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
              <AccountCircle className="mr-2" fontSize="small" /> Profile
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}
