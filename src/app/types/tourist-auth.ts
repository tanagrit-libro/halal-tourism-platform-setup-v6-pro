export interface TouristAuthProps {
  isTouristLoggedIn?: boolean;
  onTouristLogin?: () => void;
  onTouristLogout?: () => void;
  onTouristRegister?: () => void;
  onRequireSignIn?: () => void;
}
