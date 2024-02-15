import { JwtGuard } from "./Jwt.guard";

describe('JwtGuard', () => {
  it('should be defined', () => {
    expect(new JwtGuard()).toBeDefined();
  });
});
