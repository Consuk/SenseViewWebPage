import React, { useState, useEffect } from "react";
import Dropdown from "./DropDown";
import NavbarToggle from "./NavBarToggle";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../../LanguageContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
  const { t } = useLanguage(); // Translate
  const location = useLocation(); // Obtener la ubicación actual
  const navigate = useNavigate(); // Navegación con react-router

  const isActive = (path) => location.pathname === path;

  const solutionItems = [
    { label: t("services"), icon: "/01-NavBar/senseview_isotype.png", path: "/services" },
    { label: t("industrialVariables"), icon: "/01-NavBar/troubleshoot.png", isIndented: true, path: "/services/industrial-variables" },
    { label: t("productionMetrics"), icon: "/01-NavBar/leaderboard.png", isIndented: true, path: "/services/production-metrics" },
    { label: t("howItWorks"), icon: "/01-NavBar/emoji_objects.png", path: "/how-it-works" },
    { label: t("devices"), icon: "/01-NavBar/memory.png", path: "/devices" },
    { label: t("dataMetrics"), icon: "/01-NavBar/dashboard_customize.png", path: "/data-metrics" },
  ];

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar clics fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-solutions") && isSolutionsDropdownOpen) {
        setIsSolutionsDropdownOpen(false);
      }
      if (!event.target.closest(".language-selector") && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSolutionsDropdownOpen, isLanguageDropdownOpen]);

  // Detectar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth <= 796;
      setIsMobile(isCurrentlyMobile);

      if (!isCurrentlyMobile) {
        setIsMenuOpen(false);
        setIsSolutionsDropdownOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cerrar menú al cambiar de ruta y desplazarse al inicio
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSolutionsDropdownOpen(false);
    window.scrollTo(0, 0); // Mover al inicio de la página
  }, [location]);

  const toggleSolutionsDropdown = () =>
    setIsSolutionsDropdownOpen(!isSolutionsDropdownOpen);

  const toggleLanguageDropdown = () =>
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setIsSolutionsDropdownOpen(false);
  };

  const handleSolutionClick = (path) => {
    setIsSolutionsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate(path); // Navegar usando react-router
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <img src="/01-NavBar/Original.svg" alt="Sense View Logo" />
        </Link>
      </div>
      <div className={`navbar-links ${isMenuOpen || !isMobile ? "open" : ""}`}>
        <ul className="navbar-menu">
          <li>
            <Dropdown
              isOpen={isSolutionsDropdownOpen}
              toggleDropdown={toggleSolutionsDropdown}
              label={t("solutions")}
              items={solutionItems.map((item) => ({
                ...item,
                onClick: () => handleSolutionClick(item.path), // Redirigir y cerrar el menú
              }))}
              isMenuOpen={isMenuOpen}
            />
          </li>
          <li className={isActive("/pricing") ? "active" : ""}>
            <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
              {t("pricing")}
            </Link>
          </li>
          <li className={isActive("/faq") ? "active" : ""}>
            <Link to="/faq" onClick={() => setIsMenuOpen(false)}>
              {t("faq")}
            </Link>
          </li>
          <li className={isActive("/contact") ? "active" : ""}>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
              {t("contact")}
            </Link>
          </li>
          <li className={isActive("/about") ? "active" : ""}>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              {t("aboutUs")}
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-actions">
        <LanguageSelector
          isOpen={isLanguageDropdownOpen}
          toggleLanguageDropdown={toggleLanguageDropdown}
          languages={[
            { label: t("spanish"), icon: "/01-NavBar/language_spanish.png", code: "es" },
            { label: t("english"), icon: "/01-NavBar/language_us.png", code: "en" },
          ]}
        />
        <button className="login-button-nav" onClick={() => navigate("/login")}>
          {t("login")}
          <img src="/01-NavBar/login.svg" alt="Log in button" />
        </button>
      </div>
      <NavbarToggle onClick={toggleMenu} isOpen={isMenuOpen} />
    </nav>
  );
}

export default Navbar;
