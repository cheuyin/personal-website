import React from "react";
import { Instagram, Twitter, Facebook, LinkedIn } from "@material-ui/icons/";
import "../styles/Footer.css";

function Footer() {
	return (
		<div className="footer">
			<div className="socialMedia">
				<Instagram />
				<Twitter />
				<Facebook />
				<LinkedIn />
			</div>
			<p> &copy; 2022 cheungstanley.com</p>
		</div>
	);
}

export default Footer;
