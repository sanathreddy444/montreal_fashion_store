const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// create express app
const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

//local mysql db connection
const dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Reddy@1510',
  database: 'mtl_store'
});
dbConn.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});


app.all('/*', function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,enctype,authorization');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});


var Customer = function (customer) {
  this.first_name = customer.first_name;
  this.last_name = customer.last_name;
  this.email = customer.email;
  this.phone_number = customer.phone_number;
  this.password = customer.password;
  this.created_date = new Date();
};

var Product = function (product) {
  this.category = product.category;
  this.name = product.name;
  this.description = product.description;
  this.price = product.price;
  this.quantity = product.quantity;
  this.brand = product.brand;
  this.size = product.size;
  this.created_date = new Date();
  this.is_active = 1;
};


app.post('/register', (req, res) => {
  // console.log("Request", req.body)
  const new_customer = new Customer(req.body);

  dbConn.query("INSERT INTO customer set ?", new_customer, function (err, result) {
    if (err) {
      res.send({ status: 500, message: "Customer registration failed" });
    }
    else {
      res.send({ status: 200, message: "Customer registered successfully" });
    }
  });
});


app.post('/login', (req, res) => {
  dbConn.query("SELECT * FROM customer WHERE email = ? and password = ?", [req.body.username, req.body.password], function (err, result) {
    if (err) {

      res.send({ status: 500, message: "Invalid Credentials" });

    }
    else if (result.length) {
      res.send({ status: 200, data: result });
    } else {
      res.send({ status: 500, message: "Invalid Credentials" });

    }
  });
});

app.get('/customerProfile/:username', (req, res) => {
  dbConn.query("SELECT * FROM customer WHERE email = ?", [req.params.username], function (err, result) {
    if (err) {
      res.send({ status: 500, message: "Please try again" });
    } else if (result.length) {
      res.send({ status: 200, data: result[0] });
    } else {
      res.send({ status: 500, message: "User Not Found" });
    }
  })
});

app.post('/updateProfile', (req, res) => {
  dbConn.query("UPDATE customer SET first_name = ?,last_name = ?,phone_number = ? WHERE email=?", [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email], function (err, result) {
    if (err) {
      res.send({ status: 500, message: "Please try again" });
    } else {
      res.send({ status: 200, message: "Profile Updated Successfully" });
    }
  })
})

app.post('/addProduct', (req, res) => {
  const new_product = new Product(req.body);
  dbConn.query("INSERT INTO product set ?", new_product, function (err, result) {
    if (err) {
      res.send({ status: 500, message: "Please try again" });
    }
    else {
      res.send({ status: 200, message: "Product added successfully" });
    }
  });
});

app.post('/fecthProductsForEmployee', (req, res) => {
  let query = "SELECT * FROM product";
  let values = []
  dbConn.query(query,values,function(err, result) {
    if(err) {
      res.send({status:500, message: "Please try again"});
    }
    else{
      res.send({status:200, data: result});
    }
  })
})

app.post('/fecthProductsForCustomer', (req, res) => {
  let query = "SELECT * FROM product";
  let values = []
  dbConn.query(query,values,function(err, result) {
    if(err) {
      res.send({status:500, message: "Please try again"});
    }
    else{
      res.send({status:200, data: result});
    }
  })
})

// listen for requests
app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});