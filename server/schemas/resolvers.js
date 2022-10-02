const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        user: async (parent, { username, _id  }, context) => {
            try {
                return await User.findOne({
                    $or: [{ _id: _id }, { username }],
                });
            } catch (error) {
                throw new Error(error);
            };
        },
        loggedInUser: async (parent, args, context) => {
            try {
                if (!context.user) throw new Error('login pls 1');
                const user = User.findById(context.user._id);
                return user;
            } catch (error) {
                console.log(error);
                return error;
            }
        }
    },

    Mutation: {
        addUser: async (parent, args, context) => {
            const user = await User.create({...args });

            if (!user) {
                throw new Error('error with addUser mutation');
            };
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { username, email, password }, context) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });
            if (!user) {
                throw new AuthenticationError('error with login mutation');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('error with correctPw mutation');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            
            try {
                if (context.user) {
                    return await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $addToSet: { savedBooks: {...book} } },
                        { new: true, runValidators: true }
                    );
                }
                else throw new Error('login pls 2');
            } catch (err) {
                console.log(err);
                throw new Error(err);
            };
        },
        // remove a book from `savedBooks`
        removeBook: async (parent, { bookId }, context) => {
            try {
                if (context.user) {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: { bookId } } },
                        { new: true }
                    );
                    if (!updatedUser) {
                        return { message: "no user wit this id :(" };
                    };
                    return updatedUser;
                }
                else throw new Error('login pls 3');

            } catch (error) {
                throw new Error(error);
            }
        },
    },
};

module.exports = resolvers;