// Reserved skeleton — no business logic yet.

export interface User {
  id: string;
  email: string;
  tier: "free" | "pro" | "enterprise";
  createdAt: string;
}

export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: Omit<User, "id" | "createdAt">): Promise<User>;
  update(id: string, patch: Partial<Omit<User, "id">>): Promise<User>;
  delete(id: string): Promise<void>;
}

export const usersRepository: UsersRepository = {
  findById(_id: string): Promise<User | null> {
    throw new Error("Not implemented");
  },
  findByEmail(_email: string): Promise<User | null> {
    throw new Error("Not implemented");
  },
  create(_input: Omit<User, "id" | "createdAt">): Promise<User> {
    throw new Error("Not implemented");
  },
  update(_id: string, _patch: Partial<Omit<User, "id">>): Promise<User> {
    throw new Error("Not implemented");
  },
  delete(_id: string): Promise<void> {
    throw new Error("Not implemented");
  },
};
