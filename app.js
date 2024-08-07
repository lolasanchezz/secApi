const express = require("express");
const path = require("path");
const app = express ();

app.use(express.json());
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });



  app.get("/status", (request, response) => {
    const status = {
       "Status": "Running",
    };
    



    
    response.send(status);
 });








 app.get("/companyFacts/:cid" , (request, response) => {
   let rawResponseData;
   //api getting part
   
   const https = require('https'); // Import the https module
   const options1 = {
     hostname: 'data.sec.gov',
     path: "https://data.sec.gov/api/xbrl/companyfacts/" + request.params.cid + ".json",
     method: 'GET',
     headers: {
       'User-Agent': 'lola sanchez lsanchez@gcschool.org', // Replace with your contact info // If authentication is needed, replace with your actual token
     }
   };
   

   const reqSec = https.request(options1, (resp) => {
       let data = '';
     
       // A chunk of data has been received. Append it to `data`.
       resp.on('data', (chunk) => {
         data += chunk;
       });
      
       // The whole response has been received. Parse the XML data.
       resp.on('end', () => {
        
        rawResponseData = (JSON.parse(data));
        const responseData = {
         "dataReturned": rawResponseData
        };
        response.send(rawResponseData);
        
       });
     
     });
     
     // Handle errors
     
     
     reqSec.end();
     

   
     
 });

 app.get("/companyconcept/:cid/:concept" , (request, response) => {
   let responseConceptData;
   const options = {
      hostname: 'data.sec.gov',
      path: "api/xbrl/companyconcept/CIK0000812011/us-gaap/DividendsCash.json",
      method: 'GET',
      headers: {
        'User-Agent': 'lola sanchez lsanchez@gcschool.org'
   }
   };
   const req = https.request(options, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
         data += chunk;
      });
      resp.on('end', () => {
         responseConceptData = JSON.parse(data);
         const responseData = {
            "dataReturned": responseConceptData
         };
         response.send(responseData);
      });
   });
   req.end();
 });