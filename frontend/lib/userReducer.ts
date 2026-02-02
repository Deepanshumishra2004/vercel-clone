// userReducer.ts
export type User = { id: string; email: string; username: string };
type Action =
  | { type: "SET_USER"; payload: User }
  | { type: "CLEAR_USER" };

export function userReducer(state: User | null, action: Action) {
  switch (action.type) {
    case "SET_USER":
      return { ...action.payload }; // spread user details
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
}
