var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2")
var app=express();

app.listen(2099,function()
{
    console.log("Server has started on PORT: 2099.");
})

app.use(express.static("public"));
app.use(fileuploader());

app.get("/",function(req,resp)
{
      resp.sendFile(process.cwd()+"/public/index2.html");
});

app.use(express.urlencoded(true));

var CCC={

    host:"127.0.0.7",
    user:"root",
    password:"Bhavish@2010",
    database:"CommunityCare",
    dateStrings:true
}

var Signin=mysql.createConnection(CCC)
Signin.connect(function(flag)
{
    if(flag==null)
    {
        console.log("Connected successfully to database...!!!");
    }
    else{
        console.log("ye error aarhi hai:---");
        console.log(flag);
    }
})
app.get("/HomePage", function(req, resp) {
    resp.sendFile(process.cwd() + "/public/index2.html");
})

app.use(express.urlencoded({ extended: true }));

app.get("/Signup-kro",function(req,resp)
{
    const email = req.query.email;
const password = req.query.password;
const type = req.query.MemType;

if (!email) {
  resp.send("Email is required.");
  return;
}

Signin.query(
  "INSERT INTO accounts (email, password, MemType, dos, Ustatus) VALUES (?, ?, ?, CURDATE(), 1)",
  [email, password, type],
  function(err) {
    if (err === null) {
      resp.send("Account signed up successfully!");
    } else {
      resp.send("Error occurred: " + err);
    }
  }
);



})
//----------------------Checking ------------------------------
app.get("/chk-email",function(req,resp)
{

    var r=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    Signin.query("select * from accounts where email=?",[req.query.kuchEmail],function(err,resultTable)
    {
        if(err==null)
        {
            if(resultTable.length==1)
            {
                resp.send("Already exist.");
               // status=0;
            }
            else if(req.query.kuchEmail=="")
            {
                resp.send("Please enter an email id.");
            }
            else if(r.test(req.query.kuchEmail)==false)
            {
                resp.send("Email Invalid.");
            }
            else
                resp.send("Available...!!!");  
                //status=1;  
        }
        else
        resp.send(err);
    })
})


//------------------------LOGIN------------------------------
app.get("/loginuser",function(req,resp){
    var email=req.query.kuchEmailL;
    var password=req.query.kuchpwdL;

    //admin email & password othentication

    if(email=="Admin420@gmail.com" && password=="Admin420")
    {
        resp.send("Admin Aya hai");
    }
    else
   {
    Signin.query("select MemType,Ustatus from accounts where email=? and password=?",[email,password],function(err,resultTable){
      if(err==null)
      {
        if(resultTable.length==1)
          {
            if(resultTable[0].Ustatus==1)
                  resp.send(resultTable[0].MemType);
            else
                 resp.send("Blocked by the server.");
          }
          else
            resp.send("Invalid User Id/Password");
  
      }
    else{ 
      resp.send(err.toString());
    }
    })
}

  })


//===================================DONAR Profile Set-up==========================================

//----------------------Checking profile details ------------------------------
app.get("/chk-email2",function(req,resp)
{

    var r=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    Signin.query("select * from prof_donar where email=?",[req.query.kuchEmail],function(err,resultTable)
    {
        if(err==null)
        {
            if(resultTable.length==1)
            {
                resp.send("Already exist.");
               // status=0;
            }
            else if(req.query.kuchEmail=="")
            {
                resp.send("Please enter an email id.");
            }
            else if(r.test(req.query.kuchEmail)==false)
            {
                resp.send("Email Invalid.");
            }
            else
                resp.send(": You can fill your details.");  
                //status=1;  
        }
        else
        resp.send(err);
    })
})

app.get("/profile",function(req,resp)
{
    resp.sendFile(process.cwd()+"/public/profile_donar.html");
})
app.use(express.urlencoded({ extended: true }));

// var setProfile= mysql.createConnection(CCC);
// //var dbCon2=mysql.createConnection(dbConfig);
//  setProfile.connect(function(jasoos2)
//  {
//     if(jasoos2==null)
//     {
//         console.log("CONNECTION READY TO PROFILE SETTINGS!");
//     }
//     else
//     {
//         console.log(jasoos2);
//     }
//  })
 //--------------------------------------------------
 //                   details saved
