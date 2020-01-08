/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSet = `subscription OnCreateSet {
  onCreateSet {
    id
    type
    user
    active
    appearedForRanking
    pictures {
      items {
        id
        rating
      }
      nextToken
    }
  }
}
`;
export const onUpdateSet = `subscription OnUpdateSet {
  onUpdateSet {
    id
    type
    user
    active
    appearedForRanking
    pictures {
      items {
        id
        rating
      }
      nextToken
    }
  }
}
`;
export const onDeleteSet = `subscription OnDeleteSet {
  onDeleteSet {
    id
    type
    user
    active
    appearedForRanking
    pictures {
      items {
        id
        rating
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
    rating
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
    rating
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
    rating
  }
}
`;
export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
    id
    name
    age
    points
  }
}
`;
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
    id
    name
    age
    points
  }
}
`;
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
    id
    name
    age
    points
  }
}
`;
