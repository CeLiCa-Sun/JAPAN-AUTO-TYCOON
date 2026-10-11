import {readFileSync,writeFileSync} from "node:fs";

const sha=process.argv[2];
if(!sha||!/^[a-f0-9]{40}$/.test(sha))throw new Error("Expected full 40-character Git commit SHA");
const file="dist/index.html";
const html=readFileSync(file,"utf8");
if(!html.includes("</head>")||html.includes('name="jat-release-sha"'))throw new Error("Invalid or already stamped Pages HTML");
const marker=`<meta name="jat-release-sha" content="${sha}">`;
writeFileSync(file,html.replace("</head>",marker+"</head>"));
console.log("Pages HTML stamped for commit "+sha);