app.post("/profile-Sign-up-process",function(req,resp)
 {
    //-------file uploading-------
    var fileName2="nopic.jpg";
    if(req.files!=null)  //---------------might have an error
    {
        fileName2=req.files.ppic2.name;
        var path=process.cwd()+"/public/uploads/"+fileName2;
        req.files.ppic2.mv(path);
    }
    console.log(req.body);


    //SAVING THE TABLE DATA
    var email=req.body.ProEmail;
    var name=req.body.ProName;
    var Address=req.body.ProAdd;
    var Contact=req.body.ProPhone;
    var id=req.body.ProID;
    var city=req.body.ProCity;
    var availhrs = req.body.timing1 + " to " + req.body.timing2;

    

    Signin.query("insert into prof_donar(email,name,Contact,Address,City,ID,ID_proof,Availhrs) values(?,?,?,?,?,?,?,?)",[email,name,Contact,Address,city,id,fileName2,availhrs],function(err)
    {
        if(err==null)
        {
            resp.send("Data Saved successfully!!");
        }
        else
        {
            resp.send(err);
        }
    })

 })
 //-----------------------------------------------------------------------
 //                SEARCH 
 app.get("/do-search",function(req,resp){
    Signin.query("select * from prof_donar where email=?",[req.query.kuchEmail],function(err,resultTableJSON){
      if(err==null)
      resp.send(resultTableJSON);
      else
      resp.send(err);
    })
  })
 //------------------------------------------------------------------------
 //                 DELETE
 app.post("/Delete-Account",function(req,resp)
 {
    //saving data in table
    var email=req.body.ProEmail;

    //fixed
    Signin.query("delete from prof_donar where email=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
                resp.send("Account Removed Successsfulllyy!");
            else
                resp.send("Invalid Email id");
        }
        else
        resp.send(err);
    })
 })
 //--------------------------------------------------------------
 //                  UPDATE
 app.post("/Update-Account",function(req,resp)
 {
    //-------file uploading-------
    var fileName2="nopic.jpg";
    if(req.files!=null)  //---------------might have an error
    {
        fileName2=req.files.ppic2.name;
        var path=process.cwd()+"/public/uploads/"+fileName2;
        req.files.ppic2.mv(path);
    }
    console.log(req.body);


    //saving data in table
    var email=req.body.ProEmail;
    var name=req.body.ProName;
    var Address=req.body.ProAdd;
    var Contact=req.body.ProPhone;
    var id=req.body.ProID;
    var city=req.body.ProCity;
    var availhrs = req.body.timing1 + " to " + req.body.timing2;

    //fixed
    Signin.query("update prof_donar set name=?, Contact=?, Address=?, City=?, ID=?, ID_proof=?, Availhrs=? where email=?",[name, Contact, Address, city, id, fileName2,availhrs,email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
                resp.send("Account Updated Successsfulllyy!");
            else
                resp.send("Invalid Email id");
        }
        else
        resp.send(err);
    })
 })





 //===================================AVAILABLE MEDICINE DETAILS================================================================
 app.get("/Avail_meds", function(req, resp) {
    resp.sendFile(process.cwd() + "/public/Avail_meds.html");
})
app.use(express.urlencoded({ extended: true }));

//  var Availmeds=mysql.createConnection(CCC);
//  Availmeds.connect(function(jasoos3){
//     if(jasoos3==null)
//     {
//         //console.log(alert("All CLear."));
//         console.log("CONNECTTED medicine wala SUCCESFULLY.");
//     }
//     else
//     console.log(jasoos3);
//  })
 
 app.get("/insert-data", function(req, resp) 
 {
    
    console.log(req.query);

    

    Signin.query("INSERT INTO Med_details (serial_no, email, Med_name, Exp_date, Packaging, Quantity) VALUES (?, ?, ?, ?, ?, ?)",[0, req.query.email_val, req.query.Med_name_val, req.query.Exp_dt_val, req.query.pack_type_val, req.query.qty_val],
        function(err) 
    {
            if(err==null)
                        resp.send("Thanks");
            else
                {
                        //console.log(err) ; 
                        resp.send(err);
                }
        
    })
 })
 /*app.get("/insert-data", function(req, resp) {
    console.log(req.query);

    var dateParts = req.query.Exp_dt_val.split("/"); // Assuming the date format is "MM/DD/YYYY"
    var formattedDate = dateParts[2] + "-" + dateParts[0] + "-" + dateParts[1];

    Availmeds.query("INSERT INTO Med_details (serial_no, email, Med_name, Exp_date, Packaging, Quantity) VALUES (?, ?, ?, ?, ?, ?)",[0, req.query.email_val, req.query.Med_name_val, formattedDate, req.query.pack_type_val, req.query.qty_val],function(err) {
            if (err == null)
                resp.send("Thanks");
            else {
                resp.send(err);
            }
        });
});*/

//============================================================================================================

//=====================================NEEDY PROFILE  Set-up==================================================

app.get("/profile2",function(req,resp)
{
    resp.sendFile(process.cwd()+"/public/profile_recipient.html");
})
app.use(express.urlencoded({ extended: true }));

