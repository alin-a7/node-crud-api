export interface UserDTO {
  id: string
  username: string
  age: number
  hobbies: string[]
}

export type UserDTOOmitId = Omit<UserDTO, 'id'>
