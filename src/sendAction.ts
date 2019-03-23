import { Reactotron } from "reactotron-core-client"

export default function createSendAction(reactotron: Reactotron) {
  return (action: { type: any }, ms: number, important = false) => {
    // let's call the type, name because that's "generic" name in Reactotron
    let { type: name } = action

    // convert from symbol to type if necessary
    if (typeof name === "symbol") {
      name = name
        .toString()
        .replace(/^Symbol\(/, "")
        .replace(/\)$/, "")
    }

    const safeAction = isSerializableObject(action)
      ? action
      : {
          type: name,
          __message:
            "This action may contain circular references so properties except for `type` are omitted.",
        }

    // off ya go!
    reactotron.send("state.action.complete", { name, action: safeAction, ms }, important)
  }
}

function isSerializableObject(object) {
  try {
    JSON.stringify(object)
  } catch (ex) {
    return false
  }
  return true
}
