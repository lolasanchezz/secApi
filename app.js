const express = require("express");
const path = require("path");
const app = express ();
const cors = require('cors');
var ParseXbrl = require('parse-xbrl');
const { hostname } = require("os");

app.use(cors());
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
   console.log(request.params.cid)
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

//https://data.sec.gov/api/xbrl/companyconcept/CIK0000812011/us-gaap/AccountsPayableCurrent.json


 app.get("/companyconcept/:cid/:unit/:datapoint" , (request, response) => {
  let rawResponseData;
  //api getting part
  
  const https = require('https'); // Import the https module
  const options1 = {
    hostname: 'data.sec.gov',
    path: `/api/xbrl/companyconcept/${request.params.cid}/${request.params.unit}/${request.params.datapoint}.json`,
    method: 'GET',
    headers: {
      'User-Agent': 'lola sanchez lsanchez@gcschool.org', 
    }
  };
  

  const reqSec = https.request(options1, (resp) => {
    let data = '';
    
    resp.on('data', (chunk) => {
        data += chunk;
    });



  
    resp.on('end', () => {
        try {
            console.log(data);
            response.send(data);
        } catch (error) {
            console.error('recieving data error:', error);
        }
    });
});

reqSec.on('error', (e) => {
    console.error('Request error:', e);
    response.status(500).send(`Problem with request: ${e.message}`);
});

reqSec.end();
});





// https://www.sec.gov/files/company_tickers.json
app.get("/cik/:cik" , (request, response) => {
 


1
  const options = {
    hostname: 'www.sec.gov',
    path: `/files/company_tickers.json`,
    method: 'GET',
    headers: {
      'User-Agent': 'lola sanchez, lsanchez@gcschool.org'
  }
};

const https = require('https');

const req = https.request(options, (resp) => {
  let rawResponseData;
  const dataArray = [];
  
  let data = '';
  let cikFound = false;
  let nameRequested = request.params.cik;
  let ii = 0;

  resp.on('data', (chunk) => {
      data += chunk;
  });




  resp.on('end', () => {
      try {
          
          
          


          rawResponseData = JSON.parse(data);
          

          //need to turn data into array'
          for (let i = 0; i < Object.keys(rawResponseData).length; i++) {
          let newArray = [i, rawResponseData[i].ticker];
          dataArray.push(newArray);
          }
          for (let i = 0; i < dataArray.length; i++) {
            let istr = i.toString();
            ii = i;
          if (dataArray[i][1] === (nameRequested.toUpperCase())) {
            let foundCIK = (rawResponseData[i].cik_str).toString();
            while (foundCIK.length < 10) {
            foundCIK = "0" + foundCIK;
            }
            let companyName = rawResponseData[i].title
            console.log([foundCIK, companyName])
            response.send([foundCIK, companyName]);
            
            cikFound = true;
            break;
            
          }
          
          };

          if (!(cikFound)) {
            response.status(404).send(
              "not found" );
        } 

         

      } catch (error) {
          console.error('recieving data error:', error);
      }
  });

});
req.on('error', (e) => {
  console.error('request error:', e);
  response.status(500).send(`problem: ${e.message}`);
});


req.end();


});

