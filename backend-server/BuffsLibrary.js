
const available =  [{
  type: "buff",
  title: "Programmer Analyst",
  company: "Vertere",
  details: "U go mor vrroom vroommm",
  segments: [
    "Design systems or applications based on Client requirements and develop these programs based on design and requirements specifications",
    "Debug, test APIs and end points, then conduct review of technical work outputs",
    "Assisted fellow peers on their coding tasks. As well as participated daily in Client and Internal scrum meetings",
    "Held discussions with Client to have a clearer understing and insight for the project requirements to set expectations and reduce errors"
  ]
  // icon: "web",
}, {
  type: "buff",
  title: "Technology Consultant",
  company: "DXC",
  details: "U go mor vrroom vroommm",
  segments: [
    "Developed apps from scratch and concept based on user requirements, these were created into functional prototypes and templates from wireframe and mock-ups. Also joined in Design Thinking Trainings",
    "Experienced Full Stack App Development with the help of Android SDK and connected applications to back-end services with RESTful Web Services",
    "Delivered front-end development tasks using Angular, HTML and CSS",
    "Developed apps (Web and Native) optimized for any resolution of desktop and mobile devices. Collaborated closely with the QA for bug fixes/issues for Rapid Development, and the product owner and designer to achieve better UI/UX while in an Agile environment with the help of tools such as JIRA and GIT Version Control",
  ]
  // icon: "web",
}, {
  type: "buff",
  title: "Application Systems Developer",
  company: "Fujitsu",
  details: "U go mor vrroom vroommm",
  segments: [
    "Develop as well as create test specifications and execute testing, Bug fixing, Enhancements, and Handling Change Requests",
    "Contributed ideas and suggestions in team meetings and delivered updates on deadlines, designs and improvements",
    "Coded while helping fellow developers by maintaining readable, testable, and scalable source code that adheres to clean code principles and best practices"
  ]
  // icon: "mobile",
},
{
  type: "buff",
  title: "Quality Assurance Specialist",
  company: "Smart Communications",
  details: "U go mor vrroom vroommm",
  segments: [
    "Worked alongside Developers to report bug findings. Created complete and proper documentations of testing with test scripts, cases, and validate data using MS SQL"
  ]
  // icon: "mobile",
}]




const available2 =  [{
  type: "buff",
  title: "ergserg",
  company: "RGRGERGre",
  details: "U go mor vrroom vroommm",
  segments: [
    "Design systems or applications based on Client requirements and develop these programs based on design and requirements specifications",
    "Debug, test APIs and end points, then conduct review of technical work outputs",
    "Assisted fellow peers on their coding tasks. As well as participated daily in Client and Internal scrum meetings",
    "Held discussions with Client to have a clearer understing and insight for the project requirements to set expectations and reduce errors"
  ]
  // icon: "web",
}, {
  type: "buff",
  title: "gfgdg",
  company: "EFSEFSFES",
  details: "U go mor vrroom vroommm",
  segments: [
    "Developed apps from scratch and concept based on user requirements, these were created into functional prototypes and templates from wireframe and mock-ups. Also joined in Design Thinking Trainings",
    "Experienced Full Stack App Development with the help of Android SDK and connected applications to back-end services with RESTful Web Services",
    "Delivered front-end development tasks using Angular, HTML and CSS",
    "Developed apps (Web and Native) optimized for any resolution of desktop and mobile devices. Collaborated closely with the QA for bug fixes/issues for Rapid Development, and the product owner and designer to achieve better UI/UX while in an Agile environment with the help of tools such as JIRA and GIT Version Control",
  ]
  // icon: "web",
}, {
  type: "buff",
  title: "gresgrsg",
  company: "ESFHRWRH",
  details: "U go mor vrroom vroommm",
  segments: [
    "Develop as well as create test specifications and execute testing, Bug fixing, Enhancements, and Handling Change Requests",
    "Contributed ideas and suggestions in team meetings and delivered updates on deadlines, designs and improvements",
    "Coded while helping fellow developers by maintaining readable, testable, and scalable source code that adheres to clean code principles and best practices"
  ]
  // icon: "mobile",
},
{
  type: "buff",
  title: "grrthjrstjs",
  company: "HRSSRG",
  details: "U go mor vrroom vroommm",
  segments: [
    "Worked alongside Developers to report bug findings. Created complete and proper documentations of testing with test scripts, cases, and validate data using MS SQL"
  ]
  // icon: "mobile",
}]



const apply = (player, buff) => {

  if (buff === "Vertere") {

    player.snowballStats.rate = 10;
  }

  if (buff === "DXC") {

    player.snowballStats.speed = 20;

  }

}


module.exports = { available, available2, apply };