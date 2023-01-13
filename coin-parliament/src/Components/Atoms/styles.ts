import styled from "styled-components";
import {
  InputAndButton,
  PoppinsMediumBlack12px,
  PoppinsMediumBlackRock22px,
  PoppinsMediumWhite12px,
  PoppinsNormalChicago12px,
} from "../../styledMixins";
import { Form } from "react-bootstrap";

const Login = styled.div`
  ${PoppinsMediumBlackRock22px}
  min-height: 33px;
  align-self: center;
  margin-right: 7px;
  min-width: 61px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: capitalize;
`;

const GoogleContainer = styled.button`
  ${InputAndButton}
  margin-top: 26px;
  padding: 7.7px 19px;
  align-items: flex-start;
`;

const LogoGoogleOutline = styled.img`
  width: 23px;
  height: 24px;
  margin-top: 0.31px;
  object-fit: cover;
`;

const ContinueWithGoogle = styled.div`
  ${PoppinsNormalChicago12px}
  min-height: 19px;
  align-self: flex-end;
  margin-left: 32px;
  min-width: 131px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: capitalize;
`;

const FacebookContainer = styled.button`
  ${InputAndButton}
  margin-top: 3px;
  padding: 7.7px 24px;
  align-items: flex-start;
`;

const Facebook = styled.img`
  width: 13px;
  height: 24px;
  margin-top: 0.31px;
  object-fit: cover;
`;

const ContinueWithFacebook = styled.div`
  ${PoppinsNormalChicago12px}
  min-height: 19px;
  align-self: flex-end;
  margin-left: 37px;
  min-width: 147px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: capitalize;
`;

const TwitterContainer = styled.button`
  ${InputAndButton}
  margin-top: 3px;
  padding: 7.7px 18px;
  align-items: center;
`;

const SocialTwitter = styled.img`
  width: 25px;
  height: 21px;
  margin-bottom: 1.16px;
  object-fit: cover;
`;

const ContinueWithTwitter = styled.div`
  ${PoppinsNormalChicago12px}
  min-height: 19px;
  align-self: flex-end;
  margin-left: 31px;
  min-width: 131px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: capitalize;
`;

const OR = styled.div`
  ${PoppinsMediumBlack12px}
  min-height: 19px;
  align-self: center;
  margin-top: 33px;
  margin-left: 1px;
  min-width: 19px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: uppercase;
`;

const OverlapGroup2 = styled.div`
  ${InputAndButton}
  margin-top: 17px;
  padding: 8.1px 20px;
  align-items: flex-end;
`;

const Email = styled.div`
  ${PoppinsNormalChicago12px}
  width: 100%;
  min-height: 19px;
  min-width: 35px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: capitalize;
`;

const OverlapGroup4 = styled.button`
  ${InputAndButton}
  margin-top: 13px;
  padding: 8.1px 99.3px;
  justify-content: flex-end;
  align-items: flex-end;
  background-color: var(--blue-violet);
`;

const Continue = styled.div`
  ${PoppinsMediumWhite12px}
  min-height: 19px;
  min-width: 57px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: capitalize;
`;

export const Input = styled(Form.Control)`
  ${InputAndButton}
  ${PoppinsNormalChicago12px}
  width: 100%;
  min-height: 19px;
  min-width: 35px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  background: none;
  margin: 0;
  padding: 8.1px 20px;
`;

const Styles = {
  Login,
  GoogleContainer,
  LogoGoogleOutline,
  ContinueWithFacebook,
  ContinueWithGoogle,
  ContinueWithTwitter,
  Facebook,
  FacebookContainer,
  Continue,
  SocialTwitter,
  TwitterContainer,
  OR,
  OverlapGroup2,
  OverlapGroup4,
  Email,
  Input,
};

export default Styles;
