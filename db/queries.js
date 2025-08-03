const pool = require("./pool")



async function Add_User(firstname,lastname,username,password,admin) {


 
    await pool.query(
      'INSERT INTO "User" (firstName, lastName, username, password,admin) VALUES ($1, $2, $3, $4,$5)',
      [firstname, lastname, username, password,admin]
    );
 
}

async function  Set_Membership(username) {


    await pool.query('UPDATE "User" Set membership_status = true where username = $1',[username])
    
}
    

async function ADD_MESSAGE(title,text,AuthorID) {


 
    await pool.query(
      'INSERT INTO "Message" (title, text, author_id) VALUES ($1, $2, $3)',
      [title, text, AuthorID]
    );
 
}



async function DELETE_MESSAGE(ID) {


 
    await pool.query(
      'DELETE FROM "Message" where id = $1',
      [ID]
    );
 
}


async function GET_MESSAGES() {


 
    const {rows} = await pool.query(
      'Select username,title,text,created_at,m.id as message_id,u.id as user_id from "Message" m  Join "User" u ON u.id = author_id'
    );

    return rows
 
}


module.exports = {Add_User,Set_Membership,ADD_MESSAGE,GET_MESSAGES,DELETE_MESSAGE}