
import User from "../model/userModel.js"
import bcrypt from 'bcryptjs';


const createUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: `User Already Registered with this Email` })
            return;
        }
        
        const user = await new User({ name, email, password, phoneNumber }).save();
        res.status(200).json({ data: { name: user.name, email: user.email, phoneNumber: user.phoneNumber, _id: user._id }, statusCode: 0 });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message })
        } else {
            res.status(400).json({ message: 'An unexpected error occured' })
        }
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const currentUser = await User.findOne({ email });

        const userPassword = currentUser?.password ?? "";

        const comparePassword = await bcrypt.compare(password, userPassword);

        if (comparePassword) {
            res.status(200).json({ statusCode: 0, data: { _id: currentUser._id, name: currentUser.name, email: currentUser.email } })
            return;
        }
        res.status(400).json({ statusCode: 0, message: 'Email or Password Not Match' })
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message })
        } else {
            res.status(400).json({ message: 'An unexpected error occured' })
        }
    }
}

export { createUser, loginUser }