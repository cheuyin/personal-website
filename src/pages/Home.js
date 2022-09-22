import React from "react";
import { LinkedIn, Email, GitHub } from "@material-ui/icons";

function Home() {
	return (
		<div className="home">
			<div className="about">
				<h2>Hi, My name is Pedro</h2>
				<p>Software engineer at The University of British Columbia</p>
				<LinkedIn />
				<Email />
				<GitHub />
			</div>
			<div className="skills">
				<h1>Skills</h1>
				<ol className="list">
					<li className="item">
						<h2>Frontend</h2>
						<span>
							ReactJS, Angular, Redux, HTML, CSS, React Native, Flutter, NPM,
							Ionic, BootStrap, MaterialUI, Yarn, TailwindCSS, StyledComponents
						</span>
					</li>
					<li className="item">
						<h2>Backend</h2>
						<span>
							NodeJS, Java Spring, .NET, ExpressJS, GraphQL, ApolloServer,
							MySQL, MongoDB, DynamoDB, DigitalOcean, AWS S3, MS SQL
						</span>
					</li>
					<li className="item">
						<h2>Languages</h2>
						<span></span>
					</li>
				</ol>
			</div>
		</div>
	);
}

export default Home;
