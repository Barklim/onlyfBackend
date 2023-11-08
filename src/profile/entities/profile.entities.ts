import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: false})
  userId: number;

  @Column({ default: 'username' })
  username: string;

  @Column({ default: 'first' })
  first: string;

  @Column({ default: 'lastname' })
  lastname: string;

  @Column({ default: false })
  verified: boolean;


  // TODO?
  @Column({ default: 0 })
  countViolations: number;

  @Column({ default: 0 })
  countViolationsPercentage: number;

  @Column({ default: 0 })
  countViolationsTotal: number;

  @Column({ default: 0 })
  countActiveDialogs: number;


  @Column({ default: 18 })
  age: number;

  @Column({ default: 'EUR' })
  currency: string;

  @Column({ default: 'Ukraine' })
  country: string;

  @Column({ default: 'Kiev' })
  city: string;

  @Column({ default: 'https://picsum.photos/800/600' })
  avatar: string;

  @Column({ default: 'https://www.instagram.com/' })
  instLink: string;

  @Column({ default: 'stop words' })
  stopWords: string;
}