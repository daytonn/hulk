import Schema from "../schema";

export default class Alias extends Schema {
  fields = {
    name: { type: "string", required: true },
    command: { type: "string", required: true }
  }
}
