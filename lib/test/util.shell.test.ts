import { sh } from "../util";

describe("Util shell values bluj ", () => {
  test("simple", () => {
    expect(sh("echo hello")).toEqual({ command: "echo", args: ["hello"] });
  }, 1);
  test("simple 2", () => {
    expect(sh("echo hello world")).toEqual({
      command: "echo",
      args: ["hello", "world"],
    });
  }, 1);
  test("simple A double quote", () => {
    expect(sh('echo "hello world" ')).toEqual({
      command: "echo",
      args: ["hello world"],
    });
  }, 1);
  test("simple A sing quote", () => {
    expect(sh("echo 'hello world' ")).toEqual({
      command: "echo",
      args: ["hello world"],
    });
  }, 1);
  test("simple complex", () => {
    expect(sh("echo arg1    'arg2 and' arg3 \"arg4   \" ")).toEqual({
      command: "echo",
      args: ["arg1", "arg2 and", "arg3", "arg4   "],
    });
  }, 1);
  test("nested", () => {
    expect(
      sh(`echo " 'arg1  '   "      '    "  arg2"        '       arg4'"`)
    ).toEqual({
      command: "echo",
      args: [` 'arg1  '   `, `    "  arg2"        `, `arg4'"`],
    });
  }, 1);
});
