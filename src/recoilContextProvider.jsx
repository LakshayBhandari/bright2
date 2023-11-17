
import { RecoilRoot, atom } from "recoil";

export const ageFilterState = atom({
  key: "AgeFilter",
  default: 5,
});

export const LoginState=atom({
  key:"loginState",
  default:false,
})

export const UserIdState=atom({
  key:"UserIdState",
  default:"",
})

export const UserIdData=atom({
  key:"UserIdData",
  default:null,
})

export default function RecoidContextProvider({
  children,
}) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