// var setProfile= mysql.createConnection(CCC);
// //var dbCon2=mysql.createConnection(dbConfig);
//  setProfile.connect(function(jasoos2)
//  {
//     if(jasoos2==null)
//     {
//         console.log("CONNECTION READY TO PROFILE SETTINGS OF RECIPIENT!");
//     }
//     else
//     {
//         console.log(jasoos2);
//     }
//  })
app.post("/profile-needy-process",function(req,resp)
 {
    //-------file uploading-------
    var fileName2="nopic.jpg";
    if(req.files!=null)  //---------------might have an error
    {
        fileName2=req.files.ppic2.name;
        var path=process.cwd()+"/public/uploads/"+fileName2;
        req.files.ppic2.mv(path);
    }
    console.log(req.body);


    //SAVING THE TABLE DATA
    var email=req.body.ProEmail;
    var name=req.body.ProName;
    var Address=req.body.ProAdd;
    var Contact=req.body.ProPhone;
    //var dob=req.body.Dob;
    var city=req.body.ProCity;
    var gender=req.body.ProSex
    var dob = req.body.Dob; // Convert date string to a Date object

    

    

    Signin.query("insert into prof_needy(email,name,Contact,Address,City,ID_proof,DOB,Gender) values(?,?,?,?,?,?,?,?)",[email,name,Contact,Address,city,fileName2,dob,gender],function(err)
    {
        if(err==null)
        {
            resp.send("Data Saved successfully!!");
        }
        else
        {
            resp.send(err);
        }
    })

 })
 //--------------------------------------------------------
 //                   SEARCH
 app.get("/do-search-needy",function(req,resp){
    Signin.query("select * from prof_needy where email=?",[req.query.kuchEmail],function(err,resultTableJSON){
      if(err==null)
      resp.send(resultTableJSON);
      else
      resp.send(err);
    })
  })
//                  UPDATE
 app.post("/Update-needy-Account",function(req,resp)
 {

    //dater strings: true
     //-------file uploading-------
     var fileName2="nopic.jpg";
     if(req.files!=null)  //---------------might have an error
     {
         fileName2=req.files.ppic2.name;
         var path=process.cwd()+"/public/uploads/"+fileName2;
         req.files.ppic2.mv(path);
     }
     else
    {
    fileName2=req.body.idd;
    }
     console.log(req.body);

    //------------------saving data in table----------------------
    var email=req.body.ProEmail;
    var name=req.body.ProName;
    var Address=req.body.ProAdd;
    var Contact=req.body.ProPhone;
    var dob= req.body.Dob;
    var city=req.body.ProCity;
    var gender=req.body.ProSex;

//----------------------     -------------------  NEEDY UPDATE   --------------------     ------------------------

    Signin.query("update prof_needy set name=?,Contact= ?,Address= ?,City=?,ID_proof=?,DOB=?,Gender=? where email=? ",[name,Contact,Address,city,fileName2,dob,gender,email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
                resp.send("Account Updated Successsfulllyy!");
            else
                resp.send("Invalid Email id");
        }
        else
        resp.send(err);
    })
 })
 app.get("/chk-email3",function(req,resp)
{

    var r=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    Signin.query("select * from prof_needy where email=?",[req.query.kuchEmail],function(err,resultTable)
    {
        if(err==null)
        {
            if(resultTable.length==1)
            {
                resp.send("Already exist.");
               // status=0;
            }
            else if(req.query.kuchEmail=="")
            {
                resp.send("Please enter an email id.");
            }
            else if(r.test(req.query.kuchEmail)==false)
            {
                resp.send("Email Invalid.");
            }
            else
                resp.send(": You can fill your details.");  
                //status=1;  
        }
        else
        resp.send(err);
    })
})
 //=============================SETTINGS=================================================
 app.get("/chngpwd",function(req,resp){
    var email=req.query.email;
    var opwd=req.query.opwd;
    var npwd=req.query.npwd;
    Signin.query("update accounts set password=? where email=? and password=?",[npwd,email,opwd],function(err){
      if(err==null){
          resp.send("Password Updated");
        }
      else{
        resp.send(err);
      }
    })
  })

  //=================================================ADMIN INTERFACE=================================================================================================
  app.get("/Admin-interface",function(req,resp)
  {
    resp.sendFile(process.cwd()+"/public/Admin_interface.html");
  })
  app.get("/angular_user",function(req,resp)
  {
    resp.sendFile(process.cwd()+"/public/details_users.html");
  })
    //--------------------------------
