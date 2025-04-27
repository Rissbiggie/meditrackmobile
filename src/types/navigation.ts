import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Dashboard: undefined;
  Map: { serviceId?: string };
  Admin: undefined;
  ResponseTeam: undefined;
  Settings: undefined;
  FindServices: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 