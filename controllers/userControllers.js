import userService from "../services/userService";
import userUtility from "../Utils/userUtils";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import StatusCodes from 'http-status-codes'

dotenv.config();

const userController = {
    registerUser: async (req,res) =>{
        try {
            const{
                userEmail,
                userPassword,
                firstName,
                middleName,
                lastName,
            } = req.body;
            
            // Check all Fields
            if(!userEmail ||
               !userPassword ||
               !firstName ||
               !middleName ||
               !lastName
            ){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:"All fields are required",
                });
            }

            // Check if email is used before
            const isEmailExists = await userService.getUserByEmail(req.body);
            // If there is an account related to this email
            if(isEmailExists.length > 0){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:"Email is already used"
                });
            }

            // validation completed
            // prepare password
            // password encryption

            // specify a number of rounds
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            req.body.userPassword = bcrypt.hashSync(userPassword,salt)


            // inserting data
            const isUserDataInserted = await userService.insertIntoUsers(req.body);
            // Extract userId from the result
            req.body.userId=isUserDataInserted.insertedId;

            // Insert user role into the user role table
            const isUserRoleDataInserted = await userService.insertIntoUserRole(req.body);

            // Insert user password into the user password table
            const isUserPasswordAdded = await userService.insertIntoUsersPassword(
                req.body
            );

            if(isUserDataInserted &&              isUserRoleDataInserted &&
              isUserPasswordAdded
            ){
                res.status(StatusCodes.OK).json({
                    success:true,
                    message:"User created successfully"
                })
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:error.message,
            })
        }
    },

    // Confirm OTP
    confirmOTP: async (req,res) => {
        try {
            const {userEmail,OTP} = req.body;

            // Validate the request values
            if(!userEmail || !OTP){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:"All fields are required",
                })
            }

            // check if the email exists
            const getUserByEmail = await userService.getUserByEmail(req.body);
            const userId = getUserByEmail[0].userId;
            req.body.userId = userId;

            const getOTP =  await userService.getUserOTPByUserId(req.body);

            if(!getOTP.length){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success:false,
                    message:"OTP not found"
                })
            }
            else{
                const storedOTP = getOTP[0].OTP;
                if(OTP === storedOTP){
                    // correct OTP, perform any necessary actions
                    return res.status(StatusCodes.OK).json({
                        success:true,
                        message: "OTP successfully confirmed"
                    })
                }
                else{
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success:false,
                        message:"OTP does not match",
                    })
                }
            }
        } catch (error) {
            console.log("Error in confirmOTP: ",error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"Internal Server Error"
            })
        }
    },

    // Forget password
    forgetPassword : async (req,res) =>{
        try {
            const {userEmail} = req.body;
            // Validate the request values
            if(!userEmail){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:"All fields are required",
                })
            }

            // Check if the email exists
            const isUserExist = await userService.getUserByEmail(req.body);
            // If there is no account related to this email
            if(!isUserExist.length){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success:false,
                    message:"There is no account related to this email"
                });
            }else{
                // Extract userId
                req.body.userId = isUserExist[0].userId;
                
                // Generate OTP
                const OTP = await userUtility.generateDigitOTP();
                req.body.OTP = OTP;

                // Send OTP to user's email
                userUtility.sendEmail(userEmail,OTP)
                .then(async () =>{
                    // store OTP in database
                    const isnewOTPAdded = await userService.newOTP({
                    userId:req.body.userId, OTP:req.body.OTP})
                    console.log(isnewOTPAdded);

                    if(!isnewOTPAdded){
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                            success:false,
                            message:"Error during sending email"
                        })
                    }
                    else{
                        return res.status(StatusCodes.OK).json({
                            success:true,
                            message:"OTP sent Successfully. Please check you email"
                        })
                    }
                })
            }
        } catch (error) {
            console.log("Error in forgetPassword:", error.message);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"Internal Server Error",
            });
        }
    },

    // Change password
    newPassword: async(req,res) =>{
        try {
            req.body.userId = req.userId;
            const {userEmail,userPassword} = req.body;

            if(!userEmail || !userPassword){
                return res.json({
                    success:false,
                    message:"All fields are required",
                })
            }

            const isUserExist = await userService.getUserByEmail(req.body);

            if(!isUserExist){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success:false,
                    message:"User does not exist"
                })
            }

            // Extract userId
            req.body.userId = isUserExist[0].userId;

            // Specify the number of rounds
            const salt = bcrypt.genSaltSync(10);
            req.boy.userPassword = bcrypt.hashSync(userPassword,salt);

            const insertIntoUserPassword = await userService.updateUsersPassword(
                userId,
                userPassword
            );

            if(!updateUsersPassword){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success:false,
                    message:"Error during Password Insertion"
                });
            }

            return res.status(StatusCodes.OK).json({
                success:true,
                message:"New Password updated Successfully"
            })
        } catch (error) {
            console.error("Error in newPassword: ",error);
            return res.status(500).json({
                success:false,
                message:"Internal Server Error"
            });
        }
    },
};

export default userController;