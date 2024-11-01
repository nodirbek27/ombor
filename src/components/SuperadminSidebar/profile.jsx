import { ProfileContaier } from "./style";
import noImg from "../../assets/images/noUser.webp";

export const Profile = () => {
  return (
    <ProfileContaier>
      <ProfileContaier.Image src={noImg} />
      <div>
        <ProfileContaier.Name>Nodirbek Nurmamatov</ProfileContaier.Name>
        <ProfileContaier.Email>nodirjon@gmail.com</ProfileContaier.Email>
      </div>
    </ProfileContaier>
  );
};
