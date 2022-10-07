import React from "react";
import { LinkedIn, Email, GitHub } from "@material-ui/icons";
import "../styles/Footer.css";

function Footer() {
	return (
		<div className="footer">
			<div className="socialMedia">
				<address>
					<a
						href="https://www.linkedin.com/in/yinstanleycheung/"
						target="_blank"
						rel="noreferrer"
					>
						<LinkedIn />
					</a>
					<a href="mailto: yinstanleycheung@gmail.com">
						<Email />
					</a>
					<a href="https://github.com/cheuyin" target="_blank" rel="noreferrer">
						<GitHub />
					</a>
				</address>
			</div>
			<p> &copy; 2022 cheungstanley.com</p>
		</div>
	);
}

export default Footer;
