import {lazy} from "react";

const Login = lazy(() => import ("./login/Login"));
const Register = lazy(() => import ("./register/Register"));
const Chat = lazy(() => import ("./chat/Chat"));
const Explore = lazy(() => import ("./explore/Explore"));
const Friends = lazy(() => import ("./friends/Friends"));
const MeView = lazy(() => import ("./me/me_view/MeView"));
const MeEdit = lazy(() => import ("./me/me_edit/MeEdit"));
const Profile = lazy(() => import ("./profile/Profile"));

export {Login, Register, Chat, Explore, Friends, MeView, MeEdit, Profile};