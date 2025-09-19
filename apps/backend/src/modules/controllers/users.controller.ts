import { Request, Response, RequestHandler } from 'express';
import asyncHandler from "express-async-handler";
import * as UserService from '../services/users.service';


const createUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, avatar, gender } = req.body;

    const user = await UserService.createUser(
      { firstName, lastName, email, avatar, gender },
      password
    );

    res.status(201).json({ 
      message: 'User created or retrieved', 
      data: user
     });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

const getUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const User = await UserService.getUserById(userId);

    res.status(200).json({ 
      success: true,
      message: 'User data retrieved successfuly', 
      data: User
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user', 
      error 
    });
  }
});


const listUsers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();

    res.status(200).json({
      message: 'Users retrieved', 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving users', 
      error 
    });
  }
});

const updateUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const update = req.body;
    const user = await UserService.updateUserById(userId, update);

    res.status(200).json({ 
      message: 'User updated', 
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating user', error });
  }
});

const deleteUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await UserService.deleteUserById(userId);

    res.status(200).json({ 
      su: true,
      message: 'User deleted successfuly',

    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting user', 
      error 
    });
  }
});


const promoteUserRole: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const user = await UserService.updateUserById(userId, { role });


    res.status(200).json({ 
      message: `User promoted to ${role}`,
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error promoting user role', 
      error 
    });
  }
});

export {
  createUser,
  getUser,
  listUsers,
  updateUser,
  deleteUser,
  promoteUserRole
}