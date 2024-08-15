import React, { ChangeEvent, ReactNode, useState } from "react";

const SideBar = ({ currentUsers }) => {
  const items = ["Friends", "College", "Home"];
  const [searchItem, setSearchItem] = useState(items);
  // debugger;
  // console.log(currentUsers);
  // console.log(currentUsers[0].username);

  const handleChange = (e) => {
    console.log(e.target.value);
  };
  return (
    <aside className="bg-primary hidden sm:block sm:flex flex-col text-white">
      <div id="title" className=" text-xl font-medium p-2 ">
        <p>Chat</p>
      </div>
      <ul className="grow">
        <li className="px-2 py-2">
          <input
            type="text"
            placeholder="Search..."
            className="rounded-full w-full px-3"
            onChange={handleChange}
          />
        </li>
        {searchItem.map((item, index) => {
          return (
            <li key={index} className="hover:bg-primaryHover">
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group"
              >
                <svg
                  className="w-5 h-5 transition duration-75 dark:text-gray-400  "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">{item}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="font-medium pl-2">Users Online:</p>
      <div className="shrink overflow-auto mb-14 basis-1/5 ">
        <ul className="overflow-auto">
          {items.map((user, index) => {
            return (
              <li key={index} className="pl-2 hover:bg-primaryHover">
                hiiii
                {/* {console.log(user.username)} */}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
