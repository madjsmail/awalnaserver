const bcrypt = require("bcryptjs");

const couch = require('./db');
const admin = require('../enrollAdmin');
couch.createDatabase('users').then(() => {
  console.log('data base users created');
}, err => {
  // request error occured
  console.log('data base users err :' + err);

});

createAdmin = async () => {
  couch.insert("users", {
    _id: "admin@admin.com",
    password: await bcrypt.hash("password", 12),
    role: "admin",
    username: "superAdmin",
    firstName: "admiin",
    lastName: "admiiiiin",
    birthday: "10/11/1220",
    contact: "0123456789",
    address: "tuvirt"
  }).then(({ data, headers, status }) => {
    // data is json response
    // headers is an object with all response headers
    // status is statusCode number
    console.log(data);
    console.log(headers);
    console.log(status);


  }, err => {
    console.log(err);

    // either request error occured
    // ...or err.code=EDOCCONFLICT if document with the same id already exists
  });
};




createAdmin();
admin.main();