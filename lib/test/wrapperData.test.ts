import { T } from "..";
import { utils } from "../util";

type WrapperType = {
  config: {
    someValue: string;
  };
};
const todo = <A>(): A => {
  throw new Error("not implemented");
};
const noop = () => {};
describe("wrapperData", () => {
  test.skip("types", async () => {
    utils<WrapperType>(todo<T.Effects>()).setWrapperData(
      "/config/someValue",
      "someValue",
    );
    utils<WrapperType>(todo<T.Effects>()).setWrapperData(
      "/config/someValue",

      // @ts-expect-error Type is wrong for the setting value
      5,
    );
    utils<WrapperType>(todo<T.Effects>()).setWrapperData(
      // @ts-expect-error Path is wrong
      "/config/someVae3lue",
      "someValue",
    );

    todo<T.Effects>().setWrapperData<WrapperType, "/config/someValue">({
      path: "/config/someValue",
      value: "someValueIn",
    });
    todo<T.Effects>().setWrapperData<WrapperType, "/config/some2Value">({
      //@ts-expect-error Path is wrong
      path: "/config/someValue",
      //@ts-expect-error Path is wrong
      value: "someValueIn",
    });
    todo<T.Effects>().setWrapperData<WrapperType, "/config/someValue">({
      //@ts-expect-error Path is wrong
      path: "/config/some2Value",
      value: "someValueIn",
    });

    (await utils<WrapperType>(todo<T.Effects>())
      .getWrapperData("/config/someValue")
      .const()) satisfies string;
    (await utils<WrapperType>(todo<T.Effects>())
      .getWrapperData("/config")
      .const()) satisfies WrapperType["config"];
    await utils<WrapperType>(todo<T.Effects>())
      // @ts-expect-error Path is wrong
      .getWrapperData("/config/somdsfeValue")
      .const();
    (await utils<WrapperType>(todo<T.Effects>())
      .getWrapperData("/config/someValue")
      // @ts-expect-error satisfies type is wrong
      .const()) satisfies number;
    (await utils<WrapperType>(todo<T.Effects>())
      // @ts-expect-error Path is wrong
      .getWrapperData("/config/")
      .const()) satisfies WrapperType["config"];

    (await todo<T.Effects>().getWrapperData<WrapperType, "/config/someValue">({
      path: "/config/someValue",
      callback: noop,
    })) satisfies string;
    await todo<T.Effects>().getWrapperData<WrapperType, "/config/someValue">({
      // @ts-expect-error Path is wrong as in it doesn't match above
      path: "/config/someV2alue",
      callback: noop,
    });
    await todo<T.Effects>().getWrapperData<WrapperType, "/config/someV2alue">({
      // @ts-expect-error Path is wrong as in it doesn't exists in wrapper type
      path: "/config/someV2alue",
      callback: noop,
    });
  });
});
