export const successEntity = (data: unknown, isArray?: boolean) => {
  return {
    type: "object",
    required: ["success", "message", "data"],
    additionalProperties: false,
    properties: {
      success: { type: "boolean" },
      message: { type: "string" },
      data: isArray
        ? {
            type: "array",
            items: data,
          }
        : data,
    },
  } as const;
};
