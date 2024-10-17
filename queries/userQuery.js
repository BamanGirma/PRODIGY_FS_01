export default{
    getUserByEmail:`SELECT * FROM users WHERE userEmail=?;`,
    getUserByPhone:`SELECT * FROM users WHERE userPhone=?;`,
    getUserOTPByUserId:`SELECT OTP FROM users WHERE userId=?;`,
    getUserPasswordByUserId:`SELECT userPassword FROM userspassword WHERE userId=?;`,
    insertIntoUsers: `INSERT INTO users (userEmail,firstName,middleName,lastName,createdAt,activeStatus) VALUES (?,?,?,?,NOW(), 1);`,
    insertIntoUsersRole : `INSERT INTO usersroles(userId,role) VALUES (?,?)`,
    insertIntoUserPassword :`INSERT INTO userspassword (userId,userPassword,createdAt) VALUES (?,?,NOW());`,
    updateOTP: `UPDATE users SET OTP=NULL WHERE userId=?`,
    updateContactVerificationEmailStatus:`UPDATE contactverification SET email=1 WHERE userId=?`,
    newOTP: `UPDATE users SET OTP=? WHERE userId=?`,
    updateUsersPassword:`UPDATE userspasword SET userPassword=?, createdAt=NOW() WHERE userId=?`
}