export function hashPassword(password: string): Promise<string> {
  const hash = Bun.password.hash(password, {
    algorithm: "argon2id",
  });

  return hash;
}

export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return Bun.password.verify(password, hash);
}
