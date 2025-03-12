
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Diagnostics() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // If we're on exactly /diagnostics, redirect to diagnostics-overview
    if (location.pathname === "/diagnostics") {
      navigate("/diagnostics-overview");
    }
  }, [location.pathname, navigate]);

  return null; // This component just handles redirection
}
