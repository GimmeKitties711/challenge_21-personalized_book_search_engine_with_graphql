import { gql } from '@apollo/client';

export const QUERY_GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;

// savedBooks requires fields to be specified because graphql queries must return concrete data only: https://stackoverflow.com/questions/46111514/field-me-of-type-user-must-have-a-selection-of-subfields
