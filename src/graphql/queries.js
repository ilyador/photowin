/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSet = `query GetSet($id: ID!) {
  getSet(id: $id) {
    id
    type
    user
    appearedForRanking
    pictures {
      items {
        id
        rating
        file {
          key
        }
      }
      nextToken
    }
  }
}
`;
export const listSets = `query ListSets($filter: ModelSetFilterInput, $limit: Int, $nextToken: String) {
  listSets(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      appearedForRanking
      pictures {
        items {
          file {
            key
          }
          rating
        }
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getPicture = `query GetPicture($id: ID!) {
  getPicture(id: $id) {
    id
    file {
      bucket
      key
      region
    }
    rating
  }
}
`;
export const listPictures = `query ListPictures(
  $filter: ModelPictureFilterInput
  $limit: Int
  $nextToken: String
) {
  listPictures(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      file {
        bucket
        key
        region
      }
      rating
    }
    nextToken
  }
}
`;
export const getByAppeared = `query GetByAppeared(
  $type: String
  $appearedForRanking: ModelIntKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelSetFilterInput
  $limit: Int
  $nextToken: String
) {
  getByAppeared(
    type: $type
    appearedForRanking: $appearedForRanking
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      appearedForRanking
      pictures {
        items {
          id
          rating
          file {
            key
          }
        }
        nextToken
      }
    }
    nextToken
  }
}
`;
