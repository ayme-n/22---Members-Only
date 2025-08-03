#! /usr/bin/env node

const {Client} = require("pg")
require("dotenv").config();


const SQL = `

CREATE TABLE IF NOT EXISTS "User" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  firstName VARCHAR(30),
  lastName VARCHAR(30),
  username varchar(30) UNIQUE ,
  password VARCHAR(200),
  admin BOOLEAN DEFAULT FALSE,
  membership_status BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "Message" (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  text VARCHAR(200),
  author_id INT REFERENCES "User"(id)
);

`;


async function main() {


    const client = new Client({
        
        connectionString : process.env.DATABASE_URL

    })
    
    await client.connect()
    await client.query(SQL)
    await client.end()

    console.log("done")
}


main()