import React from 'react';

interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
}

export const Header: React.FC<HeaderProps> = ({
    logoSrc = "../public/assets/img/logo__small@2x.png",
    logoAlt = 'volver a Mercado Libre',
}) => {
  return (
    <header className="nav-header">
      <div className="nav-container">
        <div className="nav-logo">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="nav-logo-img"
          />
        </div>
      </div>
    </header>
  );
};