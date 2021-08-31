// import { response } from "express";
// import { fetch } from "fetch-h2";

// //determine whether the sentiment of text is positive
// //use a web service

// async function isPositive(text: string): Promise-boolean> {
//     const response = await fetch("http://text-processing.com/api/sentiment/", {
//         method: "POST",
//         body: `text=${text}`,
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//     }),
//     const json = await response.json();
//     return json.label === "pos";
// }