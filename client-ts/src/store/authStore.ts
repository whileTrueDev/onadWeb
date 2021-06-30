import create from 'zustand';
import HOST from '../config';
import history from '../history';
import axios from '../utils/axios';

interface LoginCheckResponse {
  error: boolean;
  state?: number;
  userType: string;
}

type UserType = 'marketer' | 'creator' | null;
type LoginArgs = { userid: string; passwd: string; type: UserType };

interface AuthState {
  isLoggedIn: boolean;
  userType: UserType;
  needRepassword: boolean;
  doneRepassword: () => void;
  login: (agrs: LoginArgs) => Promise<[boolean, any]>;
  loginCheck: () => Promise<string | null>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  userType: null,
  needRepassword: false,
  doneRepassword: () => set({ needRepassword: false }),
  login: async (args: LoginArgs) => {
    return axios
      .post(`${HOST}/login`, {
        type: args.type,
        userid: args.userid,
        passwd: args.passwd,
      })
      .then(async ({ data }) => {
        const { loginCheck } = get();
        await loginCheck();
        return data;
      });
  },
  loginCheck: async () => {
    return axios
      .get<LoginCheckResponse>(`${HOST}/login/check`)
      .then(res => {
        if (!res.data.error) {
          if (res.data.state) {
            set({ needRepassword: true }); // 임시 로그인.
          }
          set({ isLoggedIn: true, userType: res.data.userType as UserType });
          return res.data.userType;
        }
        set({ isLoggedIn: false });
        return null;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
  },
  logout: async () => {
    return axios
      .get(`${HOST}/logout`)
      .then(() => {
        history.push('/');
      })
      .catch((error: any) => {
        console.log(error);
      });
  },
}));
