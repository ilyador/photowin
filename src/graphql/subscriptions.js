// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateSet = `subscription OnCreateSet {
  onCreateSet {
    id
    user
    pictures {
      items {
        id
        url
        rating
        appearedForRanking
      }
      nextToken
    }
  }
}
`;
export const onUpdateSet = `subscription OnUpdateSet {
  onUpdateSet {
    id
    user
    pictures {
      items {
        id
        url
        rating
        appearedForRanking
      }
      nextToken
    }
  }
}
`;
export const onDeleteSet = `subscription OnDeleteSet {
  onDeleteSet {
    id
    user
    pictures {
      items {
        id
        url
        rating
        appearedForRanking
      }
      nextToken
    }
  }
}
`;
export const onCreatePicture = `subscription OnCreatePicture {
  onCreatePicture {
    id
    file {
      bucket
      key
      region
    }
    url
    rating
    appearedForRanking
  }
}
`;
export const onUpdatePicture = `subscription OnUpdatePicture {
  onUpdatePicture {
    id
    file {
      bucket
      key
      region
    }
    url
    rating
    appearedForRanking
  }
}
`;
export const onDeletePicture = `subscription OnDeletePicture {
  onDeletePicture {
    id
    file {
      bucket
      key
      region
    }
    url
    rating
    appearedForRanking
  }
}
`;
