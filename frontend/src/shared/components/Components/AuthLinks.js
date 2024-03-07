import React from 'react';

//Constants
import { layoutModeTypes } from "shared/constants";

const AuthLinks = ({ layoutMode, onChangeLayoutMode }) => {


  return (
    <div>
      <div className="ms-1 header-item d-none d-sm-flex">
        <button
          // onClick={() => onChangeLayoutMode(mode)}
          type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode">
          <i className='bx bx-user fs-22'></i> 
        </button>
        <button
          // onClick={() => onChangeLayoutMode(mode)}
          type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode">
          <i className='bx bx-user fs-22'></i>
        </button>
      </div>

    </div>
  );
};

export default AuthLinks;
