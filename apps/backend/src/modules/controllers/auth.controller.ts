import asyncHandler from "express-async-handler";
import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/envConfig";
import sendEmail from "../common/email-service";
import { UserDocument } from "../models/users/model";
import { cloudinary } from "../../config/cloudinary.config";
import isTokenExpired from "../../utils/isTokenExpired";
import { createUser, getUserByEmail, getUserById } from "../services/users.service";
import { sendToken, accessCookieOptions, refreshCookieOptions } from "../../utils/sendToken";
import { loginUserWithEmailAndPassword, invalidateExistingTokens, logout, refreshAuth, verifyEmail, resetPassword } from "../services/auth.service"
import { generateUserActivationCode, generateVerifyEmailToken, generateResetPasswordToken } from "../services/tokens.service";

const signUp: RequestHandler = asyncHandler(async (req: Request, res: Response) =>  {
    try {
        const { firstName, lastName, email, password, avatar, gender, website, picture } = req.body;
        const user = await getUserByEmail(email);
        if (user) {
            res.status(400).json({ 
                error: `User with this Email ${email} already exists!`
            });
            return;
        }

        const userData = {firstName, lastName, email, password, avatar, gender, website, picture};
        const activationCodeAndToken = await generateUserActivationCode(userData as any); 

        const data = {
            token: activationCodeAndToken.token,
            verificationCode: activationCodeAndToken.activationCode
        };

        console.log(`Activation Code: ${activationCodeAndToken.activationCode}`);   

        await sendEmail(email, 'accountActivationLinkAndCode', firstName, data);

        res.status(200).json({
            success: true,
            message: `An activation code has been set to ${email}.`,
            activationToken: activationCodeAndToken.token
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error instanceof Error ? error.message : 'An error occurred during sign up!' 
        });
    }
});

const activateUserAccount: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { activation_code, activation_token } = req.body;
                
        const payload = jwt.verify(activation_token, env.JWT_SECRET);

        if (
            typeof payload !== "object" ||
            payload === null ||
            !("activationCode" in payload) ||
            !("user" in payload) ||
            typeof (payload as any).user !== "object"
        ) {
            res.status(400).json({ 
                success: false, 
                message: 'Invalid activation code or token!' 
            });
            return;
        }

        if ((payload as any).activationCode !== activation_code) {
            res.status(400).json({ 
                success: false, 
                message: 'Invalid activation code or token!' 
            });
            return;
        }

        const { firstName, lastName, email, password, avatar, gender } = (payload as any).user

        const userExists = await getUserByEmail(email);
        if (userExists) {
            res.status(400).json({ 
                error: `User with this Email ${email} already exists!`
            });
            return;
        }
        await createUser({ firstName, lastName, email, avatar, gender, isVerified: true }, password);
        res.status(200).json({ 
            success: true, 
            message: 'Your account has been verified successfully!'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error instanceof Error ? error.message : 'Account activation failed.' 
        });
    }
});

const signIn: RequestHandler = asyncHandler( async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await loginUserWithEmailAndPassword(email, password) as UserDocument;
        user.salt = undefined;
        user.passwordHash = undefined;

        await invalidateExistingTokens(user.id);
        sendToken(res, `Welcome Back ${user.firstName}!`, user, 200);
    } catch (error: any) {
        if (error.message === "Invalid email!") {
            res.status(401).json({ success: false, message: "No account found with that email address." });
        }
        
        if (error.message === "Invalid password!") {
            res.status(401).json({ success: false, message: "Password is incorrect." });
        }
        
        if (error.message === "Email and password are required!") {
            res.status(400).json({ success: false, message: error.message });
        }
        
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

const signOut: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        res.clearCookie("access_token", accessCookieOptions);
        res.clearCookie("refresh_token", refreshCookieOptions);
        res.cookie("connect.sid", "", { ...accessCookieOptions, maxAge: 1 });

        res.status(200).json({ 
            success: true, 
            message: 'Signed out successfully!' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Sign out error.', error: error instanceof Error ? error.message : error 
        });
    }
});

