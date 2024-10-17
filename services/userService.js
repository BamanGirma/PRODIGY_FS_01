import query from '../config/dbConfig'
import userQuery from '../queries/userQuery'

const userService = {
    insertIntoUsers: async (data) =>{
        try {
            const rows = await query(userQuery.insertIntoUsers,[
                data.userEmail,
                data.firstName,
                data.middleName,
                data.lastName,
            ]);
            return rows;
        } catch (error) {
            console.log("Error inserting user: ", error.message);
            throw new Error("Database insertion failed")
        }
    },
    insertIntoUserRole: async(data) =>{
        try {
            const rows = await query(userQuery.insertIntoUsersRole,[
                data.userId,
                data.role
            ]);
            return rows;
        } catch (error) {
            console.log("error during insert user role",error.message);
            throw new Error("user role insertion failled")
        }
    },
    updateUsersPassword: async(userId,encryptedPassword) =>{
        try {
            const rows = await query(userQuery.updateUsersPassword,[
                encryptedPassword,
                userId,
            ]);
            return rows;
        } catch (error) {
            console.log("Error during update password",error.message);
            throw new Error("password update failled")
            
        }
    },
    insertIntoUsersPassword: async(data) =>{
        try {
            const rows= await query(userQuery.insertIntoUserPassword,[
                data.userId,
                data.userPassword,
            ]);
            return rows;
        } catch (error) {
            console.log("Error during password insertion: ",error.message);
            throw new Error("password insertion failed")
        }
    },
    getUserByEmail: async(data) =>{
    try {
        const rows = await query(userQuery.getUserByPhone, [data.userPhone]);
        return rows;
    } catch (error) {
        console.log("Error during get user by email",error.message);
        throw new Error("getting user by email failed")
    }
    },
    getUserByPhone:async(data) =>{
        try {
            const rows = await query(userQuery.getUserByPhone,[data.userPhone]);
            return rows;
        } catch (error) {
            console.log("Error during get user by phone",error.message);
            throw new Error("getting user by phone failed");
        }
    },
    getRoleNameUsingUserId: async (id) =>{
        try {
            const rows = await query(userQuery.getRoleNameUsingUserId,[id])
            return rows;
        } catch (error) {
            console.log("get role names by user id is failed",error.message);
            throw new Error("get role name by user id failed")
        }
    },
    getUserOTPByUserId: async(data) =>{
        try {
            const rows = query(userQuery.getUserOTPByUserId,[data.userId]);
            return rows;
        } catch (error) {
            console.log("Error during getting OTP:",error.message);
            throw new Error("get OTP failed")
        }
    },
    getUserPasswordByUserId: async (data) =>{
        try {
            const rows = await query(userQuery.getUserPasswordByUserId,[
                data.userId
            ]);
            return rows;
        } catch (error) {
            console.log("Error during getting user password by user id:",error.message);
            throw new Error("getting user password by user id is failed")
        }
    },
    updateOTP: async(data) =>{
        try {
            const rows = query(userQuery.updateOTP,[data.userId]);
            return rows;
        } catch (error) {
            console.log("Error updating user's OTP:",error.message);
            throw new Error("updating OTP is failled")
        }
    },
    newOTP:async(data) =>{
        try {
            const {userId,OTP} = data;
            // console.log(userId);
            // console.log(OTP);

            const rows = query(userQuery.newOTP,[userId,OTP]);
            return rows;
        } catch (error) {
            console.log("Error updating user's OTP");
            throw new Error("updating user OTP is failed")
        }
    }
};

export default userService;