import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar')
  username!: string

  @Column('int')
  age!: number

  @Column('simple-array')
  hobbies!: string[]
}