app.get("/get-json-record",function(req,resp)
{
         //fixed                             //same seq. as in table
    Signin.query("select * from accounts where email=?",[req.query.kuchEmail],function(err,resultTableJSON)
    {
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
  //-----------------FETCH DATA--------------------
  app.get("/get-angular-all-records",function(req,resp)
  {

    Signin.query("select * from accounts",function(err,resultTableJSON)
        {
            if(err==null)
                resp.send(resultTableJSON);
            else
                resp.send(err);
        })

  })

  //-----------------DELETE User DATA from angular.js--------------------
 app.get("/do-angular-delete",function(req,resp)
 {
    //saving data in table
    var email=req.query.emailkuch;

    //fixed
    Signin.query("delete from accounts where email=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
                resp.send("Account Removed Successsfulllyy!");
            else
                resp.send("Invalid Email id");
        }
        else
        resp.send(err);
    })
 })
  //--------------------BLOCK-------------------------
  app.get("/do-angular-block",function(req,resp)
  {
     //saving data in table
     var email=req.query.emailkuch;
 
     //fixed
     Signin.query("update accounts set Ustatus=? where email=?",[0,email],function(err,result)
     {
         if(err==null)
         {
             if(result.affectedRows==1)
                 resp.send("Account De-activated Successfully!");
             else
                 resp.send("Invalid Email id");
         }
         else
         resp.send(err);
     })
  })
    //--------------------Resume-------------------------
    app.get("/do-angular-Resume",function(req,resp)
    {
       //saving data in table
       var email=req.query.emailkuch;
   
       //fixed
       Signin.query("update accounts set Ustatus=? where email=?",[1,email],function(err,result)
       {
           if(err==null)
           {
               if(result.affectedRows==1)
                   resp.send("Account Re-activated Successfully!");
               else
                   resp.send("Invalid Email id");
           }
           else
           resp.send(err);
       })
    })
    //====================Fetch Donar records==================
    app.get("/get-angular-donar-records",function(req,resp)
    {
  
      Signin.query("select * from prof_donar",function(err,resultTableJSON)
          {
              if(err==null)
                  resp.send(resultTableJSON);
              else
                  resp.send(err);
          })
  
    })
    //====================Fetch Needy records==================
    app.get("/get-angular-needy-records",function(req,resp)
    {
  
      Signin.query("select * from prof_needy",function(err,resultTableJSON)
          {
              if(err==null)
                  resp.send(resultTableJSON);
              else
                  resp.send(err);
          })
  
    })
    
    //====================Fetch Medicine records==================

    app.get("/Med-Manager",function(req,resp)
  {
    resp.sendFile(process.cwd()+"/public/Med_manager.html");
  })

    app.get("/get-angular-Medical-records",function(req,resp)
    {
  
        var Demail=req.query.email;
        Signin.query("select serial_no,Med_name,Exp_date,Packaging,Quantity from Med_details where email=?",[Demail],function(err,resultTableJSON)
          {
              if(err==null)
                  resp.send(resultTableJSON);
              else
                  resp.send(err);
          })
  
    })  
  //-----------------DELETE Medecine DATA from angular.js--------------------
 
app.post("/do-angular-med-delete", function (req, resp) {
    var SrNo = req.query.num; // Access the data from the request body
  
    Signin.query("delete from Med_details where serial_no=?", [SrNo], function (err, result) {
      if (err == null) {
        if (result.affectedRows == 1)
          resp.send("Data Removed Successfully!");
        else
          resp.send("Invalid Serial Number"+ err );
      } else {
        resp.send("Error occurred while deleting data: " + err);
      }
    });
  });
  
  
  
//======================================MED FINDER======================================================
  app.get("/fetch-city",function(req,resp)
  {
    Signin.query("select distinct City from prof_donar",function(err,resultTable)
     {
         if(err==null)
             resp.send(resultTable);
         else
             resp.send(err);
     })  
  }) 

 app.get("/fetch-med",function(req,resp)
 {
    Signin.query("select distinct Med_name from Med_details",function(err,resultTable)
    {
        if(err==null)
            resp.send(resultTable);
        else
            resp.send(err);
    })  
 }) 

 app.get("/fetch-donars",function(req,resp)
 {
    var med=req.query.medKuch;
    var city=req.query.cityKuch;
    var query="select prof_donar.name,prof_donar.email,prof_donar.Address,prof_donar.City,prof_donar.Contact,prof_donar.ID,prof_donar.ID_proof,prof_donar.Availhrs,Med_details.Med_name from prof_donar inner join Med_details on prof_donar.email=Med_details.email where Med_details.Med_name=? and prof_donar.City=?";
    Signin.query(query,[med,city],function(err,resultTable)
    {
        if(err==null)
        {

            console.log(resultTable+"     "+err);
            resp.send(resultTable);
        }
        else
            resp.send(err);
    })  
 }) 