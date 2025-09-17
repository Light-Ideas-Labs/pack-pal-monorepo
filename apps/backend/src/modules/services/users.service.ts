import crypto from "crypto";
import userModel, { IUser, UserDocument } from "../models/users/model";

// Only profile-safe fields (no password, no salt/hash here)
export type UserProfilePatch = Partial<
  Omit<IUser, "salt" | "passwordHash" | "billingAddress">
> & {
  // If you also want to patch addresses via profile, add a separate function for it.
};

/** Create user */
const createUser = async (userData: Partial<IUser>, plainPassword: string): Promise<UserDocument> => {
  console.log("Creating user with data:", userData);
  try {
    const existing = await userModel.findOne({ email: (userData.email || "").toLowerCase() });
    if (existing) {
      throw new Error("User already exists with this email.");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto.createHmac("sha1", salt).update(plainPassword).digest("hex");

    const newUser = new userModel({
      ...userData,
      email: (userData.email || "").toLowerCase(),
      salt,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user");
  }
};

/** Get all users */
const getAllUsers = async (): Promise<UserDocument[]> => {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });
    return users as UserDocument[];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Error fetching users");
  }
};

/** Get one user by id */
const getUserById = async (id: string): Promise<UserDocument> => {
  try {
    const user = await userModel.findById(id);
    if (!user) throw new Error("User not found");
    return user as UserDocument;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
};

/** Get user by email */
const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    return (user as UserDocument) || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Error fetching user by email");
  }
};

/** Update user */
const updateUserById = async (id: string, patch: Partial<IUser>): Promise<UserDocument | null> => {
  try {
    if (patch.email) patch.email = patch.email.toLowerCase();
    const updated = await userModel.findByIdAndUpdate(id, { ...patch, updatedAt: new Date() }, { new: true });
    return (updated as UserDocument) || null;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
};

const updateUserProfile = async (id: string, patch: UserProfilePatch): Promise<UserDocument | null> => {
  try {
    // prevent password fields from sneaking in
    const {
      // eslint-disable @typescript-eslint/no-unused-vars
      // @ts-ignore - defensive strip in runtime anyway
      password, salt, passwordHash, ...safePatch
    } = patch as any;

    const updated = await userModel.findByIdAndUpdate(
      id,
      { ...safePatch, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return (updated as UserDocument) || null;
  } catch (err) {
    console.error("Error updating user profile:", err);
    throw new Error("Error updating user profile");
  }
};

const updateUserPassword = async (id: string, newPassword: string): Promise<UserDocument> => {
  try {
    const user = await userModel.findById(id);
    if (!user) throw new Error("User not found");

    // this triggers your schema method + salt/hash logic
    user.setPassword(newPassword);
    await user.save();

    return user as UserDocument;
  } catch (err) {
    console.error("Error updating user password:", err);
    throw new Error("Error updating user password");
  }
};

/** Delete user */
const deleteUserById = async (id: string): Promise<void> => {
  try {
    await userModel.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Error deleting user");
  }
};

/** Authenticate user (email + password) */
const authenticateUser = async (email: string, plainPassword: string): Promise<UserDocument> => {
  try {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user || !user.salt || !user.passwordHash) throw new Error("Invalid credentials");

    const hash = crypto.createHmac("sha1", user.salt).update(plainPassword).digest("hex");
    if (hash !== user.passwordHash) throw new Error("Invalid credentials");

    return user as UserDocument;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw new Error("Invalid credentials");
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateUserProfile,
  updateUserPassword,
  deleteUserById,
  authenticateUser
};
