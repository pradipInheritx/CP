import styled from "styled-components";
import {
  Border1pxEbb,
  InputAndButton,
  PoppinsMediumBlack12px,
  PoppinsMediumBlackRock22px,
  PoppinsMediumWhite12px,
  PoppinsNormalChicago12px,
} from "../../styledMixins";

const SignUp = styled.div`
  ${PoppinsMediumBlackRock22px}
  min-height: 33px;
  align-self: center;
  margin-left: 3px;
  min-width: 85px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
`;

const OverlapGroup1 = styled.div`
  ${Border1pxEbb}
  height: 42px;
  margin-top: 26px;
  display: flex;
  padding: 8.1px 16px;
  align-items: flex-end;
  min-width: 256px;
  background-color: var(--white);
  border-radius: 4px;
`;

const Email = styled.div`
  ${PoppinsNormalChicago12px}
  min-height: 19px;
  min-width: 35px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
`;

const OverlapGroup3 = styled.div`
  ${InputAndButton}
  margin-top: 11px;
  padding: 8.1px 16px;
  align-items: flex-end;
`;

const Password = styled.div`
  ${PoppinsNormalChicago12px}
  min-height: 19px;
  min-width: 63px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
`;

const OverlapGroup = styled.div`
  ${InputAndButton}
  margin-top: 10px;
  padding: 8.1px 16px;
  align-items: flex-end;
`;

const ConfirmPassword = styled.div`
  ${PoppinsNormalChicago12px}
  min-height: 19px;
  min-width: 114px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
`;

const OverlapGroup2 = styled.div`
  ${InputAndButton}
  margin-top: 30px;
  padding: 8.1px 99.3px;
  justify-content: flex-end;
  align-items: flex-end;
`;

const FlexRow = styled.div`
  height: 20px;
  margin-top: 25px;
  margin-left: 4px;
  display: flex;
  align-items: flex-start;
  min-width: 239px;
`;

const Rectangle2203 = styled.div`
  width: 13px;
  height: 13px;
  background-color: var(--white);
  border: 1px solid #707070;
`;

const AgreeToTermConditionsOfTheSite = styled.p`
  ${PoppinsMediumBlack12px}
  min-height: 19px;
  align-self: flex-end;
  margin-left: 12px;
  min-width: 214px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
`;

const Styles2 = {
  AgreeToTermConditionsOfTheSite,
  OverlapGroup,
  OverlapGroup1,
  OverlapGroup2,
  OverlapGroup3,
  Password,
  Email,
  ConfirmPassword,
  FlexRow,
  Rectangle2203,
  SignUp,
};

export default Styles2;
