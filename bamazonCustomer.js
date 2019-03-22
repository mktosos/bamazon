var mysql = require("mysql");
var inquirer = require("inquirer");
var remainingInventory;
var res;

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "0toss0AAA!",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    buyInfo();
    //console.log (res[idArrayIndex].stock_quantity);
  });
}

function buyInfo() {
  inquirer
    .prompt([
      {
        name: 'item',
        type: 'input',
        message: 'What is the product ID you would like to buy?',
      },
      {
        name: 'quantity',
        type: 'input',
        message: 'How many would you like?',
      },
     
    ])
    .then(function(answer) {
      connection.query("SELECT * FROM products WHERE ?", {id: answer.item }, function(err, res) {
        console.log(answer);
        //console.log(answer.quantity);
        //console.log(res[0].stock_quantity);
        console.log(res[0]);
        if (answer.quantity<=res[0].stock_quantity){
          var remainingInventory = res[0].stock_quantity - answer.quantity;
          console.log("updated inventory: " +remainingInventory+ " units");
          console.log("total cost of purchase: $" +answer.quantity * res[0].price);

        }
        else{
          console.log("Sorry insufficient inventory. Order can not be fulfilled. Only " + res[0].stock_quantity+" available.");
        }
      });
      
      //console.log(res[answer.item].stock_quantity);
      // when finished prompting, insert a new item into the db with that info
    //   connection.query(
    //     'INSERT INTO auctions SET ?',
    //     {
    //       item_name: answer.item,
    //       category: answer.category,
    //       starting_bid: answer.startingBid || 0,
    //       highest_bid: answer.startingBid || 0,
    //     },
    //     function(err) {
    //       if (err) throw err;
    //       console.log('Your auction was created successfully!');
    //       // re-prompt the user for if they want to bid or post
    //       start();
    //     }
    //   );
  });
  
    
  
}
