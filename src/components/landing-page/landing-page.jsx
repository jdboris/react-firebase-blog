import { useRef } from "react";
import css from "./landing-page.module.scss";
import { FaChevronDown } from "react-icons/fa";

export function LandingPage({ theme, useSettings }) {
  const { business, homeBackground } = useSettings();
  const landingPage = useRef();

  return (
    // landingPage && (
    <div ref={landingPage} className={css.landingPage}>
      <div
        data-slogan={business && business.slogan ? business.slogan : ""}
        style={
          homeBackground && { backgroundImage: `url('${homeBackground.url}')` }
        }
      >
        <button
          className={theme.buttonAlt}
          onClick={() => {
            landingPage.current.nextSibling.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <FaChevronDown />
        </button>
      </div>
    </div>
    // )
  );
}
