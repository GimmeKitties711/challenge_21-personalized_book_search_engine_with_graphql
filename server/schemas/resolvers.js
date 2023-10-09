const { AuthenticationError } = require('apollo-server-express');
const { Book, Index, User } = require('../models');
const { signToken } =  require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) { // if the user is logged in
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) { // if there is no user with that email address
              throw new AuthenticationError('No user found with this email address.');
            }

            const correctPassword = await user.isCorrectPassword(password);

            if (!correctPassword) { // if the user enters the wrong password
              throw new AuthenticationError('Incorrect credentials.');
            }

            const token = signToken(user);

            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                let updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } }, // add the book corresponding to bookData to the savedBooks array
                    { new: true }
                );

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                let updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } } // remove the book corresponding to bookId from savedBooks
                );

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    }
}

module.exports = resolvers;
