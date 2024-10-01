import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  cpf_cnpj: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;
}
