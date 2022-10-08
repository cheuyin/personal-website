import React from "react";
import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import UBCIcon from "../assets/ubc-logo.png";
import "../styles/Experience.css";

function Experience() {
	return (
		<div className="experience">
			<VerticalTimeline lineColor="#3e497a">
				<VerticalTimelineElement
					className="vertical-timeline-element--education"
					date="2022 - 2026"
					iconStyle={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						background: "white",
						boxShadow:
							"0 0 0 4px rgb(62, 73, 122), inset 0 2px 0 rgba(62, 73, 122, 0.8), 0 3px 0 4px rgba(62, 73, 122, 0.5)",
					}}
					icon={
						<img
							src={UBCIcon}
							alt="UBC logo"
							style={{ marginTop: "5px", width: "50%", height: "auto" }}
						></img>
					}
				>
					<h3 className="vertical-timeline-element--title">
						The University of British Columbia, Vancouver, Canada
					</h3>
					<p>B.Sc, Honours in Computer Science (intended)</p>
				</VerticalTimelineElement>
			</VerticalTimeline>
		</div>
	);
}

export default Experience;
