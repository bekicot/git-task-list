import {isIterable} from '../utils/commons';

export const tasksQuery = `query($searchQuery: String!){
  rateLimit {
    remaining
  }
  search(query: $searchQuery, type: ISSUE, first: 100 ) {
    nodes {
      _type: __typename
      ... on Issue {
        id
        author {
          url
          login
          avatarUrl
        }
        bodyText
        comments {
          totalCount
        }
        repository {
          nameWithOwner
          owner {
            avatarUrl
          }
          url
        }
        title
        updatedAt
        url
      }
      ... on PullRequest {
        id
        author {
          url
          login
          avatarUrl
        }
        bodyText
        comments {
          totalCount
        }
        repository {
          nameWithOwner
          owner {
            avatarUrl
          }
          url
        }
        title
        updatedAt
        url
      }
    }
  }
}`;

export const queryBuilder = function queryBuilder({orgs}) {
  let queries = ['sort:updated-desc', 'state:open'];
  if(isIterable(orgs)) {
    queries = orgs.reduce((a,b) => [...a, 'user:' + b], queries);
  }
  return queries.join(' ');
};