const sendVerificationEmail: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(400).json({ success: false, message: 'User ID not found in request.' });
            return;
        }

        const user = await getUserById(userId);
        const { token, activationCode } = await generateVerifyEmailToken(user);

        await sendEmail(user.email, 'account-activation-link', user.firstName, {token, activationCode});

        res.status(200).json({ 
            success: true,
            message: 'Check your email to verify your account!' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email.', error: error instanceof Error ? error.message : error 
        });
    }
});

const verifyEmailAccount: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await verifyEmail(req.query.token as string);
        await sendEmail(user.email, 'welcome to Coinlist Africa', user.firstName, {});

        res.status(200).json({ success: true, message: 'Account verified successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Email verification failed.', error: error instanceof Error ? error.message : error });
    }
});

const refreshToken: RequestHandler = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            res.status(401).json({ error: 'No refresh token provided!' });
            return;
        }

        if (isTokenExpired(token)) {
            res.status(401).json({ 
                message: 'Refresh token expired!'
            });
            return;
        }

        const tokens = await refreshAuth(token);
        res.cookie("access_token", tokens.access.token, accessCookieOptions);
        res.cookie("refresh_token", tokens.refresh.token, refreshCookieOptions);
        next();
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired refresh token', error });
    }
});

const forgotPasswordLink: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email);
        if (!user) {
            res.status(404).json({ success: false, message: 'User email not found!' });
            return;
        }

        const token = await generateResetPasswordToken(user);
        await sendEmail(email, 'resetPasswordLink', user.firstName, {token: token});

        res.status(200).json({ success: true, message: 'Password reset link sent!', token });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Failed to send reset link.' });
    }
});

const newPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        const token = req.params.token;
        console.log(`Token: ${token}`);
        const { password } = req.body;


        console.log(`Reset Password Token: ${token}`);
        console.log(`New Password: ${password}`);

        // Step 1: Decode the token
        const payload = jwt.verify(token, env.JWT_SECRET);
        if (typeof payload !== 'object' || payload === null || !('email' in payload)) {
            res.status(400).json({ success: false, message: 'Invalid or expired token!' });
        }

        const email = (payload as any).email;
        const user = await getUserByEmail(email);
        if (!user) {
          res.status(404).json({ success: false, message: 'User not found!' });
        }

        await resetPassword(token, password);

        if (user) {
            const sent = await sendEmail(user.email || '', 'successfulPasswordChange', user.firstName || '', {}); 
            console.log(`Email sent: ${sent}`); 
        }

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error: any) {
        if (error.message === 'Invalid or expired token!') {
            res.status(401).json({ success: false, message: 'Reset link has expired or is invalid.' });
        }

        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Reset password failed.'});
    }
});

const changePassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ 
                error: 'User ID is missing from request.' 
            });
            return;
        }
        const user = await getUserById(userId);

        if (!user.authenticate(oldPassword)) {
            res.status(401).json({ error: 'Incorrect old password!' });
            return;
        }

        user.passwordHash = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully!' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Change password failed.' });
    }
});

// google auth 
// const socialAuth = async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) return res.status(404).json({ success: false, message: 'User not found!' });

//     try {
//         const email = req.user.emails[0].value;
//         const base = `${req.user?.name?.familyName.toLowerCase()}_${req.user?.name?.givenName.toLowerCase()}`;
//         const image = req.user.photos[0].value;

//         const cloudinaryResult = await cloudinary.uploader.upload(image, {
//             folder: 'avatars',
//             public_id: `avatar/${req.user.id}`,
//             width: 150,
//             height: 150
//         });

//         const user = await getUserByEmail(email);
//         if (!user) {
//             const newUser = await createUser({ email, firstName: finalUsername, image_url: cloudinaryResult.secure_url });
//             sendToken(res, `Welcome ${newUser.firstName}`, newUser, 200);
//         } else {
//             sendToken(res, `Welcome Back ${user.firstName}!`, user, 200);
//         }
//     } catch (error) {
//         return next(error instanceof Error ? error : new Error("Unhandled SocialAuth Error"));
//     }
// };

// github auth 



export {
    signUp,
    activateUserAccount,
    signIn,
    signOut,
    sendVerificationEmail,
    verifyEmailAccount,
    refreshToken,
    forgotPasswordLink,
    newPassword,
    changePassword,
    // socialAuth,
}