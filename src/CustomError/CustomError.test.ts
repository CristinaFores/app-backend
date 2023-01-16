import CustomError from "./CustomError";

describe("Given the class CustomError", () => {
  describe("When instantiated with message 'General error", () => {
    test("Then it should create an object with messege", () => {
      const expectedError = {
        message: "General error",
        statusCode: 400,
        publicMessage: "Something has error",
      };

      const expectedMessage = expectedError.message;
      const expectedCode = expectedError.statusCode;
      const expectedPublicMessage = expectedError.publicMessage;

      const newError = new CustomError(
        expectedMessage,
        expectedCode,
        expectedPublicMessage
      );

      expect(newError).toHaveProperty("message", expectedMessage);
      expect(newError).toHaveProperty("statusCode", expectedCode);
      expect(newError).toHaveProperty("publicMessage", expectedPublicMessage);
    });
  });
});
