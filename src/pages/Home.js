import React from "react";
import { LinkedIn, Email, GitHub } from "@material-ui/icons";
import "../styles/Home.css";

function Home() {
	return (
		<div className="home">
			<div className="about">
				<h2>Hi, My name is Stanley</h2>
				<p className="prompt">
					Software engineer at The University of British Columbia
				</p>
				<address className="icons">
					<a href="https://www.linkedin.com/in/yinstanleycheung/" target="_blank" rel="noreferrer"><LinkedIn /></a>
					<a href="mailto: yinstanleycheung@gmail.com"><Email /></a>
					<a href="https://github.com/cheuyin" target="_blank" rel="noreferrer"><GitHub /></a>
				</address>
			</div>
			<div className="skills">
				<h1>Skills</h1>
				<ol className="list">
					<li className="item">
						<h2>Frontend</h2>
						<span>
							ReactJS, HTML, CSS, MaterialUI
						</span>
					</li>
					<li className="item">
						<h2>Backend</h2>
						<span>
							NodeJS, ExpressJS, MongoDB
						</span>
					</li>
					<li className="item">
						<h2>Languages</h2>
						<span>JavaScript, Python</span>
					</li>
				</ol>
			</div>
		</div>
	);
}

export default Home;
